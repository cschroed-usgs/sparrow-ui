/* jslint browser: true */
/*global define*/
define([
	'utils/logger',
	'ol',
	'underscore',
	'views/BaseView',
	'utils/mapUtils',
	'utils/spatialUtils',
	'olLayerSwitcher'
], function (log, ol, _, BaseView, mapUtils, spatialUtils) {

	"use strict";
	var view = BaseView.extend({
		/**
		 * Renders the map.
		 * @returns {extended Backbone.View}
		 */
		render: function () {
			this.map.setTarget(this.mapDivId);
			this.listenTo(this.collection, 'update', function(collection) {
				this.updateRegionExtent(collection);
			}, this);

			this.updateRegionExtent(this.collection);

			$('#' + this.mapDivId).append('<div id="map-loading-div">Loading model ...</div>');
			if (!this.predictionModel.geoserverEndpoint) {
				$('#map-loading-div').show();
			}
			return this;
		},

		/*
		 * Gets the extent of the region of the model.
		 * @param {ModelCollection} collection
		 */
		updateRegionExtent : function(collection) {
			var metadata = collection.getModel(this.modelId);
			var regionId = '';

			if (metadata) {
				regionId = metadata.attributes.regionId;
			}
			spatialUtils.getRegionExtent(regionId, this).done(function(extent) {
				this.map.getView().fit(extent, this.map.getSize());
			});
		},
		/*
		 * @constructs
		 * @param {Object} options
		 *      @prop {String} mapDivId - Id of the div where the map will be rendered.
		 *      @prop {Boolean} enableZoom - Optional, set to false if the zoom control should be removed. Deafult is true
		 *      @prop {String} modelId
		 *      @prop {ModelCollection} collection
		 *      @prop {MapFilterModel} model
		 *      @prop {PredictionModel} predictionModel
		 */
		initialize: function (options) {
			this.mapDivId = options.mapDivId;
			this.modelId = options.modelId;

			// This model handles fetching the layer names and styles.
			this.predictionModel = options.predictionModel;

			this.listenTo(this.model, 'change:dataSeries', this.updatePredictionModel);
			this.listenTo(this.model, "change:state change:waterBody change:waterShed change:waterSheds", this.updateModelLayer);
			this.listenTo(this.collection, 'update', this.updateModelLayer);

			this.flowlineLayer = new ol.layer.Tile({
				title: 'Flowline',
				opacity: 1
			});
			this.catchmentLayer = new ol.layer.Tile({
				title: 'Catchment',
				opacity: 0.75
			});

			this.updatePredictionModel();

			this.map = new ol.Map({
				view: new ol.View({
					center: ol.extent.getCenter(mapUtils.CONUS_EXTENT),
					zoom: 4,
					minZoom: 3
				}),
				layers: [
					new ol.layer.Group({
						title: 'Base maps',
						layers: [
							mapUtils.createStamenTonerBaseLayer(true),
							mapUtils.createWorldTopoBaseLayer(false),
							mapUtils.createWorldImageryLayer(false),
							mapUtils.createWorldStreetMapBaseLayer(false)
						]
					}),
					new ol.layer.Group({
						title: 'Model layers',
						layers: [this.catchmentLayer, this.flowlineLayer]
					})
				],
				controls: ol.control.defaults().extend([
					new ol.control.ScaleLine(),
					new ol.control.LayerSwitcher({
						tipLabel: 'Switch base layers'
					})
				])
			});

			BaseView.prototype.initialize.apply(this, arguments);
			log.debug('ModelMapView initialized');
		},

		/*
		 * Fetch the prediction model and then update the model layer
		 */
		updatePredictionModel : function() {
			//NOTE: Don't put #map-loading-div jquery element in a variable. The view may not be
			// rendered when this is called but may be when the fetch is complete
			var self = this;

			$('#map-loading-div').show();
			this.predictionModel.fetch({data : {
				'model-id' : this.modelId,
				'data-series' : this.model.get('dataSeries')
			}}).done(function() {
				log.debug('Updated predictionModel');
				self.updateModelLayer();
			}).fail(function(){
				log.debug('Unable to retrieve predictionModel');
				alert('Unable to retrieve predictionModel');
			}).always(function() {
				$('#map-loading-div').hide();
			});
		},

		/*
		 * Update the flowline and catchment source's using the current contents of the
		 * predictionModel and map filter model (model).
		 */
		updateModelLayer: function () {
			var thisModel = this.collection.getModel(this.modelId);
			var regionId = (thisModel) ? thisModel.attributes.regionId : '';
			var geoserverEndpoint = this.predictionModel.get('geoserverEndpoint');
			
			var flowlineSource = new ol.source.TileWMS({
				serverType: 'geoserver',
				params: {
					LAYERS: this.predictionModel.get('flowlineLayerName'),
					VERSION: "1.1.1"
				},
				url: geoserverEndpoint
			});
			var catchmentSource = new ol.source.TileWMS({
				serverType: 'geoserver',
				params: {
					LAYERS: this.predictionModel.get('catchmentLayerName'),
					VERSION: "1.1.1"
				},
				url: geoserverEndpoint
			});

			// If there are states used, update the WMS request to include filtering
			if (!_.isEmpty(this.model.get("state"))) {
				_.each([flowlineSource, catchmentSource], function (src) {
					var stateFilter = _.map(this, function (state) {
						return "STATE_ABBR = ''" + state + "''";
					}).join(" OR ");

					src.updateParams({
						CQL_FILTER: "(OVERLAPS(the_geom, collectGeometries(queryCollection('reference:states','the_geom','" + stateFilter + "')))"
						+ " OR WITHIN(the_geom, collectGeometries(queryCollection('reference:states','the_geom','" + stateFilter + "'))))"
					});
				}, this.model.get("state"));
			};

			// If there are watershed filters, update the WMS request to include filtering.
			if (this.model.get("waterShed") && (regionId)) {
				var waterShed = this.model.get("waterShed");
				var waterSheds = _.filter(this.model.get("waterSheds"), function (ws) {
					return ws.startsWith(this);
				}, waterShed);

				_.each([flowlineSource, catchmentSource], function (src) {

					var watershedFilter = "HUC8 LIKE ''" + waterShed + "%''";

					var params = src.getParams();
					if (params.CQL_FILTER) {
						params.CQL_FILTER += " AND ";
					} else {
						params.CQL_FILTER = "";
					}

					src.updateParams({
						CQL_FILTER: params.CQL_FILTER 
								+ "(OVERLAPS(the_geom, collectGeometries(queryCollection('huc8-simplified-overlay:" + regionId + "','the_geom','" + watershedFilter + "')))"
								+ " OR WITHIN(the_geom, collectGeometries(queryCollection('huc8-simplified-overlay:" + regionId + "','the_geom','" + watershedFilter + "'))))"
					});
				}, waterSheds);
			}

			// Update the sources for flowline and catchment layers.
			this.flowlineLayer.setSource(flowlineSource);
			this.catchmentLayer.setSource(catchmentSource);
		},

		remove: function () {
			this.map.setTarget(null); // Needed to clean up ol 3 map.
			BaseView.prototype.remove.apply(this, arguments);
			return this;
		}
	});

	return view;
});


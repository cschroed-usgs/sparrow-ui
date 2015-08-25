/* jslint browser: true */
/*global define*/
define([
	'utils/logger',
	'ol',
	'underscore',
	'views/BaseView',
	'utils/mapUtils',
	'olLayerSwitcher'
], function (log, ol, _, BaseView, mapUtils) {
	"use strict";
	var view = BaseView.extend({
		/**
		 * Renders the map.
		 * @returns {extended Backbone.View}
		 */
		render: function () {
			this.map.setTarget(this.mapDivId);
			this.getRegionExtentPromise.done(function(extent) {
				var size = this.map.getSize();
//				var extent = this.map.getView().calculateExtent(size);
				this.map.getView().fit(extent, this.map.getSize());
			});

			$('#' + this.mapDivId).append('<div id="map-loading-div">Loading model ...</div>');
			$('#map-loading-div').show();
			return this;
		},
		/*
		 * @constructs
		 * @param {Object} options
		 *      @prop mapDivId - Id of the div where the map will be rendered.
		 *      @prop enableZoom {Boolean} - Optional, set to false if the zoom control should be removed. Deafult is true
		 */
		initialize: function (options) {
			this.mapDivId = options.mapDivId;
			this.modelId = options.modelId;

			this.getRegionExtentPromise = mapUtils.getRegionExtent(options.region, this);

			this.model.on("change", this.updateModelLayer, this);

			this.flowlineLayer = new ol.layer.Tile({
				title: 'Flowline',
				opacity: 1
			});
			this.catchmentLayer = new ol.layer.Tile({
				title: 'Catchment',
				opacity: 0.3
			});

			this.updateModelLayer();
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

		updateModelLayer: function () {
			var self = this;
			var getModelLayerNamesPromise = $.Deferred();
			$.ajax({
				url: 'data/prediction',
				data: {
					'model-id': this.modelId,
					'data-series': this.model.get("dataSeries")
				},
				success: function (response) {
					log.debug('Got model layers');
					getModelLayerNamesPromise.resolve(response[0]);
					$('#map-loading-div').hide();
				},
				error: function (jqxhr, textStatus) {
					log.debug('Error in retrieving model layers');
					getModelLayerNamesPromise.reject(textStatus);
					$('#map-loading-div').hide();
					// TODO - Let's not do alerts. Need something less abrasive
					alert('Error retrieving model information from server');
				}
			});
			getModelLayerNamesPromise.done(function (response) {
				var flowlineSource = new ol.source.TileWMS({
					serverType: 'geoserver',
					params: {
						LAYERS: response.FlowLayerName,
						STYLES: response.FlowLayerDefaultStyleName
					},
					url: response.EndpointUrl
				});
				var catchmentSource = new ol.source.TileWMS({
					serverType: 'geoserver',
					params: {
						LAYERS: response.CatchLayerName,
						STYLES: response.CatchLayerDefaultStyleName
					},
					url: response.EndpointUrl
				});

				self.flowlineLayer.setSource(flowlineSource);
				self.catchmentLayer.setSource(catchmentSource);
			});
		}
	});

	return view;
});


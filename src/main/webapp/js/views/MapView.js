/*jslint browser: true */
/*global define*/
define([
	'underscore',
	'utils/logger',
	'views/BaseView',
	'views/DisambiguateRegionSelectionView',
	'ol',
	'utils/mapUtils',
	'olLayerSwitcher'
], function (_, log, BaseView, DisambiguateRegionSelectionView, ol, MapUtils) {
	"use strict";

	var selectionModel = null;

	var view = BaseView.extend({
		/**
		 * Renders the map.
		 * @returns {extended Backbone.View}
		 */
		render: function () {
			this.map.setTarget(this.mapDivId);
			return this;
		},
		/*
		 * @constructs
		 * @param {Object} options
		 *      @prop {String} mapDivId - Id of the div where the map will be rendered.
		 *      @prop {Boolean} enableZoom  - Optional, set to false if the zoom control should be removed. Deafult is true
		 *      @prop {ModelCollection} collection
		 *      @prop {SelectionModel} selectionModel
		 */
		initialize: function (options) {
			options.enableZoom = _.has(options, 'enableZoom') ? options.enableZoom : true;
			this.mapDivId = options.mapDivId;

			selectionModel = options.selectionModel;

			this.map = new ol.Map({
				view: new ol.View({
					center: ol.extent.getCenter(MapUtils.CONUS_EXTENT),
					zoom: 4,
					minZoom: 3
				}),
				layers : [
					new ol.layer.Group({
						title: 'Base maps',
						layers: [
							MapUtils.createWorldTopoBaseLayer(false),
							MapUtils.createWorldImageryLayer(false),
							MapUtils.createWorldStreetMapBaseLayer(false),
							MapUtils.createStamenTonerBaseLayer(true)
						]
					}),
					new ol.layer.Group({
						title: 'Regions',
						layers: []
					})
				],
				controls: ol.control.defaults({
					zoom: options.enableZoom
				}).extend([new ol.control.ScaleLine(),
					new ol.control.LayerSwitcher({
						tipLabel: 'Switch base layers'
					})])
			});

			this.dRegionView = new DisambiguateRegionSelectionView({
				el: '#disambiguation-modal',
				selectionModel: selectionModel,
				collection : this.collection
			});

			this.updateRegionLayerGroup(this.collection);
			this.listenTo(this.collection, 'update', this.updateRegionLayerGroup);

			this.listenTo(selectionModel, 'change:region', _.bind(function () {
				MapUtils.highlightRegion(this.model.get("region"), this.map);
			}, {
				map : this.map,
				model : selectionModel
			}));

			BaseView.prototype.initialize.apply(this, arguments);
			log.debug("Map View initialized");
		},

		updateRegionLayerGroup : function(collection) {
			var regionLayerIds = _.map(collection.getRegions(), function(r) {
				return r.id;
			});
			var regionLayers = _.map(regionLayerIds, function (id) {
				return MapUtils.createRegionalCoverageLayers(id);
			});

			// Remove the previous region layer group, create a new one with the new regionLayers
			var mapGroups = this.map.getLayers();
			var regionGroup = new ol.layer.Group({
				title : 'Regions',
				layers : regionLayers
			});

			this.map.removeLayer(mapGroups.item(1));
			this.map.addLayer(regionGroup);

			// Don't add the click handler if no region layers to interact with
			if (regionLayerIds.length !== 0) {
				this.map.on('click', function(ev) {
					var selectedFeatures = [];
					var selectedRegions;
					this.map.forEachFeatureAtPixel(ev.pixel, function(feature, layer) {
						selectedFeatures.push(feature);
						return false;
					});

					selectedRegions = _.map(selectedFeatures, function (f) {
						return {id: f.getId().split(".")[0], name: f.getProperties().Name};
					});

					if (selectedRegions.length > 1) {
						// Multiple regions were selected. Display the disambiguation
						// modal window
						this.dRegionView.show(selectedRegions);

					} else if (selectedRegions.length === 1) {
						selectionModel.set('region', selectedRegions[0].id);
					}
				}, this);
			}
		},

		remove : function() {
			this.dRegionView.remove();
			this.map.setTarget(null);
			BaseView.prototype.remove.apply(this, arguments);
			return this;
		}
	});



	return view;
});

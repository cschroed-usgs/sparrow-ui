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

	var regionLayerNames = [
		"national_mrb_e2rf1",
		"mrb01_nhd",
		"mrb02_mrbe2rf1",
		"mrb03_mrbe2rf1",
		"mrb04_mrbe2rf1",
		"mrb05_mrbe2rf1",
		"mrb06_mrbe2rf1",
		"mrb07_mrbe2rf1",
		"chesa_nhd"
	];

	var selectModelView = null;
	var olMap = null;

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
		 *      @prop mapDivId - Id of the div where the map will be rendered.
		 *      @prop enableZoom {Boolean} - Optional, set to false if the zoom control should be removed. Deafult is true
		 */
		initialize: function (options) {
			options.enableZoom = _.has(options, 'enableZoom') ? options.enableZoom : true;
			this.mapDivId = options.mapDivId;

			var regionLayers = _.map(regionLayerNames, function (name) {
				return MapUtils.createRegionalCoverageLayers(name);
			});

			this.map = new ol.Map({
				view: new ol.View({
					center: ol.extent.getCenter(MapUtils.CONUS_EXTENT),
					zoom: 4,
					minZoom: 3
				}),
				layers: [
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
						layers: regionLayers
					})
				],
				controls: ol.control.defaults({
					zoom: options.enableZoom
				}).extend([new ol.control.ScaleLine(),
					new ol.control.LayerSwitcher({
						tipLabel: 'Switch base layers'
					})])
				});

			var hoverSelector = new ol.interaction.Select({
				condition: ol.events.condition.pointerMove,
				layers: regionLayers,
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: [0, 0, 255, 0.75]
					}),
					fill: new ol.style.Fill({
						color: [150, 150, 150, 0.75]
					})
				})
			});

			hoverSelector.setProperties({
				type: "select",
				selectType: "hover"
			});

			// Add on-hover events for features
			this.map.addInteraction(hoverSelector);

			var clickSelector = new ol.interaction.Select({
				condition: ol.events.condition.singleClick,
				multi: true,
				layers: regionLayers,
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: [0, 0, 255, 0.75]
					}),
					fill: new ol.style.Fill({
						color: [200, 200, 200, 0.75]
					})
				})
			});

			clickSelector.setProperties({
				type: "select",
				selectType: "click"
			});

			clickSelector.on("select", function (evt) {
				var selectedFeatures = evt.selected;
				var selectedRegions = _.map(selectedFeatures, function (f) {
					return {id: f.getId().split(".")[0], name: f.getProperties().Name};
				});

				if (selectedRegions.length > 1) {
					// Multiple regions were selected. Display the disambiguation 
					// modal window
					var dRegionView = new DisambiguateRegionSelectionView({
						regions: selectedRegions,
						el: '#page-content-container'
					});
					dRegionView.render();

					// Bind to the view's modal window 
					dRegionView.$el.find(dRegionView.modalId + ' button').one('click', function (evt) {
						var buttonId = evt.target.getAttribute('id'),
							insignificantIdLength = "button-region-".length,
							regionId = buttonId.substr(insignificantIdLength);
							
						if (regionId !== 'cancel') {
							selectModelView.model.set('region', regionId);
						} else {
							selectModelView.model.set('region', '');
						}
					});
				} else {
					selectModelView.model.set('region', selectedRegions[0].id);
				}
			});

			this.map.addInteraction(clickSelector);

			selectModelView = options.selectModelView;
			olMap = this.map;
			MapUtils.map = olMap;

			BaseView.prototype.initialize.apply(this, arguments);
			log.debug("Map View initialized");
		}
	});

	return view;
});

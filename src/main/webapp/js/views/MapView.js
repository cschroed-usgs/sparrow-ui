/*jslint browser: true */
/*global Infinity*/
/*global define*/
define([
	'underscore',
	'utils/logger',
	'views/BaseView',
	'ol',
	'utils/mapUtils',
	'olLayerSwitcher'
], function (_, log, BaseView, ol, mapUtils) {
	"use strict";
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
			var regionLayers = _.map([
				"mrb01_nhd",
				"mrb02_mrbe2rf1",
				"mrb03_mrbe2rf1",
				"mrb04_mrbe2rf1",
				"mrb05_mrbe2rf1",
				"mrb06_mrbe2rf1",
				"mrb07_mrbe2rf1"
			], function (name) {
				return mapUtils.createRegionalCoverageLayers(name);
			});

			this.mapDivId = options.mapDivId;
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
							mapUtils.createStamenTonerBaseLayer(false),
							mapUtils.createWorldTopoBaseLayer(false),
							mapUtils.createWorldImageryLayer(false),
							mapUtils.createWorldStreetMapBaseLayer(true)
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

			// Add on-hover events for features
			this.map.addInteraction(new ol.interaction.Select({
				condition: ol.events.condition.pointerMove,
//				multi: true,
				layers : regionLayers,
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: [0, 0, 255, 0.75]
					}),
					fill: new ol.style.Fill({
						color: [150, 150, 150, 0.75]
					}),
					zIndex: Infinity
				})
			}));

			var onClickSelect = new ol.interaction.Select({
				condition: ol.events.condition.singleClick,
				multi: true,
				layers : regionLayers,
				style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: [0, 0, 255, 0.75]
					}),
					fill: new ol.style.Fill({
						color: [200, 200, 200, 0.75]
					}),
					zIndex: Infinity
				})
			});
			onClickSelect.on("select", function (evt) {
				var selectedFeatures = evt.selected;
				var selectedRegionIds = _.map(selectedFeatures, function (f) {
					return f.getId();
				});
				log.debug("Selected region ID(s): " + selectedRegionIds);
			});

			this.map.addInteraction(onClickSelect);

			BaseView.prototype.initialize.apply(this, arguments);
			log.debug("Map View initialized");
		}
	});

	return view;
});

/*jslint browser: true */
/*global Backbone*/
/*global ol*/
define([
	'backbone',
	'utils/logger',
	'ol',
	'utils/mapUtils',
	'olLayerSwitcher'
], function (Backbone, logger, ol, mapUtils, olLayerSwitcher) {
	"use strict";
	var view = Backbone.View.extend({
		render: function () {
			this.map.setTarget(this.mapDivId);
			return this;
		},
		initialize: function (options) {
			this.LOG = logger.init();
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
					})
				],
				controls: ol.control.defaults().extend([
					new ol.control.ScaleLine(),
					new ol.control.LayerSwitcher({
						tipLabel: 'Switch base layers'
					})
				])
			});

			Backbone.View.prototype.initialize.apply(this, arguments);
			this.render();
			this.LOG.debug("Map View rendered");
		}
	});

	return view;
});

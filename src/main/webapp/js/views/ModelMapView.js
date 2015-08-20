/* jslint browser: true */

define([
	'utils/logger',
	'ol',
	'views/BaseView',
	'utils/mapUtils',
	'olLayerSwitcher'
], function(log, ol, BaseView, mapUtils) {
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
					})])
			});

			BaseView.prototype.initialize.apply(this, arguments);
			log.debug('ModelMapView initialized')
		}
	});

	return view;
});


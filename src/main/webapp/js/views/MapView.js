/*jslint browser: true */
define([
	'views/BaseView',
	'ol',
	'utils/mapUtils',
	'olLayerSwitcher'
], function (BaseView, ol, mapUtils) {
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
		 *      @prop enableZoom -
		 */
		initialize: function (options) {
			var defaultControls =
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
				controls: ol.control.defaults({
					zoom : options.enableZoom
				}).extend([new ol.control.ScaleLine(),
					new ol.control.LayerSwitcher({
						tipLabel: 'Switch base layers'
					})])
			});

			BaseView.prototype.initialize.apply(this, arguments);
			this.LOG.debug("Map View rendered");
		}
	});

	return view;
});

/*jslint browser: true */
/*global Backbone*/
/*global ol*/

var SP = SP || {};

SP.views = SP.views || {};

(function() {
	"use strict";

	SP.views.MapView = Backbone.View.extend({

		render : function() {
			this.map.setTarget(this.mapDivId);
			return this;
		},

		initialize : function(options) {
			var ZYX = '/MapServer/tile/{z}/{y}/{x}';

			this.mapDivId = options.mapDivId;
			this.map = new ol.Map({
				view : new ol.View({
					center : ol.extent.getCenter(SP.utils.mapUtils.CONUS_EXTENT),
					zoom : 4,
					minZoom : 3
				}),
				layers : [
					new ol.layer.Group({
						title : 'Base maps',
						layers : [
							SP.utils.mapUtils.createStamenTonerBaseLayer(false),
							SP.utils.mapUtils.createWorldTopoBaseLayer(false),
							SP.utils.mapUtils.createWorldImageryLayer(false),
							SP.utils.mapUtils.createWorldStreetMapBaseLayer(true)
						]
					})
				],
				controls : ol.control.defaults().extend([
					new ol.control.ScaleLine(),
					new ol.control.LayerSwitcher({
						tipLabel : 'Switch base layers'
					})
				])
			});

			Backbone.View.prototype.initialize.apply(this, arguments);
			this.render();
		}
	});

}());



/*jslint browser: true */
/*global Backbone*/
/*global ol*/

var SP = SP || {};

SP.views = SP.views || {};

(function() {
	"use strict";

	SP.views.MapView = Backbone.View.extend({

		CONUS_EXTENT : [-14819398.304233, -92644.611414691, -6718296.2995848, 9632591.3700111],

		render : function() {
			this.map.setTarget(this.mapDivId);
			return this;
		},

		initialize : function(options) {
			var ZYX = '/MapServer/tile/{z}/{y}/{x}';

			this.mapDivId = options.mapDivId;
			this.map = new ol.Map({
				view : new ol.View({
					center : ol.extent.getCenter(this.CONUS_EXTENT),
					zoom : 4
				}),
				layers : [
					new ol.layer.Group({
						title : 'Base maps',
						layers : [
							new ol.layer.Tile({
								title : 'World Street Map',
								type: 'base',
								source : new ol.source.XYZ({
									url : "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map" + ZYX
								})
							}),
							new ol.layer.Tile({
								title: 'Gray',
								type: 'base',
								visible: false,
								source: new ol.source.Stamen({
									layer: 'toner'
								})

							})
						]
					})
				]
			});

			var layerSwitcher = new ol.control.LayerSwitcher({
				tipLabel :'Switch base layers'
			});
			this.map.addControl(layerSwitcher);

			Backbone.View.prototype.initialize.apply(this, arguments);
			this.render();
		}
	});

}());



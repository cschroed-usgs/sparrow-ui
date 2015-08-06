/*jslint browser : true*/
/*global Backbone*/
define([
	'backbone',
	'utils/logger',
	'views/MapView'
], function (Backbone, logger, MapView) {
	"use strict";
	var LOG;
	var applicationRouter = Backbone.Router.extend({
		routes: {
			'': 'mapView'
		},
		initialize: function () {
			this.LOG = logger.init();
			this.on("route:mapView", function () {
				this.LOG.trace("Routing to map view");
				
				new MapView({
					mapDivId: 'map-container'
				});
			});
		}
	});

	return applicationRouter;
});

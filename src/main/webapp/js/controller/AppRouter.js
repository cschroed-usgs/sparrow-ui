/*jslint browser : true*/
define([
	'backbone',
	'utils/logger',
	'views/MapView'
], function (Backbone, logger, MapView) {
	"use strict";
	var applicationRouter = Backbone.Router.extend({
		routes: {
			'': 'homeView'
		},
		initialize: function () {
			this.LOG = logger.init();
			this.on("route:homeView", function () {
				this.LOG.trace("Routing to home view");

				this.currentView = new HomeView();
			});
		}
	});

	return applicationRouter;
});

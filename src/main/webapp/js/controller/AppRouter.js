/*jslint browser : true*/
define([
	'backbone',
	'utils/logger',
	'views/HomeView'
], function (Backbone, logger, HomeView) {
	"use strict";
	var applicationRouter = Backbone.Router.extend({
		routes: {
			'': 'homeView'
		},
		initialize: function () {
			this.LOG = logger.init();
			this.on("route:homeView", function () {
				this.LOG.trace("Routing to home view");

				this.currentView = new HomeView({
					el : $('#page-content-container')
				});
			});
		}
	});

	return applicationRouter;
});

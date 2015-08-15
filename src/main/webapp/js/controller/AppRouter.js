/*jslint browser : true*/
define([
	'backbone',
	'utils/logger',
	'views/HomeView'
], function (Backbone, log, HomeView) {
	"use strict";
	var applicationRouter = Backbone.Router.extend({
		routes: {
			'': 'homeView'
		},
		initialize: function () {
			log.trace("Initializing router");
			this.on("route:homeView", function () {
				log.trace("Routing to home view");

				this.currentView = new HomeView({
					el : $('#page-content-container')
				}).render();
			});
		}
	});

	return applicationRouter;
});

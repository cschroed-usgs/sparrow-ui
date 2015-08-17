/*jslint browser : true*/
define([
	'backbone',
	'utils/logger',
	'collections/ModelCollection',
	'views/HomeView'
], function (Backbone, log, ModelCollection, HomeView) {
	"use strict";
	var applicationRouter = Backbone.Router.extend({
		routes: {
			'': 'homeView'
		},

		applicationContextDiv : '#page-content-container',

		initialize: function () {
			log.trace("Initializing router");

			// This collection of Sparrow models  will feed into multiple
			// views so create it here at the top level and pass it into multiple
			// views in order so that they can decorate their controls
			this.modelCollection = new ModelCollection();
			this.modelCollection.fetch();
		},

		homeView : function() {
			log.trace("Routing to home view");

			this.showView(HomeView, {
				collection : this.modelCollection
			});
		},

		showView : function(view, opts) {
			var newEl = $('<div>');

			this.removeCurrentView();
			$(this.applicationContextDiv).append(newEl);
			this.currentView = new view($.extend({
				el: newEl,
				router: this
			}, opts)).render();
		},

		removeCurrentView : function() {
			if (this.currentView) {
				this.currentView.remove();
			}
		}

	});

	return applicationRouter;
});

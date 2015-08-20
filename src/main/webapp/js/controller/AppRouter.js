/*jslint browser : true*/
define([
	'backbone',
	'utils/logger',
	'collections/ModelCollection',
	'views/HomeView',
	'views/ModelDisplayView'
], function (Backbone, log, ModelCollection, HomeView, ModelDisplayView) {
	"use strict";
	var applicationRouter = Backbone.Router.extend({
		routes: {
			'': 'homeView',
			'model/:modelId/constituent/:constituent/region/:region' : 'modelDisplayView'
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

		modelDisplayView : function(modelId, constituent, region) {
			log.trace('Routing to model display view for model ' + modelId + ', constituent ' + constituent +
				' and region ' + region);

			this.showView(ModelDisplayView, {
				collection : this.modelCollection,
				modelId : modelId,
				constituent : constituent,
				region : region
			});
		},

		showView : function(view, opts) {
			var newEl = $('<div />');

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

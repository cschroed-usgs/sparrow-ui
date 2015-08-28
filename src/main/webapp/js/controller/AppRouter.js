/*jslint browser : true*/
/*global define*/
define([
	'backbone',
	'underscore',
	'utils/logger',
	'collections/ModelCollection',
	'views/ErrorView',
	'views/HomeView',
	'views/ModelDisplayView'
], function (Backbone, _, log, ModelCollection, ErrorView, HomeView, ModelDisplayView) {
	"use strict";
	var applicationRouter = Backbone.Router.extend({
		routes: {
			'': 'homeView',
			'model/:modelId' : 'modelDisplayView'
		},

		applicationContextDiv : '#page-content-container',

		initialize: function () {
			var self = this;
			log.trace("Initializing router");

			// This collection of Sparrow models  will feed into multiple
			// views so create it here at the top level and pass it into multiple
			// views in order so that they can decorate their controls
			this.modelCollection = new ModelCollection();
			this.modelCollection.fetch().done(function() {
				if (self.modelCollection.length === 0) {
					log.error('No metadata in sciencebase response');
					self.errorView();
				}
			})
			.fail(function(jqXHR, textStatus) {
				log.error('Error fetching meta data from sciencebase with error ' + textStatus);
				self.errorView();
			});
		},

		errorView : function() {
			log.trace("Routing to error");
			this.showView(ErrorView);
		},

		homeView : function() {
			log.trace("Routing to home view");

			this.showView(HomeView, {
				collection : this.modelCollection
			});
		},

		modelDisplayView : function(modelId) {
			log.trace('Routing to model display view for model ' + modelId);

			this.showView(ModelDisplayView, {
				collection : this.modelCollection,
				modelId : modelId
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

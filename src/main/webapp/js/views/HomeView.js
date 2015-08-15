/*jslint browser: true */
define([
	'jquery',
	'handlebars',
	'views/BaseView',
	'views/MapView',
	'views/SelectModelView',
	'models/SelectionModel',
	'views/SearchView',
	'text!templates/home.html'
], function($, Handlebars, BaseView, MapView, SelectModelView, SelectionModel, SearchView, hbTemplate) {
	"use strict";

	var view = BaseView.extend({

		template : Handlebars.compile(hbTemplate),

		/*
		 * Renders the object's template using it's context into the view's element.
		 * @returns {extended BaseView}
		 */
		render : function() {
			BaseView.prototype.render.apply(this, arguments);
			this.mapView.render();
			this.selectModelView.setElement(this.$('.model-selection-container')).render();
			this.searchView.render();
			return this;
		},

		/*
		 * @constructs
		 * @param {Object} options
		 *		@prop router {Backbone.Router instance} - defaults to null
		 *		@prop template {Function} optional - Returns html to be rendered. Will override the template property.
		 *		@prop context {Object} to be used when rendering templateName - defaults to {}
		 *      @prop el {Jquery element} - render view in $el.
		 */
		initialize : function(options) {
			this.selectionModel = new SelectionModel();
			
			this.mapView = new MapView({
				mapDivId : 'map-container',
				enableZoom : false
			});
			
			this.selectModelView = new SelectModelView({
				model : this.selectionModel,
				el : '.model-selection-container'
			});
			
			this.searchView = new SearchView();
			
			BaseView.prototype.initialize.apply(this, arguments);
		},

		remove : function() {
			this.mapView.remove();
			this.selectModelView.remove();
			BaseView.prototype.remove.apply(this, arguments);
		}
	});

	return view;
});



/*jslint browser: true */

define([
	'handlebars',
	'views/BaseView',
	'views/ModelMapView',
	'views/MapFilterView',
	'views/SearchView',
	'utils/logger',
	'text!templates/home.html'
], function(Handlebars, BaseView, ModelMapView, log){
	"use strict";

	var view = BaseView.extend({

		template: Handlebars.compile(hbTemplate),

		/*
		 * Renders the object's template using it's context into the view's element.
		 * @returns {extended BaseView}
		 */
		render: function () {
			BaseView.prototype.render.apply(this, arguments);
			this.mapView.render();
			this.selectionModelView.setElement(this.$('#model-selection-container')).render();
			this.navView.setElement(this.$('nav'))
			return this;
		},

		initialize : function(options) {
			this.selectionModel = new SelectionModel({
				constituent : options.constituent,
				region : options.region,
			});
			this.navView = new NavView({
				el : 'nav'
			});
			this.mapView = ModelMapView({
				mapDivId : 'map-container'
			});
			this.selectionModelView = new SelectModelView({
				collection : this.collection,
				model : this.selectionModel,
				el : '#model-selection-container'
			});
			this.mapFilterView = new MapFilterView({
				el : '#map-sidebar-container',
				collection : this.collection,
				modelId : options.modelId
			});
		},

		remove : function() {
			this.navView.remove();
			this.mapView.remove();
			this.selectionModelView.remove();
			this.mapFilterView.remove();
		}


	});

	return view;
});



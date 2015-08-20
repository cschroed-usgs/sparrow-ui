/*jslint browser: true */

define([
	'handlebars',
	'models/SelectionModel',
	'views/BaseView',
	'views/NavView',
	'views/ModelMapView',
	'views/SelectModelView',
	'views/MapFilterView',
	'utils/logger',
	'text!templates/home.html'
], function(Handlebars, SelectionModel, BaseView, NavView, ModelMapView, SelectModelView, MapFilterView, log, hbTemplate){
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
			this.navView.setElement(this.$('nav')).render();
			this.mapFilterView.setElement(this.$('#map-sidebar-container')).render();
			return this;
		},

		initialize : function(options) {
			this.selectionModel = new SelectionModel({
				constituent : options.constituent,
				region : options.region
			});
			this.navView = new NavView({
				el : 'nav'
			});
			this.mapView = new ModelMapView({
				mapDivId : 'map-container'
			});
			this.selectionModelView = new SelectModelView({
				collection : this.collection,
				model : this.selectionModel,
				el : '#model-selection-container',
				disabled : true
			});
			this.mapFilterView = new MapFilterView({
				el : '#map-sidebar-container',
				collection : this.collection,
				modelId : options.modelId
			});
			BaseView.prototype.initialize.apply(this, arguments);
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



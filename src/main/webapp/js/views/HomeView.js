/*jslint browser: true */
define([
	'handlebars',
	'views/BaseView',
	'views/NavView',
	'views/MapView',
	'views/SelectModelView',
	'models/SelectionModel',
	'utils/logger',
	'text!templates/home.html'
], function (Handlebars, BaseView, NavView, MapView, SelectModelView, SelectionModel, log, hbTemplate) {
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
			this.selectModelView.setElement(this.$('#model-selection-container')).render();
			return this;
		},
		/*
		 * @constructs
		 * @param {Object} options
		 *		@prop collection {ModelCollection instance}
		 *      @prop el {Jquery element} - render view in $el.
		 */
		initialize: function (options) {
			this.selectionModel = new SelectionModel();

			this.navView = new NavView({
				el : 'nav',
				router : options.router
			});
			this.mapView = new MapView({
				mapDivId: 'map-container',
				enableZoom: false
			});
			this.selectModelView = new SelectModelView({
				collection: this.collection,
				model : this.selectionModel,
				el: '#model-selection-container',
				router : options.router
			});

			BaseView.prototype.initialize.apply(this, arguments);
		},
		remove: function () {
			this.navView.remove();
			this.mapView.remove();
			this.selectModelView.remove();
			BaseView.prototype.remove.apply(this, arguments);
			return this;
		}
	});

	return view;
});

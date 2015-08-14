/*jslint browser: true */
define([
	'handlebars',
	'views/BaseView',
	'views/MapView',
	'views/SelectModelView',
	'models/SelectionModel',
	'text!templates/home.html'
], function(Handlebars, BaseView, MapView, SelectModelView, SelectionModel, hbTemplate) {
	var view = BaseView.extend({

		template : Handlebars.compile(hbTemplate),

		/*
		 * Renders the object's template using it's context into the view's element.
		 * @returns {extended BaseView}
		 */
		render : function() {
			BaseView.prototype.render.apply(this, arguments);
			this.mapView = new MapView({
				mapDivId : 'map-container',
				enableZoom : false
			});
			this.selectModelView = new SelectModelView({
				el : '.model-selection-container',
				model : this.selectionModel
			});
			this.mapView.render();
			this.selectModelView.render();
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
			BaseView.prototype.initialize.apply(this, arguments);
		}
	});

	return view;
});



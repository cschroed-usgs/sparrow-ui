/*jslint browser: true */
/*global define*/
define([
	'handlebars',
	'models/MapFilterModel',
	'models/PredictionModel',
	'views/BaseView',
	'views/NavView',
	'views/ModelMapView',
	'views/ModelLegendView',
	'views/ResetView',
	'views/MapFilterView',
	'utils/logger',
	'text!templates/home.html'
], function (Handlebars, MapFilterModel, PredictionModel, BaseView, NavView, ModelMapView, ModelLegendView, ResetView, MapFilterView, log, hbTemplate) {
	"use strict";

	var view = BaseView.extend({

		template: Handlebars.compile(hbTemplate),

		/*
		 * Renders the object's template using it's context into the view's element.
		 * @returns {extended BaseView}
		 */

		render: function () {
			BaseView.prototype.render.apply(this, arguments);
			this.$('#map-loading-div').show();
			this.mapView.render();
			this.legendView.setElement(this.$('#legend-container')).render();
			this.resetView.setElement(this.$('#model-selection-container')).render();
			this.navView.setElement(this.$('nav')).render();
			this.mapFilterView.setElement(this.$('#map-sidebar-container')).render();
			return this;
		},

		/*
		 * @constructs
		 * @param {Object} options
		 *     @prop {String} el - selector where the view should be rendered
		 *     @prop {String} modelId - id of the model to be viewed
		 *     @prop {ModelCollection} collection - application meta data.
		 *     @prop {AppRouter} router
		 */
		initialize : function (options) {
			BaseView.prototype.initialize.apply(this, arguments);

			this.mapFilterModel = new MapFilterModel();
			this.predictionModel = new PredictionModel();

			this.navView = new NavView({
				el : 'nav'
			});
			this.resetView = new ResetView({
				el : 'model-selection-container',
				modelId : options.modelId,
				collection : this.collection,
				router : this.router
			});
			this.mapView = new ModelMapView({
				mapDivId : 'map-container',
				modelId : options.modelId,
				model : this.mapFilterModel,
				collection : this.collection,
				predictionModel : this.predictionModel
			});
			this.legendView = new ModelLegendView({
				el : '#legend-container',
				model : this.predictionModel,
				mapFilterModel : this.mapFilterModel
			});

			this.mapFilterView = new MapFilterView({
				el : '#map-sidebar-container',
				collection : this.collection,
				modelId : options.modelId,
				model : this.mapFilterModel
			});
		},

		remove : function () {
			this.navView.remove();
			this.mapView.remove();
			this.resetView.remove();
			this.mapFilterView.remove();
			BaseView.prototype.remove.apply(this, arguments);
			return this;
		}
	});

	return view;
});



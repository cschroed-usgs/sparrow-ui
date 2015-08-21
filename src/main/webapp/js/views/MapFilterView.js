/*jslint browser: true */
define([
	'underscore',
	'jquery',
	'utils/logger',
	'views/BaseView',
	'handlebars',
	'models/MapFilterModel',
	'text!templates/map_filter.html'
], function (_, $, log, BaseView, Handlebars, MapFilterModel, filterTemplate) {
	"use strict";

	var view = BaseView.extend({
		template: Handlebars.compile(filterTemplate),

		events: {
			'change #state': 'stateChange',
			'change #receiving-water-body': 'waterBodyChange',
			'change #watershed': 'waterShedChange',
			'change #data-series': 'dataSeriesChange',
			'change #group-result-by': 'groupResultsByChange'
		},

		initialize: function (options) {
			this.listenTo(this.model, 'change', this.modelChange);
			BaseView.prototype.initialize.apply(this, arguments);
		},
		stateChange: function (evt) {
			this.model.set("state", $(evt.target).val());
		},
		waterBodyChange: function (evt) {
			this.model.set("waterBody", $(evt.target).val());
		},
		waterShedChange: function (evt) {
			this.model.set("waterShed", $(evt.target).val());
		},
		dataSeriesChange: function (evt) {
			this.model.set("dataSeries", $(evt.target).val());
		},
		groupResultsByChange: function (evt) {
			this.model.set("groupResultsBy", $(evt.target).val());
		},
		modelChange: function (model) {
			log.debug("Map Filter model changed to " + JSON.stringify(model.attributes));
		}
	});

	return view;
});
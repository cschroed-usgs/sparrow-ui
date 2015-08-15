/*jslint browser: true */
define([
	'underscore',
	'jquery',
	'utils/logger',
	'backbone',
	'handlebars',
	'models/MapFilterModel',
	'text!templates/map_filter.html'
], function (_, $, log, Backbone, Handlebars, MapFilterModel, filterTemplate) {
	"use strict";

	var view = Backbone.View.extend({
		template: Handlebars.compile(filterTemplate),
		model: new MapFilterModel(),
		events: {
			'change #state': 'stateChange',
			'change #receiving-water-body': 'waterBodyChange',
			'change #watershed': 'waterShedChange',
			'change #data-series': 'dataSeriesChange',
			'change #group-result-by': 'groupResultsByChange'
		},
		render: function () {
			this.setElement($(this.el));
			var html = this.template();
			this.$el.html(html);

			return this;
		},
		initialize: function () {

			var opts = arguments ? arguments[0] : null;
			if (_.has(opts, 'el')) {
				this.el = opts.el;
			} else {
				this.el = "#map-sidebar-container";
			}

			if (_.has(opts, 'template')) {
				this.template = opts.template;
			}

			this.model.on('change', this.modelChange, this);
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
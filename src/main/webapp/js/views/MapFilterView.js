/*jslint browser: true */
define([
	'underscore',
	'jquery',
	'utils/logger',
	'utils/spatialUtils',
	'views/BaseView',
	'handlebars',
	'text!templates/map_filter.html'
], function (_, $, log, SpatialUtils, BaseView, Handlebars, filterTemplate) {
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
		render: function () {
			SpatialUtils.getStatesForRegion(this.selectionModel.get("region"), this).done(function (states) {
				this.context.states = states;
				_.extend(this.context, this.model.attributes);
				BaseView.prototype.render.apply(this, arguments);
			});
			return this;
		},
		initialize: function (options) {
			this.selectionModel = options.selectionModel;
			this.listenTo(this.model, 'change', this.modelChange);
			BaseView.prototype.initialize.apply(this, arguments);
			Handlebars.registerHelper('isSelected', function(text, obj) {
				if (text === obj) {
					return new Handlebars.SafeString('selected=true');
				} else {
					return '';
				}
			})
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
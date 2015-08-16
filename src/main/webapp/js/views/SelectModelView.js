/*jslint browser : true */
define([
	'handlebars',
	'underscore',
	'utils/logger',
	'jquery',
	'views/BaseView',
	'models/SelectionModel',
	'text!templates/model_selection.html'
], function (Handlebars, _, log, $, BaseView, SelectionModel, hbTemplate) {
	"use strict";

	var view = BaseView.extend({
		model: new SelectionModel(),
		events: {
			'change .constituent-select': 'changeConstituent',
			'change .region-select': 'changeRegion'
		},
		template: Handlebars.compile(hbTemplate),
		render: function () {
			if (this.$el.length === 0) {
				this.$el = $(this.el);
			}
			BaseView.prototype.render.apply(this, arguments);
			return this;
		},
		/*
		 * @constructs
		 * @param {Object} options
		 *      @prop {SelectionModel} - model
		 */
		initialize: function (options) {
			this.setModelListeners();
			this.listenTo(this.collection, 'update', this.updateContext);
			BaseView.prototype.initialize.apply(this, arguments);
		},
		updateContext: function (collection) {
			this.context.constituents = _.uniq(_.pluck(collection.toJSON(), 'constituent'));
			this.context.regions = _.uniq(_.pluck(collection.toJSON(), 'region'));
			this.render();
		},
		setModelListeners: function () {
			this.listenTo(this.model, 'change:constituent', this.updateConstituent);
			this.listenTo(this.model, 'change:region', this.updateRegion);
		},
		updateConstituent: function (model) {
			this.$('.constituent-select').val(model.get('constituent'));
		},
		updateRegion: function (model) {
			this.$('.region-select').val(model.get('region'));
		},
		changeConstituent: function (ev) {
			this.model.set('constituent', ev.currentTarget.value);
		},
		changeRegion: function (ev) {
			this.model.set('region', ev.currentTarget.value);
		}
	});

	return view;
});



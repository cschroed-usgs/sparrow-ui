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
			this.listenTo(this.model, 'change', this.modelChanged);
		},
		/**
		 * A funnel function which listens to any model change and checks whether 
		 * both a region and constiuent has been chosen.
		 */
		modelChanged: function (model) {
			var c = model.attributes.constituent,
				r = model.attributes.region;
			if (r && c) {
				log.debug("A model has been chosen. Constituent: " + c + ", Region: " + r);
			}
		},
		updateConstituent: function (model) {
			this.$('.constituent-select').val(model.get('constituent'));
		},
		updateRegion: function (model) {
			this.$('.region-select').val(model.get('region'));
		},
		changeConstituent: function (ev) {
			var value = ev.currentTarget.value;
			log.debug("New constituent chosen: " + value);
			this.model.set('constituent', value);
		},
		changeRegion: function (ev) {
			var value = ev.currentTarget.value;
			log.debug("New region chosen: " + value);
			this.model.set('region', value);
		}
	});

	return view;
});



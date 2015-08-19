/*jslint browser : true */
define([
	'handlebars',
	'underscore',
	'utils/logger',
	'jquery',
	'views/BaseView',
	'views/SelectMenuView',
	'text!templates/model_selection.html'
], function (Handlebars, _, log, $, BaseView, SelectMenuView, hbTemplate) {
	"use strict";

	var view = BaseView.extend({

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
			this.constituentSelectView.setElement(this.$('.constituent-select')).updateMenuOptions(this.context.constituents);
			this.regionSelectView.setElement(this.$('.region-select')).updateMenuOptions(this.context.regions);

			return this;
		},
		/*
		 * @constructs
		 * @param {Object} options
		 *      @prop {SelectionModel} model
		 *      @prop {ModelCollection} collection
		 *      @prop {Jquery selector} el - Where view will be rendered.
		 */
		initialize: function (options) {
			this.context = {};
			this.updateContext(this.collection);

			this._setModelListeners();
			this.listenTo(this.collection, 'update', this.updateView);

			this.constituentSelectView = new SelectMenuView({
				el : '.constituent-select',
				sortBy : 'text',
				hasPlaceholder : true,
				menuOptions : []
			});
			this.regionSelectView = new SelectMenuView({
				el : '.region-select',
				sortBy : 'text',
				hasPlaceholder : true,
				menuOptions : []
			});
			BaseView.prototype.initialize.apply(this, arguments);
		},

		/*
		 * Sets up model listeners for the model
		 */
		_setModelListeners: function () {
			this.listenTo(this.model, 'change:constituent', this.updateConstituent);
			this.listenTo(this.model, 'change:region', this.updateRegion);
			this.listenTo(this.model, 'change', this.modelChanged);
		},

		/*
		 *
		 * @param {Array of String} optionList
		 * @param {String} selectedOption
		 * @returns {Array of Objects} - suitable for feeding the SelectMenuView.updateMenuOptions
		 */
		_menuOptions : function(optionList, selectedOption) {
			selectedOption = selectedOption ? selectedOption : '';
			return _.map(optionList, function(option) {
				return {
					text : option,
					value : option,
					selected : option === selectedOption
				};
			});

		},

		updateContext : function(collection) {
			this.context.constituents = this._menuOptions(collection.getConstituents());
			this.context.regions = this._menuOptions(collection.getRegions());
		},

		/*
		 * Renders the view by retrieving the latest data from collection.
		 * @param {type} collection
		 * @returns this view
		 */
		updateView: function (collection) {
			this.updateContext(collection)
			return this.render();
		},

		/**
		 * A funnel function which listens to any model change and checks whether
		 * both a region and constiuent has been chosen.
		 * @param {SelectionModel} model
		 */
		modelChanged: function (model) {
			var c = model.attributes.constituent,
				r = model.attributes.region;
			if (r && c) {
				log.debug("A model has been chosen. Constituent: " + c + ", Region: " + r +
					' picks model ' +  this.collection.getId(c, r));
			}
		},
		updateConstituent: function (model) {
			var constituent = model.get('constituent');
			var validRegions = this.collection.getRegions(constituent);

			this.regionSelectView.updateMenuOptions(this._menuOptions(validRegions, model.get('region')));
			this.$('.constituent-select').val(constituent);
		},
		updateRegion: function (model) {
			var region = model.get('region');
			var validConstituents = this.collection.getConstituents(region);

			this.constituentSelectView.updateMenuOptions(this._menuOptions(validConstituents, model.get('constituent')));
			this.$('.region-select').val(region);
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



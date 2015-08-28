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
			'change .watershed-select': 'waterShedChange',
			'change #data-series': 'dataSeriesChange',
			'change #group-result-by': 'groupResultsByChange'
		},
		render: function () {
			$.when(
					SpatialUtils.getStatesForRegion(this.selectionModel.get("region"), this),
					SpatialUtils.getHucsForRegion(this.selectionModel.get("region"), this)
					).then(function (states, hucs) {
				this[0].context.states = states;
				this[0].context.hucs = hucs;
				_.extend(this[0].context, this[0].model.attributes);
				BaseView.prototype.render.apply(this[0], arguments);
			});
			return this;
		},
		initialize: function (options) {
			this.selectionModel = options.selectionModel;
			this.listenTo(this.model, 'change', this.modelChange);
			BaseView.prototype.initialize.apply(this, arguments);

			// Automatically pre-select dropdown values based on model values
			Handlebars.registerHelper('isSelected', function (text, obj) {
				if (text === obj) {
					return new Handlebars.SafeString('selected=true');
				} else {
					return '';
				}
			});

			Handlebars.registerHelper('getHucList', function (precision, hucs) {
				var derivedHucs = _.chain(hucs)
						.map(function (o) {
							return o.substr(0, this);
						}, precision)
						.uniq()
						.sortBy()
						.value();
				
				return derivedHucs;
				
			});
		},
		stateChange: function (evt) {
			this.model.set("state", $(evt.target).val());
		},
		waterBodyChange: function (evt) {
			this.model.set("waterBody", $(evt.target).val());
		},
		
		/**
		 * Based on the dropdown option chosen for a watershed, update the next
		 * dropdown with valid options and display it
		 * @param {type} evt
		 * @returns {undefined}
		 */
		waterShedChange: function (evt) {
			// Figure out which watershed select was chosen
			var val = $(evt.target).val(),
				waterShedSelects = this.$(".watershed-select");
			
			// Update the dropdowns of higher precision based on user's selection
			var $downstreamSheds = $(waterShedSelects.slice(waterShedSelects.index(evt.target) + 1));
			
			// First hide all the downstream sheds
			$downstreamSheds.addClass('hidden');
			
			// Only display options that are valid to the currently selected HUC
			_.each($downstreamSheds, function (sel) {
				var $sel = $(sel),
					$options = $sel.find('option').slice(1);
				
				// Hide all options
				$options.addClass('hidden');
				
				// Select the "Select A Watershed" option of the next dropdown
				$options.prop("selected", false);
				$sel.find('option').first().prop("selected", true);
				
				// Show only valid options
				$sel.find("option[value^='"+this.val+"']").removeClass('hidden');
			}, {
				val : val,
				model : this.model
			});
			
			this.model.set('waterShed', val);
			
			$downstreamSheds.first().removeClass('hidden');
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
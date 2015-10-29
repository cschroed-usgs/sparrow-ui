/*jslint browser: true */
/*global define*/
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
	/**
	 * (Disables and hides) or (enables and reveals) option elements based on the hucsToEnable list
	 * @param {Array<HTMLOptionElement} hucOptionElements the option elements for one level of hucs in the ui (only level 2, or level 4, etc)
	 * @param {Object} hucsToEnable a list of HUC-8's that should be enabled and visible
	 * @returns {undefined}
	 */
	var updateHucOptionsEnablement = function (hucOptionElements, hucsToEnable) {
		//presume first option's value's length is representative of all others
		var hucLevel = hucOptionElements[0].value.length;
		//build a list of unique hucs that are pertinent to the current huc level
		var hucsToEnableAtThisLevel = _.unique(_.map(hucsToEnable, function(huc){
			return huc.substring(0,hucLevel);
		}));
		//make a psuedo-set out of a map. All keys map to true.
		var hucsToEnableSet = _.object(hucsToEnableAtThisLevel, _.map(hucsToEnableAtThisLevel, function(){return true}));
		
		hucOptionElements.forEach(function (optionElement) {
			var huc = optionElement.value;
			optionElement = $(optionElement);
			var optionShouldBeEnabled = _.has(hucsToEnableSet, huc);
			if (optionShouldBeEnabled) {
				optionElement.attr('disabled', false);
				optionElement.removeClass('hidden');
			} else {
				optionElement.attr('disabled', true);
				optionElement.addClass('hidden');
			}
		});
	};

	var view = BaseView.extend({
		template: Handlebars.compile(filterTemplate),
		events: {
			'change #state': 'stateChange',
			'change #receiving-water-body': 'waterBodyChange',
			'change .watershed-select': 'waterShedChange',
			'change #data-series': 'dataSeriesChange',
			'change #group-result-by': 'groupResultsByChange',
			'click #button-reset-view-filter': 'resetFilterView'
		},

		render : function () {
			this.listenTo(this.collection, 'update', function () {
				this.updateContext().done(function () {
					BaseView.prototype.render.apply(this, arguments);
				});
			}, this);
			this.updateContext().done(function () {
				BaseView.prototype.render.apply(this, arguments);
			});
		},
		initialize: function (options) {
			BaseView.prototype.initialize.apply(this, arguments);
			this.modelId = options.modelId;
			this.context = this.model.attributes;
			this.listenTo(this.model, 'change', this.modelChange);

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
		/*
		 * Returns a promise that is resolved when the context has been updated
		 */
		updateContext : function () {
			var deferred = $.Deferred();
			var model = this.collection.getModel(this.modelId);
			if (model) {
				$.when(
					SpatialUtils.getStatesForRegion(model.get("regionId"), this),
					SpatialUtils.getHucsForRegion(model.get("regionId"), this)
					).done(function (states, hucs) {
						this[0].context.states = states;
						this[0].context.hucs = hucs;
						this[0].model.set("waterSheds", hucs);
						deferred.resolveWith(this[0]);
					}).fail(function () {
						this[0].context.states = [];
						this[0].context.hucs = [];
						this[0].model.set('waterSheds', []);
						deferred.resolveWith(this[0]);
					});
			}
			else {
				this.context.states = [];
				this.context.hucs = [];
				deferred.resolveWith(this);
			}

			return deferred.promise();
		},

		stateChange: function (evt) {
			this.model.set("state", $(evt.target).val());
			this.validateHucSelectionsForStates();
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
				$sel.find("option[value^='" + this.val + "']").removeClass('hidden');
			}, {
				val : val,
				model : this.model
			});

			this.model.set('waterShed', val);

			$downstreamSheds.first().removeClass('hidden');
			
			this.validateStatesSelectionsForHuc();
		},
		dataSeriesChange: function (evt) {
			this.model.set("dataSeries", $(evt.target).val());
		},
		groupResultsByChange: function (evt) {
			this.model.set("groupResultsBy", $(evt.target).val());
		},
		modelChange: function (model) {
			// TODO - As more filtering options come through, add them here
			var waterShed = model.get('waterShed'), // String
				states = model.get('state'); // Array
		
			if (waterShed || !_.isEmpty(states)) {
				this.$("#button-reset-view-filter").show();
			} else {
				this.$("#button-reset-view-filter").hide();
			}
		},
		updateHucOptions : function(states){
			var chosenStateCount = this.model.get('state').length,
				$options = this.$('#state').find('option');

						_.each($options, function (option) {
							var $option = $(option);

							$option.prop('disabled', false); // May be disabled again later

							if (this.states.indexOf($option.val()) === -1) {
								$option.prop({
									selected : false,
									disabled : true
								});
							}
						}, {
							context : this,
							states : states
						});

						var $selectedStates = _.map(this.$('#state').find('option:selected'), function (o) {
							return $(o).val();
						});
						if ($selectedStates.length !== chosenStateCount) {
							 this.model.set('state', $selectedStates);
						}
		},
		/**
		 * Asynchronously finds which states correspond to the HUC selected.
		 * 
		 * If states in the multiselect are chosen but are not valid for the huc, 
		 * they are deselected. Also, invalid states are disabled in the select
		 * 
		 * @returns {Promise}
		 */
		validateStatesSelectionsForHuc: function () {
			var statesForHucPromise = SpatialUtils.getStatesForHuc(this.model.get("waterShed"), this);
			
			// TODO - Add notification of ongoing state verification based on HUC selection
			
			$.when(statesForHucPromise)
					.done(this.updateHucOptionsfunction)
					.always(function () {
						// TODO - Remove notification about state verification
					});
					
			return statesForHucPromise;
		},
		
		/**
		 * Asynchronously verifies that the selected HUC(s) are valid for the 
		 * state chosen. If not, scale back the HUC selection to a valid one if
		 * possible. Otherwise, deselect all HUC selections
		 * 
		 * @returns {Promise}
		 */
		validateHucSelectionsForStates: function () {
			// Ensure that the currently chosen HUC actually exists within the state(s) chosen
			var hucsForStatesPromise = SpatialUtils.getHucsForStates(this.model.get("state"), this);
			
			// TODO - Create notification that HUC selection is being verified
			$.when(hucsForStatesPromise)
					.done(function (hucsForStates) {
						// Go backwards through the visible HUC dropdowns, checking if 
						// the selected HUC (if any) is valid for the state(s) chosen.
						// If not, deselect it and hide the dropdown (don't hide the first dropdown)
						var HUC_2_ID = "watershed-huc-2";
						var waterShedSelects = this.$('.watershed-select').filter(":visible").reverse();
						//some option elements are user-facing instructions, and should be ignored
						var notUserInstructions = function(option){
							return "USER_INSTRUCTIONS" != option.value;
						};
						var validHucFound = false;

						_.find(waterShedSelects, function(waterShedSelect){
							var $waterShedSelect = $(waterShedSelect);
							// get the selection from the current dropdown 
							var waterShedOptions = _.filter($waterShedSelect.find('option'), notUserInstructions);
							
							updateHucOptionsEnablement(waterShedOptions, hucsForStates);
							
							var waterShedChosenOption = _.chain($waterShedSelect.find('option:selected'))
								.filter(notUserInstructions)
								.pluck('value')
								.first()
								.value();
							
							if(_.isString(waterShedChosenOption)){
								validHucFound = true;
								return validHucFound;
							} else {
								$waterShedSelect.find('option:first').prop('selected', true);
								$waterShedSelect.addClass('hidden');
							}
						});
						this.$('#' + HUC_2_ID).removeClass('hidden');

						// After processing, find if we have a HUC selected by finding the
						// last visible selectbox and seeing if there's a HUC selected. 
						// If so, update the model with that HUC, otherwise reset the model's
						// HUC content with nothing
						if (validHucFound) {
							var val = this.$(".watershed-select:visible")
									.find('option:selected:not([disabled])')
									.last()
									.val();
							this.model.set('waterShed', val);
						} else {
							this.model.set('waterShed', '');
							// TODO - Notify that current HUC selection was invalid
						}
					})
				.always(function () {
					// TODO- Remove notification about HUC verification
			});
			
			return hucsForStatesPromise;
		},
		updateHucOptionsEnablement: updateHucOptionsEnablement,
		resetFilterView: function () {
			this.$('#state').find('option').each(function (idx, opt) {
				$(opt).prop('disabled', false);
			});
			
			this.$('#state')
					.find('option:selected')
					.prop('selected', false);

			this.$('.watershed-select').each(function (idx, sel) {
				var $sel = $(sel);
				$sel
					.find('option:selected')
					.prop('selected', false);
				$sel
					.find('option:first')
					.prop('selected', true);
			
				if (idx !== 0) {
					$sel.hide();
				}
			});
			
			this.$('#data-series')
					.find('option:first')
					.prop('selected', true);
			
			this.model.reset();
		}
	});

	return view;
});
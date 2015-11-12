/*jslint browser: true */
/*global define*/
define([
	'underscore',
	'jquery',
	'utils/logger',
	'utils/spatialUtils',
	'views/BaseView',
	'handlebars',
	'text!templates/map_filter.html',
	'AppEvents'
], function (_, $, log, SpatialUtils, BaseView, Handlebars, filterTemplate, AppEvents) {
	"use strict";

	var view = BaseView.extend({
		template: Handlebars.compile(filterTemplate),
		events: {
			'change #state': 'statesChanged',
			'change #receiving-water-body': 'waterBodyChange',
			'change .watershed-select': 'watershedChanged',
			'change #data-series': 'dataSeriesChange',
			'change #group-result-by': 'groupResultsByChange',
			'click #button-reset-view-filter': 'resetFilterView'
		},
		getSelectedStates : function(){
			var selectedStates = _.map(this.$('#state :selected'), 
				function(selectedStateElt){
					return $(selectedStateElt).val();
				}
			);
			return selectedStates;
		},
		statesChanged : function() {
			//jquery might return an array or a string, so ensure it's an array
			var selectedStates = this.getSelectedStates();
			this.model.set('state', selectedStates);
			this.disableSpatialFilterElements();
			SpatialUtils.getHucsForStates(selectedStates, this)
				.done(function(enabledHucs){
					AppEvents.trigger(AppEvents.spatialFilters.finalized);
					this.updateWatershedFilterElements(enabledHucs, this.model.get('waterShed').length);
				})
				.always(this.enableSpatialFilterElements);
		},
		/**
		 * Based on the dropdown option chosen for a watershed, update the next
		 * dropdown with valid options and display it
		 * @param {jQuery.Event} ev jQuery Event
		 * @returns {undefined}
		 */
		watershedChanged : function (ev) {
			//select the last enabled and selected watershed option.
			//Must use :enabled to filter out the option element that displays instructions to the user
			var selectedWatershedElt = $(ev.target);
			var selectedWatershed = selectedWatershedElt.val();
			var nextSelect = selectedWatershedElt.next('select');
			this.disableSpatialFilterElements();
			this.model.set('waterShed', selectedWatershed);
			
			SpatialUtils.getStatesForHuc(selectedWatershed, this)
				.done(function(enabledStates){
					this.updateStateFilterElements(enabledStates);
					AppEvents.trigger(AppEvents.spatialFilters.finalized);
					var selectedStates = this.getSelectedStates();
					if(_.isEmpty(selectedStates)){
						this.setUpNextWatershedSelect(nextSelect, selectedWatershed);
						this.enableSpatialFilterElements();
					} else {
						SpatialUtils.getHucsForStatesAndHuc(selectedStates, selectedWatershed, this)
							.done(function(enabledHucs){
								this.updateWatershedFilterElements(enabledHucs, selectedWatershed.length);
							})
							.always(this.enableSpatialFilterElements);
					}
				})
				.fail(this.enableSpatialFilterElements);
		},
		setUpNextWatershedSelect : function (nextSelect, selectedWatershed) {
			nextSelect.removeClass('hidden');
			nextSelect.find('option[value=""]').prop({'selected': true});
			nextSelect.find("option[value^='" + selectedWatershed + "']").removeClass('hidden');
			nextSelect.find('option').not("option[value^='" + selectedWatershed + "']").addClass('hidden');
			
			//handle special case
			var lastSelect = nextSelect.next('select');
			if(!_.isEmpty(lastSelect)){
				lastSelect.addClass('hidden');
			}
		},
		enableSpatialFilterElements : function () {
			this.toggleSpatialFilterElements(false);
		},
		disableSpatialFilterElements : function () {
			this.toggleSpatialFilterElements(true);
		},
		toggleSpatialFilterElements : function (disabled) {
			$('#interestArea :input').prop({disabled: disabled});
		},
		/**
		 * 
		 * @param {Object} enabledWatersheds a set of String hucs
		 * @param {Number} order the order (0,2,4,8) of the watershed.
		 *	Corner case: 0 is interpreted as no huc selected
		 * @returns {undefined}
		 */
		updateWatershedFilterElements : function (enabledWatersheds, order) {
			//if order is zero, then no watershed is selected, so 
			//only update the first dropdown (order 2)
			var nextOrder = order === 0 ? 2 : order*2;
			var $watershedSelects = _.map(this.$('.watershed-select'), $);
			_.each($watershedSelects, function($watershedSelect){
				var $watershedOptions = _.map($watershedSelect.find('option[value!=""]'), $);
				var currentSelectOrder = $watershedSelect.find('option:last').val().length;
				if(currentSelectOrder <= nextOrder){
					$watershedSelect.removeClass('hidden');
					
					var enabledWatershedsForThisOrder = _.map(enabledWatersheds, function (enabledWatershed) {
						return enabledWatershed.substring(0, currentSelectOrder);
					});

					enabledWatershedsForThisOrder = SpatialUtils.makeSetFromArray(enabledWatershedsForThisOrder);
					//grab all watershed options except for the option that presents instructions to the user

					_.each($watershedOptions, function ($watershedOption) {
						if (_.has(enabledWatershedsForThisOrder, $watershedOption.val())) {
							$watershedOption.removeClass('hidden');
						} else {
							$watershedOption.addClass('hidden');
						}
					});
				} else {
					$watershedSelect.addClass('hidden');
					_.each($watershedOptions, function($watershedOption){
						$watershedOption.prop({'selected': false});
					});
				}
				
				
			});
		},
		updateStateFilterElements : function (enabledStateElements) {
			var stateElts = this.$('#state option');
			_.each(stateElts, function(stateElt){
				var $stateElt = $(stateElt);
				var shouldBeDisabled = !_.has(enabledStateElements, $stateElt.val());
				if(shouldBeDisabled){
					$stateElt.addClass('hidden');
				} else {
					$stateElt.removeClass('hidden');
				}
				$stateElt.prop({
					'disabled': shouldBeDisabled
				});
			});
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
		waterBodyChange: function (evt) {
			this.model.set("waterBody", $(evt.target).val());
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
					.done(function (states) {
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
					})
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
					.done(function (hucs) {
						// Go backwards through the visible HUC dropdowns, checking if 
						// the selected HUC (if any) is valid for the state(s) chosen.
						// If not, deselect it and hide the dropdown (don't hide the first dropdown)
						var waterShedSelects = this.$(".watershed-select:visible"),
							validHucFound = false,
							findValidHucOption = function (huc) {
								var chosenOption = $waterShedChosenOption.val();
								// Test against HUC 2, 6 and 8
								return huc.substring(0, chosenOption.length) === chosenOption;
							};

						for (var wsIdx = waterShedSelects.length - 1 ;!validHucFound && wsIdx > -1;wsIdx--) {
							var $waterShedSelect = $(waterShedSelects[wsIdx]),
								$waterShedChosenOption = $waterShedSelect.find('option:selected');

							if (!$waterShedChosenOption.prop('disabled')) {
								// The current dropdown actually has something enabled
								var hit = _.find(hucs, findValidHucOption);

								if (!hit) {
									// HUC not available for this state
									// Reset the watershed selectbox and hide it if it's
									// not the first one
									$waterShedSelect
											.find('option:selected')
											.prop('selected', false);

									$waterShedSelect
											.find('option:first')
											.prop('selected', true);

									if (wsIdx !== 0) {
										$waterShedSelect.addClass('hidden');
									}
								} else {
									validHucFound = true;
								}
							}
						}

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
		resetFilterView: function () {
			this.$('#state option').prop({
				'selected': false,
				'disabled': false
			}).removeClass('hidden');
			
			this.$('.watershed-select').each(function (idx, sel) {
				var $sel = $(sel);
				$sel.find('option').removeClass('hidden');
				$sel
					.find('option:selected')
					.prop('selected', false);
				$sel
					.find('option:first')
					.prop('selected', true);
			});
			this.$('.watershed-select').addClass('hidden');
			this.$('.watershed-select:first').removeClass('hidden');
			this.$('#data-series')
					.find('option:first')
					.prop('selected', true);
			
			this.model.reset();
			AppEvents.trigger(AppEvents.spatialFilters.finalized);
		}
	});

	return view;
});
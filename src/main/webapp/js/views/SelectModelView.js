/*jslint browser : true */

define([
	'handlebars',
	'utils/logger',
	'jquery',
	'views/BaseView',
	'text!templates/model_selection.html'
], function(Handlebars, log, $, BaseView, hbTemplate) {
	"use strict";

	var view = BaseView.extend({
		
		events : {
			'change .constituent-select' : 'changeConstituent',
			'change .region-select' : 'changeRegion'
		},

		template : Handlebars.compile(hbTemplate),

		render : function() {
			var self = this;
			$.when(this.constituentsPromise, this.regionsPromise).done(function() {
				if (self.$el.length === 0) {
					self.$el = $(self.el);
				}
				
				BaseView.prototype.render.apply(self, arguments);
			});
			return this;
		},

		/*
		 * @constructs
		 * @param {Object} options
		 *      @prop {SelectionModel} - model
		 */
		initialize : function(options) {
			this.constituentsPromise = this.getConstituents();
			this.regionsPromise = this.getRegions();
			this.setModelListeners();

			BaseView.prototype.initialize.apply(this, arguments);
		},

		/*
		 * @return Promise which is resolved when the ajax call finishes. Resolved data is the list of constituents.
		 * If rejected the service call failed.
		 */
		getConstituents : function() {
			var self = this;
			var deferred = $.Deferred();

			$.ajax({
				url : 'data/constituent',
				success : function(response) {
					self.context.constituents = response.constituents;
					deferred.resolve(response.constituents);
				},
				error : function(xhr, textStatus) {
					deferred.reject(textStatus);
				}
			});

			return deferred.promise();
		},

		/*
		 * @return Promise which is resolved when the ajax call finishes.
		 * If rejected the service call failed.
		 */
		getRegions : function() {
			var self = this;
			var deferred = $.Deferred();

			$.ajax({
				url : 'data/region',
				success : function(response) {
					self.context.regions = response.regions;
					deferred.resolve();
				},
				error : function(xhr, textStatus) {
					deferred.reject(textStatus);
				}
			});

			return deferred.promise();
		},

		setModelListeners : function() {
			this.listenTo(this.model, 'change:constituent', this.updateConstituent);
			this.listenTo(this.model, 'change:region', this.updateRegion);
		},

		updateConstituent : function(model) {
			this.$('.constituent-select').val(model.get('constituent'));
		},

		updateRegion : function(model) {
			this.$('.region-select').val(model.get('region'));
		},

		changeConstituent : function(ev) {
			this.model.set('constituent', ev.currentTarget.value);
		},

		changeRegion : function(ev) {
			this.model.set('region', ev.currentTarget.value);
		}
	});

	return view;
});



/*jslint browser : true */

define([
	'handlebars',
	'jquery',
	'views/BaseView',
	'text!templates/model_selection.html'
], function(Handlebars, $, BaseView, hbTemplate) {
	"use strict";

	var view = BaseView.extend({

		events : {
			'change .constituent-select' : 'changeConstituent',
			'change .region-select' : 'changeRegion'
		},

		template : Handlebars.compile(hbTemplate),

		render : function() {
			var self = this;
			BaseView.prototype.render.apply(self, arguments);

			return this;
		},

		/*
		 * @constructs
		 * @param {Object} options
		 *      @prop {SelectionModel} - model
		 */
		initialize : function(options) {
			this.setModelListeners();
			this.metadataPromise = this.getMetadata();

			BaseView.prototype.initialize.apply(this, arguments);
		},

		/*
		 * @return Promise which is resolved when the ajax call finishes. Resolved data is the list of constituents.
		 * If rejected the service call failed.
		 */
		getMetadata : function() {
			var self = this;
			var deferred = $.Deferred();

			$.ajax({
				url : 'https://www.sciencebase.gov/catalog/items?parentId=55c90c3be4b08400b1fd88a2&max=1700&format=json&fields=tags',
				success : function(response) {
					self.model.set('metadata', response.items);

					deferred.resolve();
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
			this.listenTo(this.model, 'change:metadata', this.updateMetadata);
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



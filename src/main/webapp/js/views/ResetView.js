/* jslint browser: true */
/* global define */
define([
	'handlebars',
	'views/BaseView',
	'utils/logger',
	'text!templates/reset.html'
], function(Handlebars, BaseView, logger, hbTemplate) {
	"use strict";

	var view = BaseView.extend({

		template : Handlebars.compile(hbTemplate),

		events : {
			'click .reset-button' : 'goHome'
		},

		/*
		 * @constructs
		 * @param {Object} options
		 *     @prop {String} el - selector where this view should be rendered
		 *     @prop {ModelCollection} collection - application meta data
		 *     @prop {String} modelId
		 *     @prop {AppRouter} router
		 */
		initialize : function(options) {
			BaseView.prototype.initialize.apply(this, arguments);
			this.updateContext(options.modelId);
			this.listenTo(this.collection, 'update', function(collection) {
				this.updateContext(options.modelId);
				this.render();
			}, this);
		},

		updateContext : function(modelId) {
			var model = this.collection.getModel(modelId);
			if (model) {
				this.context.modelTitle = model.get('title');
			}
		},

		goHome : function() {
			this.router.navigate('', {trigger: true});
		}
	});
	return view;
});



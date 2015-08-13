/*jslint browser: true */

define([
	'backbone',
	'underscore',
	'utils/logger'
], function(Backbone, _, logger){
	"use strict";

	var view = Backbone.View.extend({

		LOG : logger.init(),
		/**
		 * Renders the object's template using it's context into the view's element.
		 * @returns {extended Backbone.View}
		 */
		render : function() {
			var html = this.template(this.context);
			this.$el.html(html);

			return this;
		},
		template : function() {
			return 'No template specified'
		},

		/**
		 * @constructs
		 * @param {Object} options
		 *		@prop router {Backbone.Router instance} - defaults to null
		 *		@prop template {Function} optional - Returns html to be rendered. Will override the template property.
		 *		@prop context {Object} to be used when rendering templateName - defaults to {}
		 *      @prop $el {Jquery element} - render view in $el.
		 * @returns
		 */
		initialize : function(options) {
			options = options || {};

			if (!this.context) {
				this.context = {};
			}
			if (options.context) {
				$.extend(this.context, options.context);
			}

			this.router = options.router || null;

			if (_.has(options, 'template')) {
				this.template = options.template;
			}

			Backbone.View.prototype.initialize.apply(this, arguments);
			this.render();
		}
	});

	return view;
});


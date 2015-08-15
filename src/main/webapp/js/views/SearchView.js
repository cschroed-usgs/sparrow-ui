/*jslint browser: true */
define([
	'underscore',
	'jquery',
	'backbone',
	'handlebars',
	'text!templates/region_search.html'
], function (_, $, Backbone, Handlebars, searchTemplate) {
	"use strict";

	var view = Backbone.View.extend({
		template: Handlebars.compile(searchTemplate),
		events: {
		},
		render: function () {
			this.setElement($(this.el));
			
			var html = this.template(this.context);
			this.$el.html(html);

			return this;
		},
		initialize: function () {
			var opts = arguments ? arguments[0] : null;
			if (_.has(opts, 'el')) {
				this.el = opts.el;
			} else {
				this.el = "#region-search-container-div";
			}
			
			if (_.has(opts, 'template')) {
				this.template = opts.template;
			}
		}

	});

	return view;
});
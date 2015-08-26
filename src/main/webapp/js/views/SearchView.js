/*jslint browser: true */
define([
	'underscore',
	'handlebars',
	'views/BaseView',
	'text!templates/region_search.html'
], function (_, Handlebars, BaseView, searchTemplate) {
	"use strict";

	var view = BaseView.extend({
		template: Handlebars.compile(searchTemplate)
	});

	return view;
});
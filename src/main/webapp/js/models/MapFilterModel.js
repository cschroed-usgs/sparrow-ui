/*jslint browser: true*/
define([
	'backbone'
], function (Backbone) {
	"use strict";

	var model = Backbone.Model.extend({
		defaults: function () {
			return {
				state: '',
				waterBody: '',
				waterShed: '',
				dataSeries: 'total_yield',
				groupResultsBy: '',
				waterSheds: [],
				region : ''
			};
		}
	});

	return model;
});



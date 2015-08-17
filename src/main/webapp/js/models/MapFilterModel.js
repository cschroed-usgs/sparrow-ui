/*jslint browser: true*/
define([
	'backbone'
], function (Backbone) {
	"use strict";

	var model = Backbone.Model.extend({
		defaults: function () {
			return {
				state: "state",
				waterBody: 'waterbody',
				waterShed: 'watershed',
				dataSeries: 'ds-total-yield',
				groupResultsBy: 'group-catchment'
			};
		}
	});

	return model;
});



/*jslint browser: true*/
define([
	'backbone'
], function(Backbone) {
	"use strict";

	var model = Backbone.Model.extend({
		constituent : '',
		region : ''
	});
	return model;
});



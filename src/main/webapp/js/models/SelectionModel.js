/*jslint browser: true*/
define([
	'backbone',
	'underscore'
], function (Backbone, _) {
	"use strict";

	var model = Backbone.Model.extend({
		defaults : {
			constituent : '',
			region : ''
		}
	});
	return model;
});



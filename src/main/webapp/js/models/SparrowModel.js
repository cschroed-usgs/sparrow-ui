define([
	'backbone'
], function (Backbone) {
	"use strict";
	var model = Backbone.Model.extend({
		defaults: function () {
			return {
				id: '',
				sbId: '',
				link: '',
				relatedLink: '',
				region: '',
				extent: '',
				constituent: ''
			};
		}
	});

	return model;
});
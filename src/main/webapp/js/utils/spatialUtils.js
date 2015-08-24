/*jslint browser: true */
/*global define*/
define([
	'underscore',
	'jquery',
	'module'
], function (_, $, module) {
	"use strict";

	var self = {};
	var workspace = 'huc8-overlay';

	self.GEOSERVER_ENDPOINT = module.config().endpointGeoserver;

	self.getStatesForRegion = function (regionId, context) {
		var deferred = $.Deferred();
		$.ajax({
			url: self.GEOSERVER_ENDPOINT + workspace + '/ows',
			data: {
				service: 'WFS',
				version: '2.0.0',
				request: 'GetFeature',
				typeName: workspace + ':' + regionId,
				propertyName: 'States',
				outputFormat: 'application/json'
			},
			context: {
				that: context || this,
				deferred: deferred
			},
			success: function (data) {
				var states = _.chain(data.features)
						.map(function (feature) {
							return feature.properties.States;
						})
						.map(function (states) {
							return states.split(",");
						})
						.flatten()
						.uniq()
						.value();

				this.deferred.resolveWith(this.that, [states]);
			},
			error: function () {
				this.deferred.rejectWith(this.that, arguments);
			}
		});

		return deferred;
	};

	return self;
});
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

	self.CONUS_ABBREVIATIONS = ["ND", "CN", "MT", "MN", "NE", "NV", "AZ", "CA", "UT", "NY", "MA", "CO", "IA", "KS", "SD", "WY", "NH", "ME", "VT", "NJ", "PA", "NM", "TX", "NC", "TN", "VA", "OK", "AR", "AL", "GA", "MS", "SC", "OR", "OH", "CT", "RI", "IN", "MI", "KY", "MO", "LA", "WI", "WV", "WA", "IL", "ID", "MD", "DE", "DC", "FL"];

	/**
	 * Given a specific region id, get the states for that region
	 * 
	 * @param {type} regionId the id of the region of interest
	 * @param {type} context (optional) the context of the deferred callback
	 * @returns {Deferred}
	 */
	self.getStatesForRegion = function (regionId, context) {
		var deferred = $.Deferred();

		if (regionId === "national_e2rf1" || regionId === "national_mrb_e2rf1") {
			// Don't bother getting the states for the national regions. We already
			// know them
			deferred.resolveWith(this.that, [self.CONUS_ABBREVIATIONS]);
		} else {
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
		}

		return deferred;
	};

	return self;
});
define([
	'jquery',
	'module'
], function ($, module) {
	"use strict";

	var self = {};

	self.GEOSERVER_ENDPOINT = module.config().endpointGeoserver;

	self.getStatesForRegion = function (regionId, context) {
		var deferred = $.Deferred();
		$.ajax({
			url: self.GEOSERVER_ENDPOINT + 'huc8-overlay/ows',
			data: {
				service: 'WFS',
				version: '2.0.0',
				request: 'GetFeature',
				typeName: 'huc8-overlay:' + regionId,
				propertyName: 'States',
				outputFormat: 'application/json'
			},
			context : {
				that : context || this,
				deferred : deferred
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
			}
		});

		return deferred;
	};

	return self;
});
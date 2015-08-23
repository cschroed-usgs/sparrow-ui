define([
	'jquery',
	'module'
], function ($, module) {
	"use strict";
	
	var self = {};
	
	self.GEOSERVER_ENDPOINT = module.config().endpointGeoserver;
	
	self.getStatesForRegion = function (regionId) {
		return $.ajax({
				url : self.GEOSERVER_ENDPOINT + 'huc8-overlay/ows',
				data : {
					service : 'WFS',
					version : '2.0.0',
					request : 'GetFeature',
					typeName : 'huc8-overlay:' + regionId,
					propertyName : 'States',
					outputFormat : 'application/json'
				}
		});
	};
	
	return self;
});
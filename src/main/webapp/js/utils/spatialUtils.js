/*jslint browser: true */
/*global define*/
define([
	'ol',
	'underscore',
	'jquery',
	'module'
], function (ol, _, $, module) {
	"use strict";

	var self = {};
	self.workspace = 'huc8-overlay';
	self.REGIONAL_WORKSPACE = 'huc8-regional-overlay';
	self.GEOSERVER_ENDPOINT = module.config().endpointGeoserver;
	self.CONUS_EXTENT = module.config().conus_extent;
	self.CONUS_ABBREVIATIONS = ["AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
	self.STATE_BBOXES = {"WA": [-13885188.365108395, 5707429.349922827, -13015378.27221484, 6274849.749306978], "MT": [-12920133.204483923, 5520332.786864218, -11582021.828256289, 6274865.868812514], "ME": [-7913425.332873992, 5325840.92574475, -7454985.175321527, 6016386.265864921], "ND": [-11584239.20119546, 5769270.378117358, -10748111.825899033, 6274865.868812514], "SD": [-11584021.571590757, 5234431.455910901, -10735584.26435196, 5771307.257090908], "WY": [-12362411.089182649, 5011499.382932036, -11582982.8494212, 5621961.255602251], "WI": [-10339955.12766268, 5234536.071360609, -9681201.446174176, 5934320.942615949], "ID": [-13050754.381907493, 5160170.489540638, -12361670.035331748, 6274852.973205626], "VT": [-8174858.155370056, 5270336.440143053, -7959941.629298663, 5623623.630854557], "MN": [-10823531.337579168, 5388098.057380183, -9966508.959882908, 6338173.264648933], "OR": [-13865913.172620608, 5159133.003041667, -12965427.65817651, 5818264.08370472], "NH": [-8076610.689650155, 5266208.147599082, -7874088.364375737, 5669107.187494501], "IA": [-10757994.547661882, 4920140.640998185, -10034650.180609223, 5388612.930176024], "MA": [-8181853.47217802, 5047551.600462574, -7783211.696106596, 5294769.248663415], "NE": [-11583485.345603107, 4864866.316282945, -10609715.649953255, 5312437.981980762], "NY": [-8879202.734355409, 4939748.076515427, -8000530.274152562, 5622487.898443287], "PA": [-8964118.355206506, 4825237.105361841, -8315572.893672233, 5201108.283585794], "CT": [-8207055.870958616, 5012104.540901494, -7991431.352925118, 5168086.63298218], "RI": [-8000162.0292766765, 5060067.276722739, -7916722.950152831, 5163033.861115451], "NJ": [-8412439.997705014, 4715468.590762056, -8226081.596467304, 5064189.487570707], "IN": [-9807413.035924336, 4547861.872840918, -9438495.345034253, 5125922.973950013], "NV": [-13357929.719047, 4163733.610791109, -12694584.442517472, 5160475.751038549], "UT": [-12695684.390407024, 4437956.398848521, -12138634.199552804, 5161324.033895732], "CA": [-13847325.155350128, 3833847.569139617, -12704362.523958877, 5161307.705648041], "OH": [-9441236.476178097, 4636160.163694858, -8963444.983606072, 5159013.190882619], "IL": [-10187546.165522289, 4437270.153449972, -9741335.901198234, 5237587.63885938], "DC": [-8585218.31160922, 4691383.196641401, -8561682.699565824, 4720746.470447021], "DE": [-8437026.020464513, 4643135.698368471, -8354040.568266074, 4842735.988759569], "WV": [-9200239.574501405, 4467707.266267868, -8652582.077011108, 4958975.624300631], "MD": [-8848771.325128907, 4575224.744824827, -8354040.568266074, 4826126.908797071], "CO": [-12140042.947710106, 4437572.854108383, -11358729.957648281, 5012839.542121603], "KY": [-9970689.897322018, 4369165.578754758, -9123698.184992008, 4742041.407772282], "KS": [-11360324.94331385, 4437556.26945624, -10530960.115769919, 4866376.404564704], "VA": [-9314678.126213793, 4375406.136058263, -8375925.53489845, 4787345.686019353], "MO": [-10660787.028625939, 4299198.19646786, -9919127.043097023, 4954954.212558474], "AZ": [-12781900.000272814, 3676414.7957415422, -12138902.368206378, 4439654.0854735905], "OK": [-11465652.55129378, 3978042.6388083408, -10511738.356637763, 4439312.853714693], "NC": [-9386879.50273159, 4012990.5316527523, -8399788.092286611, 4382078.86680324], "TN": [-10052756.51844259, 4162353.6907760706, -9089489.371480903, 4394552.330579131], "TX": [-11872230.62782972, 2979965.1000237674, -10409194.960444657, 4368797.516927773], "NM": [-12139540.340208706, 3677433.8883878943, -11465618.264890585, 4439073.384719317], "AL": [-9848763.9966519, 3533612.986017459, -9450358.663179139, 4166060.2270572395], "MS": [-10201728.04602358, 3528631.6563340616, -9806186.072495671, 4164566.2657457613], "GA": [-9529945.865278969, 3550075.5295404564, -9005162.74205614, 4163930.930924178], "SC": [-9278555.841973662, 3772262.770043647, -8747424.724782435, 4192232.114055105], "AR": [-10532744.901167471, 3896651.4638252296, -9979289.105354825, 4368645.061609037], "LA": [-10468683.651102023, 3367967.7532731732, -9909861.81055018, 3898413.302417179], "FL": [-9754449.559864879, 2870387.3923022314, -8911226.680218676, 3633159.1928881616], "MI": [-10064194.818771236, 5115772.726013657, -9174934.205191728, 6135817.048267635]};

	/**
	 * 
	 * @param {String} huc
	 * @param {Object} context to pass to promise resolution functions
	 * @returns {Promise}
	 *	resolved with:
	 *	{Object} context the context passed in
	 *	{Array<String>} states
	 *	
	 *	rejected with:
	 *	{Object} context the context passed in
	 *	{Arguments} the arguments pseudo-array of a jquery ajax error callback
	 */
	self.getStatesForHuc = function (huc, context) {
		var deferred = $.Deferred();
		
		var cqlFilter = "HUC8 LIKE '" + huc + "%'";
		
		$.ajax({
			url: self.GEOSERVER_ENDPOINT + self.workspace + '/ows',
			data: {
				service: 'WFS',
				version: '2.0.0',
				request: 'GetFeature',
				typeName: 'huc8-overlay:national_e2rf1',
				propertyName: 'States',
				outputFormat: 'application/json',
				cql_filter: cqlFilter
			},
			success: function (data) {
				var statesList = _.chain(data.features)
						.map(function (f) {
							return f.properties.States.split(',');
						})
						.flatten()
						.unique()
						.value();
				
				//create a pseudo-set
				var states = _.object(statesList, _.map(statesList, function(){return true;}));
				deferred.resolveWith(context, [states]);
			},
			error: function () {
				deferred.rejectWith(context, arguments);
			}
		});

		return deferred.promise();
	},
	/**
	 * 
	 * @param {Array<String>} states
	 * @param {Object} context context to pass to promise resolution functions
	 * @returns {Promise}
	 *	resolved with:
	 *	{Object} context the context passed in
	 *	{Array<String>} hucs
	 *	
	 *	rejected with:
	 *	{Object} context the context passed in
	 *	{Arguments} the arguments pseudo-array of a jquery ajax error callback
	 */
	self.getHucsForStates = function (states, context) {
		var deferred = $.Deferred();
		
		var cqlFilter = "States IN ('" + states.join("','") + "')";
		
		$.ajax({
			url: self.GEOSERVER_ENDPOINT + self.workspace + '/ows',
			data: {
				service: 'WFS',
				version: '2.0.0',
				request: 'GetFeature',
				typeName: 'huc8-overlay:national_e2rf1',
				propertyName: 'HUC8',
				outputFormat: 'application/json',
				cql_filter: cqlFilter
			},
			success: function (data) {
				var hucs = _.chain(data.features)
						.map(function (f) {
							return f.properties.HUC8;
						})
						.sortBy()
						.value();

				deferred.resolveWith(context, [hucs]);
			},
			error: function () {
				deferred.rejectWith(context, arguments);
			}
		});

		return deferred.promise();
	};

	/**
	 * 
	 * @param {String} regionId
	 * @param {Object} context context to pass to promise resolution functions
	 * @returns {Promise}
	 *	resolved with:
	 *	{Object} context the context passed in
	 *	{Array<String>} hucs
	 *	
	 *	rejected with:
	 *	{Object} context the context passed in
	 *	{Arguments} the arguments pseudo-array of a jquery ajax error callback
	 */
	self.getHucsForRegion = function (regionId, context) {
		var deferred = $.Deferred();
		$.ajax({
			url: self.GEOSERVER_ENDPOINT + self.workspace + '/ows',
			data: {
				service: 'WFS',
				version: '2.0.0',
				request: 'GetFeature',
				typeName: self.workspace + ':' + regionId,
				propertyName: 'HUC8',
				outputFormat: 'application/json'
			},
			success: function (data) {
				var hucs = _.chain(data.features)
						.map(function (f) {
							return f.properties.HUC8;
						})
						.sortBy()
						.value();

				deferred.resolveWith(context, [hucs]);
			},
			error: function () {
				deferred.rejectWith(context, arguments);
			}
		});

		return deferred.promise();
	};

	/**
	 * 
	 * @param {String} regionId
	 * @param {Object} context context to pass to promise resolution functions
	 * @returns {Promise}
	 *	resolved with:
	 *	{Object} context the context passed in
	 *	{Array<String>} states
	 *	
	 *	rejected with:
	 *	{Object} context the context passed in
	 *	{Arguments} the arguments pseudo-array of a jquery ajax error callback
	 */
	self.getStatesForRegion = function (regionId, context) {
		var deferred = $.Deferred();

		if (regionId === "national_e2rf1" || regionId === "national_mrb_e2rf1") {
			// Don't bother getting the states for the national regions. We already
			// know them
			deferred.resolveWith(context || this, [self.CONUS_ABBREVIATIONS]);
		} else {
			$.ajax({
				url: self.GEOSERVER_ENDPOINT + self.workspace + '/ows',
				data: {
					service: 'WFS',
					version: '2.0.0',
					request: 'GetFeature',
					typeName: self.workspace + ':' + regionId,
					propertyName: 'States',
					outputFormat: 'application/json'
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
							.sortBy()
							.value();

					deferred.resolveWith(context, [states]);
				},
				error: function () {
					deferred.rejectWith(context, arguments);
				}
			});
		}

		return deferred.promise();
	};

	/**
	 * Given an array of states, provides a bounding box that covers their extent
	 *
	 * @param {Array} states (2 letter abbreviation) required to extend.
	 * @returns {Array} a bounding box extent that covers the states requested
	 */
	self.getBoundingBoxForStates = function (states) {
		var stateBboxes = _.map(states, function (state) {
			return self.STATE_BBOXES[state.toUpperCase()];
		});

		var fullExtent = _.reduce(stateBboxes, function (orig, toExtend) {
			return ol.extent.extend(orig, toExtend);
		});

		return fullExtent;
	};

	/**
	 * @param {String} regionId
	 * @param {Object] scope - The returned promise will resolve with scope as the context for callback functions.
	 * @return {Jquery promise} - always resolves with a ol.Extent object as the argument. The extent will be the
	 * extent of regionId unless it can't be retrieved. The fallback is the CONUS_EXTENT.
	 */
	self.getRegionExtent = function (regionId, scope) {
		var deferred = $.Deferred();

		if (!(regionId) || regionId === "national_e2rf1" || regionId === "national_mrb_e2rf1") {
			deferred.resolveWith(scope, [self.CONUS_EXTENT]);
		}
		else {
			$.ajax({
				url: self.GEOSERVER_ENDPOINT + self.REGIONAL_WORKSPACE + '/ows',
				data: {
					service: 'WFS',
					version: '2.0.0',
					request: 'GetFeature',
					typeName: self.REGIONAL_WORKSPACE + ':' + regionId,
					outputFormat: 'application/json'
				},
				success: function (data) {
					if ((data.features.length)  && (data.features.length === 1)) {
						var coords = _.map(data.features[0].geometry.coordinates[0][0], function (c) {
							return [c[1], c[0]];
						});
						var polygon = new ol.geom.Polygon([coords], 'XY');
						var extent = ol.proj.transformExtent(polygon.getExtent(), ol.proj.get('EPSG:4326'), ol.proj.get('EPSG:3857'));
						deferred.resolveWith(scope, [extent]);
					}
					else {
						// default fallback
						deferred.resolveWith(scope, [self.CONUS_EXTENT]);
					}
				},
				error: function () {
					// default fallback
					deferred.resolveWith(scope, [self.CONUS_EXTENT]);
				}
			});
		}

		return deferred.promise();
	};

	return self;
});

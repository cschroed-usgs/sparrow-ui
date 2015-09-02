/* jslint browser: true */
/* global define */

define([
	'utils/logger',
	'backbone'
], function(log, Backbone) {
	"use strict";

	var model = Backbone.Model.extend({
		defaults : function() {
			return {
				catchmentLayerName : '',
				catchmentStyleName : '',
				flowlineLayerName : '',
				flowlineStyleName : '',
				geoserverEndpoint : ''
			};
		},

		urlRoot : 'data/prediction',

		parse : function(response) {
			return {
				catchmentLayerName : response[0].CatchLayerName,
				catchmentStyleName : response[0].CatchLayerDefaultStyleName,
				flowlineLayerName : response[0].FlowLayerName,
				flowlineStyleName : response[0].FlowLayerDefaultStyleName,
				geoserverEndpoint : response[0].EndpointUrl
			};
		}
	});

	return model;

});



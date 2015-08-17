/*jslint browser: true*/
define([
	'backbone'
], function(Backbone) {
	"use strict";

	var model = Backbone.Model.extend({
		defaults : {
			constituent : '',
			region : '',
			metadata : []
		},

		getValidConstituents : function() {
			var validMetadata;
			var region = this.get('region');
			var metadata = this.get('metadata');
			var isTagRegion = function(tag) {
				return tags.type === 'region';
			};

			if (region) {
				validMetadata = _.filter(this.get('metadata'), function(d) {
					return (_.find(d.tags, isTagRegion) === region)
				});
			}
			else {
				validMetadata = metadata;
			}
			return validMetadata.pluck('constituent');
		},
		
		getValidRegions : function() {
			var validMetadata;
			var constituent = this.get('constituent');
			var metadata = this.get('metadata');
			var isTagConstituent = function(tag) {
				return tags.type === 'constituent';
			};

			if (region) {
				validMetadata = _.filter(this.get('metadata'), function(d) {
					return (_.find(d.tags, isTagConstituent) === region)
				});
			}
			else {
				validMetadata = metadata;
			}
			return validMetadata.pluck('constituent');
		},


	});
	return model;
});



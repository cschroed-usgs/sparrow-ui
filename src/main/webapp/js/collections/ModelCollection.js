define([
	'backbone',
	'underscore',
	'models/SparrowModel'
], function (Backbone, _, SparrowModel) {
	"use strict";
	var modelCollection = Backbone.Collection.extend({

		model: SparrowModel,
		url: 'data/model',

		parse: function (resp) {
			var models = _.map(resp.items, function (item) {
				var id, sbId, link, relatedLink, region, extent, constituent;

				var id = _.findWhere(item.tags, {type: 'id'}).name;
				var sbId = item.id;
				var link = item.link;
				var relatedLink = item.relatedItems.link.url;
				var region = _.findWhere(item.tags, {type: 'region'}).name;
				var extent = _.findWhere(item.tags, {type: 'extent'}).name;
				var constituent = _.findWhere(item.tags, {type: 'constituent'}).name;

				return {
					id: id,
					sbId: sbId,
					link: link,
					relatedLink: relatedLink,
					region: region,
					extent: extent,
					constituent: constituent
				};
			});

			return models;
		},

		/*
		 * @param {String} region (optional)
		 * @return {Array of String} - the array of constituents that are valid for region.
		 *     If region is unspecified, returns all of the constituents.
		 */
		getConstituents : function(region) {
			var validModels;
			if (region) {
				validModels = _.filter(this.models, function(m) {
					return (m.attributes.region === region);
				});
			}
			else {
				validModels = this.models;
			}
			return _.uniq(_.map(validModels, function(model) {
				return model.attributes.constituent;
			}));
		},

		/*
		 * @param {String} constituent (optional)
		 * @return {Array of String}the array of regions that are valid for constituent.
		 *     If constituent is unspecified, retun all of the regions
		 */
		getRegions : function(constituent) {
			var validModels;

			if (constituent) {
				validModels = _.filter(this.models, function(m) {
					return (m.attributes.constituent === constituent);
				});
			}
			else {
				validModels = this.models;
			}
			return _.uniq(_.map(validModels, function(model) {
				return model.attributes.region;
			}));
		},

		/*
		 * @param {String} constituent
		 * @param {String} region
		 * @Return {String} - returns the model is defined by constituent and region. Returns
		 *     undefined if no such model exists.
		 */
		getId : function(constituent, region) {
			var model = _.find(this.models, function(model) {
				return ((model.attributes.region === region) && (model.attributes.constituent === constituent));
			});

			if (model) {
				return model.id;
			}
			else {
				return undefined;
			}
		}
	});

	return modelCollection;
});
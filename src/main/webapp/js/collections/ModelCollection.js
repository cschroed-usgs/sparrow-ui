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
			var filteredModels = _.filter(resp.items, function (item) {
				return _.findWhere(item.tags, {type: 'id'}).name.toLowerCase() !== "new";
			});
			var models = _.map(filteredModels, function (item) {
				var id, sbId, link, relatedLink, region, extent, constituent;

				var id = _.findWhere(item.tags, {type: 'id'}).name;
				var sbId = item.id;
				var link = item.link;
				var title = item.title;
				var relatedLink = item.relatedItems.link.url;
				var region = _.findWhere(item.tags, {type: 'region'}).name;
				var extent = _.findWhere(item.tags, {type: 'extent'}).name;
				var constituent = _.findWhere(item.tags, {type: 'constituent'}).name;
				var regionId = _.findWhere(item.tags, {type: 'regionId'}).name;

				return {
					id: id,
					title : title,
					sbId: sbId,
					link: link,
					relatedLink: relatedLink,
					region: region,
					extent: extent,
					constituent: constituent,
					regionId: regionId
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
					return (m.attributes.regionId === region);
				});
			}
			else {
				validModels = this.models;
			}

			var constArr = _.map(validModels, function(model) {
				return {
					id : model.attributes.constituent,
					name : model.attributes.constituent
				};
			});

			return _.uniq(constArr, function (m) {
				return m.id;
			});
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

			var modelArr = _.map(validModels, function(model) {
				return {
					id : model.attributes.regionId,
					name : model.attributes.region
				};
			});

			return _.uniq(modelArr, function(m) {
				return m.id;
			});
		},

		/*
		 * @param {String} constituent
		 * @param {String} region
		 * @Return {String} - returns the model is defined by constituent and region. Returns
		 *     undefined if no such model exists.
		 */
		getId : function(constituent, region) {
			var model = _.find(this.models, function(model) {
				return ((model.attributes.regionId === region) && (model.attributes.constituent === constituent));
			});

			if (model) {
				return model.id;
			}
			else {
				return undefined;
			}
		},

		/*
		 * @param {String} modelId
		 * @return {SparrowModel} - Return the metadata for modelId or undefined if modelId is not in the collection
		 */
		getModel : function(modelId) {
			return _.find(this.models, function(model) {
				return (model.attributes.id === modelId);
			});
		}
	});

	return modelCollection;
});
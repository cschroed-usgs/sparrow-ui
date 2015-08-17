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
		}
	});
	return modelCollection;
});
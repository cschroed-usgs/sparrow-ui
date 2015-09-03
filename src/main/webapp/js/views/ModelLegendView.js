/* jslint browser: true */
/* global define */
define([
	'utils/logger',
	'handlebars',
	'jquery',
	'utils/jqueryUtils',
	'views/BaseView',
	'text!templates/model_legend.html'
], function(log, Handlebars, $, jqueryUtils, BaseView, hbTemplate){
	"use strict";

	var view = BaseView.extend({

		template : Handlebars.compile(hbTemplate),

		LEGEND_TITLE : {
			total_yield : 'kg&#9679;km<sup>-2</sup>&#9679;yr<sup>-1</sup>',
			incremental_yield : 'kg&#9679;km<sup>-2</sup>&#9679;yr<sup>-1</sup>',
			decayed_incremental : 'kg&#9679;year<sup>-1</sup>',
			total_concentration : 'mg&#9679;L<sup>-1</sup>'
		},

		/*
		 * @param {Object} options
		 *     @prop {PredictionModel} model
		 *     @prop {MapFilterModel} mapFilterModel
		 *     @prop {Jquery selector} el
		 */
		initialize: function(options) {
			BaseView.prototype.initialize.apply(this, arguments);
			this.mapFilterModel = options.mapFilterModel;
			this.listenTo(this.model, 'change', this.updateLegendBins);
			this.updateLegendBins();
		},

		updateLegendBins : function() {
			this.context.title = this.LEGEND_TITLE[this.mapFilterModel.get('dataSeries')]
			var endpoint = this.model.get('geoserverEndpoint');

			if (endpoint) {
				// Fetch the sld
				$.ajax({
					url : endpoint.replace('wms', 'rest/styles/') + this.model.get('catchmentStyleName') + '.sld',
					context: this,
					success : function(response) {
						log.debug('Retrieved catchment style sheet');
						var bins = [];
						jqueryUtils.findXMLNamespaceTags($(response), 'sld:FeatureTypeStyle').each(function() {
							var $color = jqueryUtils.findXMLNamespaceTags($(this), 'sld:CssParameter');
							var $lowBin = jqueryUtils.findXMLNamespaceTags($(this), 'ogc:PropertyIsGreaterThanOrEqualTo');
							var $highBin = jqueryUtils.findXMLNamespaceTags($(this), 'ogc:PropertyIsLessThan');
							bins.push({
								color : $color.text(),
								low : jqueryUtils.findXMLNamespaceTags($lowBin, 'ogc:Literal').text(),
								high : jqueryUtils.findXMLNamespaceTags($highBin, 'ogc:Literal').text()
							});
						});
						this.context.bins = bins;
						this.render();
					},
					error : function() {
						log.debug('Error retrieving style sheet');
						this.context.bins = [];
						this.render();
					}
				});
			}
		}

	});

	return view;
});



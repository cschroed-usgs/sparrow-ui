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

		/*
		 * @param {Object} options
		 *     @prop {PredictionModel} model
		 */
		initialize: function(options) {
			BaseView.prototype.initialize.apply(this, arguments);
			this.listenTo(this.model, 'change', this.getLayerSlds);
			this.getLayerSlds();
		},

		getLayerSlds : function() {
			var endpoint = this.model.get('geoserverEndpoint');
			var getSld;

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
					}
				});
			}
		}

	});

	return view;
});



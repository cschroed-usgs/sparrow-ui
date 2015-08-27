/*jslint browser: true */
/*global define*/
define([
	'underscore',
	'utils/logger',
	'views/BaseView',
	'views/DisambiguateRegionSelectionView',
	'ol',
	'utils/mapUtils',
	'olLayerSwitcher'
], function (_, log, BaseView, DisambiguateRegionSelectionView, ol, MapUtils) {
	"use strict";

	var selectionModel = null;

	var view = BaseView.extend({
		/**
		 * Renders the map.
		 * @returns {extended Backbone.View}
		 */
		render: function () {
			this.map.setTarget(this.mapDivId);
			return this;
		},
		/*
		 * @constructs
		 * @param {Object} options
		 *      @prop {String} mapDivId - Id of the div where the map will be rendered.
		 *      @prop {Boolean} enableZoom  - Optional, set to false if the zoom control should be removed. Deafult is true
		 *      @prop {ModelCollection} collection
		 *      @prop {SelectionModel} selectionModel
		 */
		initialize: function (options) {
			options.enableZoom = _.has(options, 'enableZoom') ? options.enableZoom : true;
			this.mapDivId = options.mapDivId;

			selectionModel = options.selectionModel;

			this.map = new ol.Map({
				view: new ol.View({
					center: ol.extent.getCenter(MapUtils.CONUS_EXTENT),
					zoom: 4,
					minZoom: 3
				}),
				layers : [
					new ol.layer.Group({
						title: 'Base maps',
						layers: [
							MapUtils.createWorldTopoBaseLayer(false),
							MapUtils.createWorldImageryLayer(false),
							MapUtils.createWorldStreetMapBaseLayer(false),
							MapUtils.createStamenTonerBaseLayer(true)
						]
					}),
					new ol.layer.Group({
						title: 'Regions',
						layers: []
					})
				],
				controls: ol.control.defaults({
					zoom: options.enableZoom
				}).extend([new ol.control.ScaleLine(),
					new ol.control.LayerSwitcher({
						tipLabel: 'Switch base layers'
					})])
			});

			this.updateRegionLayerGroup(this.collection);
			this.listenTo(this.collection, 'update', this.updateRegionLayerGroup);

			this.listenTo(selectionModel, 'change:region', _.bind(function () {
				MapUtils.highlightRegion(this.model.get("region"), this.map);
			}, {
				map : this.map,
				model : selectionModel
			}));

			BaseView.prototype.initialize.apply(this, arguments);
			log.debug("Map View initialized");
		},

		updateRegionLayerGroup : function(collection) {
			var regionLayerIds = _.map(collection.getRegions(), function(r) {
				return r.id;
			});

			var regionLayers = _.map(regionLayerIds, function (id) {
				return MapUtils.createRegionalCoverageLayers(id);
			});
			log.debug('Fetched ' + regionLayers.length + ' regions');
			if (regionLayers.length !== 0) {

				var mapGroups = this.map.getLayers();
				this.map.removeLayer(mapGroups.item(1));
				var regionGroup = new ol.layer.Group({
					title : 'Regions',
					layers : regionLayers
				});
				this.map.addLayer(regionGroup);

				var hoverSelector = new ol.interaction.Select({
					condition: ol.events.condition.pointerMove,
					layers: regionLayers,
					style: new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: [0, 0, 255, 0.75]
						}),
						fill: new ol.style.Fill({
							color: [150, 150, 150, 0.75]
						})
					})
				});

				hoverSelector.setProperties({
					type: "select",
					selectType: "hover"
				});

				// Add on-hover events for features
				this.map.addInteraction(hoverSelector);

				var clickSelector = new ol.interaction.Select({
					condition: ol.events.condition.singleClick,
					multi: true,
					layers: regionLayers,
					style: new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: [0, 0, 255, 0.75]
						}),
						fill: new ol.style.Fill({
							color: [200, 200, 200, 0.75]
						})
					})
				});

				clickSelector.setProperties({
					type: "select",
					selectType: "click"
				});

				clickSelector.on("select", function (evt) {
					var selectedFeatures = evt.selected;
					var selectedRegions = _.map(selectedFeatures, function (f) {
						return {id: f.getId().split(".")[0], name: f.getProperties().Name};
					});

					if (selectedRegions.length > 1) {
						// Multiple regions were selected. Display the disambiguation
						// modal window
						this.dRegionView = new DisambiguateRegionSelectionView({
							regions: selectedRegions,
							el: '#disambiguation-modal',
							selectionModel: selectionModel,
							collection : this.collection
						});
						this.dRegionView.render();
					} else {
						selectionModel.set('region', selectedRegions[0].id);
					}
				}, this);

				this.map.addInteraction(clickSelector);
			}
		},

		remove : function() {
			if (_.has(this, 'dRegionView')) {
				this.dRegionView.remove();
			}
			this.map.setTarget(null);
			BaseView.prototype.remove.apply(this, arguments);
			return this;
		}
	});



	return view;
});

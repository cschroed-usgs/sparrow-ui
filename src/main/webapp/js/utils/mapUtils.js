/*jslint browser: true */
/*global define*/
define([
	"underscore",
	"ol",
	"module"
], function (_, ol, module) {

	"use strict";
	var self = {};
	self.ZYX = '/MapServer/tile/{z}/{y}/{x}';

	self.CONUS_EXTENT = [-18341616.56817788, 1526597.395101606, -3196078.0356399175, 8013349.363494803];

	self.GEOSERVER_ENDPOINT = module.config().endpointGeoserver;

	self.defaultRegionStyle = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: [0, 0, 255, 0.5]
		}),
		fill: new ol.style.Fill({
			color: [100, 100, 100, 0.5]
		}),
		zIndex: Infinity
	});

	self.createRegionalCoverageLayers = function (layerTitle) {
		// I specifically do not give these layers titles because the LayerSwitcher
		// control will use the existence of a 'title' property to decide whether
		// or not to display these layers in the switcher. I do not want these layers
		// displayed in the layer switcher
		var layer = new ol.layer.Vector({
			id: layerTitle, 
			visible: true,
			updateWhileInteracting: true,
			source: new ol.source.Vector({
				url: self.GEOSERVER_ENDPOINT + "wfs?" +
						"service=WFS&version=1.0.0&request=GetFeature&typeName=huc8-regional-overlay:" + layerTitle + "&outputFormat=json",
				format: new ol.format.GeoJSON()
			}),
			style: self.defaultRegionStyle
		});
		
		return layer;
	};

	self.createWorldStreetMapBaseLayer = function (isVisible) {
		return new ol.layer.Tile({
			title: 'World Street Map',
			type: 'base',
			visible: isVisible,
			source: new ol.source.XYZ({
				attributions: [
					new ol.Attribution({
						html: 'Esri, DeLorme, FAO, IFL, NGA, NOAA, USGS, EPA'
					})
				],
				url: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map" + self.ZYX
			})
		});
	};

	self.createStamenTonerBaseLayer = function (isVisible) {
		return new ol.layer.Tile({
			title: 'Light Gray Toner Map',
			type: 'base',
			visible: isVisible,
			source: new ol.source.Stamen({
				attributions: [
					new ol.Attribution({
						html: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
					})
				],
				layer: 'toner-lite'
			})
		});
	};

	self.createWorldTopoBaseLayer = function (isVisible) {
		return new ol.layer.Tile({
			title: 'World Topo Map',
			type: 'base',
			visible: isVisible,
			source: new ol.source.XYZ({
				attributions: [
					new ol.Attribution({
						html: 'Esri, DeLorme, FAO, NOAA, EPA'
					})
				],
				url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map' + self.ZYX
			})
		});
	};

	self.createWorldImageryLayer = function (isVisible) {
		return new ol.layer.Tile({
			title: 'World Imagery',
			type: 'base',
			visible: isVisible,
			source: new ol.source.XYZ({
				attributions: [
					new ol.Attribution({
						html: 'Earthstar Geographics'
					})
				],
				url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery' + self.ZYX
			})
		});
	};

	/**
	 * Selects/highlights a specific region on the map
	 *
	 * @param {type} regionId the id of the region to choose
	 * @param {ol.Collection.<ol.layer.Base>} vectorLayers
	 * @returns {undefined}
	 */
	self.highlightRegion = function (regionId, vectorLayers) {
		if (regionId) {
			_.chain(vectorLayers)
				.each(function (l) {
					l.setVisible(true);
				})
				.filter(function (l) {
					return l.getProperties().id !== regionId;
				})
				.each(function (l) {
					l.setVisible(false);
				});
		} else {
			_.each(vectorLayers, function (l) {
				l.setVisible(true);
			});
		}
		
	};

	return self;
});



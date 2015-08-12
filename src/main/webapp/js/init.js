/*jslint browser: true*/
/*global $*/
/*global log4javascript*/
define([
	'controller/AppRouter',
	'backbone',
	'utils/logger',
	'module'
], function (Router, Backbone, logger, module) {
	"use strict";
	var router = new Router();
	var LOG = logger.init();

	Backbone.history.start({root: module.config().contextPath});

	LOG.info("Sparrow UI inititialized");

	return router;
});
/*jslint browser: true*/
/*global $*/
/*global log4javascript*/

var SP = SP || {};

$(document).ready(function() {
	"use strict";
	
	SP.logger = log4javascript.getLogger();

	SP.appRouter = new SP.controller.AppRouter();
	Backbone.history.start();
});
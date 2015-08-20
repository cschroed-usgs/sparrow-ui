/* jslint browser: true */
define([
	'handlebars',
	'views/BaseView',
	'utils/logger',
	'text!templates/nav.html'
], function(Handlebars, BaseView, log, hbTemplate) {
	"use strict";

	var view = BaseView.extend({
		template : Handlebars.compile(hbTemplate),

		events: {
			'click #button-save-session': 'saveSession',
			'click #button-help': 'displayHelp'
		},

		saveSession: function () {
			log.debug("Save session button clicked");
		},
		displayHelp: function () {
			log.debug("Display help button clicked");
		}
	});

	return view;
});



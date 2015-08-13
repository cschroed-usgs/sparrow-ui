/*jslint browser: true */
define([
	'handlebars',
	'views/BaseView',
	'views/MapView',
	'text!templates/home.html'
], function(Handlebars, BaseView, MapView, hbTemplate) {
	var view = BaseView.extend({

		template : Handlebars.compile(hbTemplate),

		initialize : function(options) {
			BaseView.prototype.initialize.apply(this, arguments);

			this.mapView = new MapView({
				mapDivId : 'map-container'
			});
		}
	});

	return view;
});



/*jslint browser : true*/
/*global Backbone*/

var SP = SP || {};

SP.controller = SP.controller || {};

(function() {
	"use strict";

	SP.controller.AppRouter = Backbone.Router.extend({

		routes : {
			'' :  'mapView'
		},

		mapView : function() {
			var view = new SP.views.MapView({
				mapDivId : 'map-container'
			});
		}
	});
}());





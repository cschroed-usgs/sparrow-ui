/*jslint browser:true*/
/*global expect*/
/*global jasmine*/

define([
	'squire',
	'backbone'
], function(Squire, Backbone) {

	describe('HomeView', function() {
		var HomeView, mapViewInitializeSpy;

		beforeEach(function(done) {
			var injector = new Squire();
			mapViewInitializeSpy = jasmine.createSpy('mapViewInitializeSpy');
			injector.mock('views/MapView', function() {
				return Backbone.View.extend({
					initialize : mapViewInitializeSpy
				});
			});
			injector.mock('text!templates/home.html', function(){
				return '';
			});

			injector.require(['views/HomeView'], function(view) {
				HomeView = view;
				done();
			});

		});

		it('Expects that a map view is created', function() {
			var testView = new HomeView();
			expect(mapViewInitializeSpy).toHaveBeenCalled();
			expect(testView.mapView).toBeDefined();
		});

	});
});

/*jslint browser:true*/
/*global expect*/
/*global jasmine*/

define([
	'squire',
	'backbone'
], function(Squire, Backbone) {

	describe('HomeView', function() {
		var HomeView, mapViewInitializeSpy, mapRenderSpy, mockMapView;

		beforeEach(function(done) {
			var injector = new Squire();
			mapViewInitializeSpy = jasmine.createSpy('mapViewInitializeSpy');
			mapRenderSpy = jasmine.createSpy('mapRenderSpy');
			injector.mock('views/MapView', function() {
				return Backbone.View;
			});
			injector.mock('text!templates/home.html', '');

			injector.require(['views/HomeView'], function(view) {
				HomeView = view;
				done();
			});
		});

		it('Expects that a map view is created', function() {
			var testView = new HomeView();
			expect(testView.mapView).toBeDefined();
		});

		it('Expects that the map view is rendered when render is called', function() {
			var testView = new HomeView();
			testView.mapView.render = mapRenderSpy;
			testView.render();
			expect(testView.mapView.render).toHaveBeenCalled();
		});

	});
});

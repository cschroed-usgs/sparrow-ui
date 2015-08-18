/*jslint browser:true*/
/*global expect*/
/*global jasmine*/

define([
	'squire',
	'backbone'
], function(Squire, Backbone) {

	describe('HomeView', function() {
		var HomeView, mapRenderSpy, selectViewRenderSpy, setElementViewSpy, selectViewInitializeSpy;
		var removeMapViewSpy, removeSelectViewSpy;

		beforeEach(function(done) {
			this.collection = new Backbone.Collection();

			var injector = new Squire();

			// Create spies
			mapRenderSpy = jasmine.createSpy('mapRenderSpy');
			selectViewRenderSpy = jasmine.createSpy('selectViewRenderSpy');
			setElementViewSpy = jasmine.createSpy('setElementSpy');
			selectViewInitializeSpy = jasmine.createSpy('selectViewInitializeSpy');
			removeMapViewSpy = jasmine.createSpy('removeMapViewSpy');
			removeSelectViewSpy = jasmine.createSpy('removeSelectViewSpy');

			// Create mocks for dependencies
			injector.mock('views/MapView', Backbone.View.extend({
				render : mapRenderSpy,
				remove : removeMapViewSpy
			}));
			injector.mock('views/SelectModelView', Backbone.View.extend({
				initialize : selectViewInitializeSpy,
				render : selectViewRenderSpy,
				setElement : setElementViewSpy.and.returnValue({
					render : selectViewRenderSpy
				}),
				remove : removeSelectViewSpy
			}));
			injector.mock('text!templates/home.html', '');

			injector.require(['views/HomeView'], function(view) {
				HomeView = view;
				done();
			});
		});

		it('Expects that a sub views and models are created', function() {
			var testView = new HomeView({
				collection : this.collection
			});
			expect(testView.selectionModel).toBeDefined();
			expect(testView.mapView).toBeDefined();
			expect(testView.selectModelView).toBeDefined();
			expect(selectViewInitializeSpy).toHaveBeenCalled();
			expect(selectViewInitializeSpy.calls.mostRecent().args[0].collection).toEqual(this.collection);
			expect(selectViewInitializeSpy.calls.mostRecent().args[0].model).toEqual(testView.selectionModel);
		});

		it('Expects that the map view and selectModelView are rendered when render is called', function() {
			var testView = new HomeView();

			testView.render();
			expect(mapRenderSpy).toHaveBeenCalled();
			expect(selectViewRenderSpy).toHaveBeenCalled();
		});

		it('Expects that when this view is removed the sub views are removed', function() {
			var testView = new HomeView();
			testView.remove();
			expect(removeMapViewSpy).toHaveBeenCalled();
			expect(removeSelectViewSpy).toHaveBeenCalled();
		});

	});
});

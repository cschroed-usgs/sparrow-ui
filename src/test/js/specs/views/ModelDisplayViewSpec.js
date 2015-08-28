/*jslint browser: true */
/*global expect */
/*global jasmine */

define([
	'squire',
	'backbone',
	'views/BaseView'
], function(Squire, Backbone, BaseView) {
	describe('ModelDisplayView', function() {
		var ModelDisplayView;
		var collection;
		var resetViewSpy, mapViewSpy, mapFilterViewSpy;
		var resetInitializeSpy, mapInitializeSpy, mapFilterInitializeSpy;
		var resetRenderSpy, mapRenderSpy, mapFilterRenderSpy;
		var resetRemoveSpy, mapRemoveSpy, mapFilterRemoveSpy;
		var router;

		beforeEach(function(done) {
			var injector = new Squire();

			resetViewSpy = jasmine.createSpyObj('resetSpy', ['initialize', 'render', 'remove']);
			mapViewSpy = jasmine.createSpyObj('mapSpy', ['initialize', 'render', 'remove']);
			mapFilterViewSpy = jasmine.createSpyObj('mapFilterSpy', ['initialize', 'render', 'remove']);

			router = new Backbone.Router();

			collection = new Backbone.Collection();

			injector.mock('views/NavView', Backbone.View);
			injector.mock('views/ResetView', Backbone.View.extend(resetViewSpy));
			injector.mock('views/ModelMapView', Backbone.View.extend(mapViewSpy));
			injector.mock('views/MapFilterView', Backbone.View.extend(mapFilterViewSpy));
			injector.mock('text!templates/home.html', 'Template content');

			injector.require(['views/ModelDisplayView'], function(view) {
				ModelDisplayView = view;
				done();
			});
		});

		it('Expects the subviews to have been created and initialized with the expected options', function() {
			var testView = new ModelDisplayView({
				modelId : '12',
				collection : collection,
				router : router
			});

			expect(testView.mapFilterModel).toBeDefined();

			expect(testView.navView).toBeDefined();
			expect(testView.resetView).toBeDefined();
			expect(resetViewSpy.initialize).toHaveBeenCalled();
			expect(resetViewSpy.initialize.calls.mostRecent().args[0].modelId).toEqual('12');
			expect(resetViewSpy.initialize.calls.mostRecent().args[0].collection).toEqual(collection);
			expect(resetViewSpy.initialize.calls.mostRecent().args[0].router).toEqual(router);

			expect(testView.mapView).toBeDefined();
			expect(mapViewSpy.initialize).toHaveBeenCalled();
			expect(mapViewSpy.initialize.calls.mostRecent().args[0].modelId).toEqual('12');
			expect(mapViewSpy.initialize.calls.mostRecent().args[0].model).toEqual(testView.mapFilterModel);

			expect(testView.mapFilterView).toBeDefined();
			expect(mapFilterViewSpy.initialize).toHaveBeenCalled();
			expect(mapFilterViewSpy.initialize.calls.mostRecent().args[0].modelId).toEqual('12');
			expect(mapFilterViewSpy.initialize.calls.mostRecent().args[0].collection).toEqual(collection);
			expect(mapFilterViewSpy.initialize.calls.mostRecent().args[0].model).toEqual(testView.mapFilterModel);
		});

		it('Expects the subviews to be rendered when the view\'s render is called', function() {
			var testView = new ModelDisplayView({
				modelId : '12',
				collection : collection,
				router : router
			});
			testView.render();
			expect(resetViewSpy.render).toHaveBeenCalled();
			expect(mapViewSpy.render).toHaveBeenCalled();
			expect(mapFilterViewSpy.render).toHaveBeenCalled();
		});

		it('Expects the subviews to be removed when the view\'s remove is called', function() {
			var testView = new ModelDisplayView({
				modelId : '12',
				collection : collection,
				router : router
			});
			testView.remove();

			testView.remove();
			expect(resetViewSpy.remove).toHaveBeenCalled();
			expect(mapViewSpy.remove).toHaveBeenCalled();
			expect(mapFilterViewSpy.remove).toHaveBeenCalled();
		});
	});
});
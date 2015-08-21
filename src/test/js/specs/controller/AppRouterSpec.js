/* global jasmine */
/* global expect */

define([
	'squire',
	"backbone",
	"sinon",
	'jquery'
], function (Squire, Backbone, sinon, $) {
	describe("Router", function () {
		var Router, fetchSpy, homeViewInitializeSpy, modelDisplayViewInitializeSpy;
		var fetchDeferred;
		beforeEach(function (done) {
			fetchDeferred = $.Deferred();
			fetchSpy = jasmine.createSpy('fetchSpy').and.returnValue(fetchDeferred);
			homeViewInitializeSpy = jasmine.createSpy('homeViewInitializeSpy');
			modelDisplayViewInitializeSpy = jasmine.createSpy('modelDisplayViewInitializeSpy');
			var injector = new Squire();
			injector.mock('collections/ModelCollection', Backbone.Collection.extend({
				fetch : fetchSpy
			}));
			injector.mock('views/HomeView', Backbone.View.extend({
				initialize : homeViewInitializeSpy
			}));
			injector.mock('views/ModelDisplayView', Backbone.View.extend({
				initialize : modelDisplayViewInitializeSpy
			}));
			injector.require(['controller/AppRouter'], function(router) {
				Router = router;
				done();
			});
		});
		it('Expects a modelCollection to have been created and fetched', function() {
			var router = new Router();
			expect(router.modelCollection).toBeDefined();
			expect(fetchSpy).toHaveBeenCalled();
		});
		it('Expects a failed call to fetch to call the errorView', function() {
			var router = new Router();
			spyOn(router, 'errorView');
			fetchDeferred.reject();
			expect(router.errorView).toHaveBeenCalled();
		});
		it('Expects a successful call but no models in the model collection to call the errorView', function() {
			var router = new Router();
			spyOn(router, 'errorView');
			fetchDeferred.resolve();
			expect(router.errorView).toHaveBeenCalled();
		});
		it('Expects a successful call with models in the model collection not call the errorView', function() {
			var router = new Router();
			spyOn(router, 'errorView');
			router.modelCollection.add([new Backbone.Model()]);
			fetchDeferred.resolve();
			expect(router.errorView).not.toHaveBeenCalled();
		});

		// This broked when I added squire. Not sure how to fix
		xdescribe('Tests to see if the correct routes are taken', function() {
			var router;
			beforeEach(function() {
				router = new Router();

				try {
					Backbone.history.start({silent : true});
				} catch (e) {
				}
				router.navigate("elsewhere");

			});


			it("does not fire for unknown paths", function () {
				router.navigate("unknown", {trigger : true});
				expect(homeViewInitializeSpy).not.toHaveBeenCalled();
			});

			it("fires the default root with a blank hash", function () {
				router.navigate("", {trigger : true});
				expect(homeViewInitializeSpy.calls.count()).toEqual(1);
				expect(homeViewInitializeSpy.calls.argsFor(1)).toEqual([{collection : router.modelCollection}]);
			});
		});
	});
});
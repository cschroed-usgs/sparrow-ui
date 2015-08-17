define([
	'squire',
	'backbone'
], function(Squire, Backbone) {
	describe('SearchView', function () {
		var HomeView, SearchView, mapViewInitializeSpy, mapRenderSpy, templateSpy;

		beforeEach(function(done) {
			$('body').append('<div class=".region-search-container-div"></div>');
			this.$testDiv = $('.region-search-container-div');
			templateSpy = jasmine.createSpy('templateSpy').and.returnValue('Template content');
			
			var injector = new Squire();
			mapViewInitializeSpy = jasmine.createSpy('mapViewInitializeSpy');
			mapRenderSpy = jasmine.createSpy('mapRenderSpy');
			injector.mock('views/MapView', function() {
				return Backbone.View;
			});
			injector.mock('text!templates/home.html', 'text!templates/region_search.html');
			injector.require(['views/HomeView', 'views/SearchView'], function(homeView, searchView) {
				HomeView = homeView;
				SearchView = searchView;
				done();
			});
			
		});
		
		it('Expects the template property to be used to render this view ', function() {
			var testView = new SearchView({
				template : templateSpy
			});
			
 			expect(testView.template()).toEqual('Template content');
		});
		
		afterEach(function () {
			this.$testDiv.remove();
		});
	});
});
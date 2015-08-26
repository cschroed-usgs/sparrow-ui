/* jslint browser: true */
/* global expect */
/* global jasmine */

define([
	'squire',
	'backbone'
], function(Squire, Backbone) {
	describe('SearchView', function () {
		var SearchView, mapViewInitializeSpy, mapRenderSpy, templateSpy;

		beforeEach(function(done) {
			$('body').append('<div class=".region-search-container-div"></div>');
			this.$testDiv = $('.region-search-container-div');
			templateSpy = jasmine.createSpy('templateSpy').and.returnValue('Template content');

			var injector = new Squire();
			mapViewInitializeSpy = jasmine.createSpy('mapViewInitializeSpy');
			mapRenderSpy = jasmine.createSpy('mapRenderSpy');
			injector.mock('text!templates/region_search.html', 'Template content');
			injector.require(['views/SearchView'], function(searchView) {
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
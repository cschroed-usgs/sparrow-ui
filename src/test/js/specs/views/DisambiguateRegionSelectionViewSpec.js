/* jslint browser: true */
/* global expect */
/* global spyOn */
/* global jasmine */

define([
	'squire',
	'jquery',
	'underscore',
	'models/SelectionModel',
	'collections/ModelCollection'
], function(Squire, $, _, SelectionModel, ModelCollection) {

	describe('DisambiguateRegionSelectionView', function() {

		var model, collection, DisambiguateRegionSelectionView;
		var modalSpy;

		var COLLECTION = [
			{
				id : 'id1',
				region : 'Region 1',
				regionId : 'region1',
				constituent : 'TN',
				constituentName : 'Total Nitrogen'
			},
			{
				id : 'id2',
				region : 'Region 2',
				regionId : 'region2',
				constituent : 'TN',
				constituentName : 'Total Nitrogen'
			},
			{
				id : 'id3',
				region : 'Region 1',
				regionId : 'region1',
				constituent : 'TP',
				constituentName : 'Total Phosphorus'
			},
			{
				id : 'id4',
				region : 'Region 3',
				regionId : 'region3',
				constituent : 'TDS',
				constituentName : 'Total DS'
			},
			{
				id : 'id5',
				region : 'Region 3',
				regionId : 'region3',
				constituent : 'TP',
				constituentName : 'Total Phosphorus'
			}
		];

		beforeEach(function(done) {
			$('body').append('<div id="test-div"></div>');
			this.$testDiv = $('#test-div');
			collection = new ModelCollection(COLLECTION);
			model = new SelectionModel();

			var injector = new Squire();
			injector.mock('text!templates/disambiguate_region.html', 'Template content');

			injector.require(['views/DisambiguateRegionSelectionView'], function(view) {
				DisambiguateRegionSelectionView = view;
				done();
			});
		});
		afterEach(function() {
			this.$testDiv.remove();
		});

		it('At initialization should retrieve the constituents for each region from the collection', function() {
			var view = new DisambiguateRegionSelectionView({
				selectionModel : model,
				regions : [{ id: 'region1', name: 'Region 1'}, {id : 'region3', name: 'Region 3'}],
				collection : collection,
				el : '#test-div'
			});
			expect(view.context.regions.length).toBe(2);
			expect(view.context.regions[0].id).toEqual('region1');
			expect(view.context.regions[0].constituents.length).toBe(2);
			expect(view.context.regions[0].constituents).toContain({id: 'TN', name : 'Total Nitrogen'});
			expect(view.context.regions[0].constituents).toContain({id: 'TP', name : 'Total Phosphorus'});
		});

		it('Expects the template to be rendered with the context', function() {
			var view = new DisambiguateRegionSelectionView({
				selectionModel : model,
				regions : [{ id: 'region1', name: 'Region 1'}, {id : 'region3', name: 'Region 3'}],
				collection : collection,
				el : '#test-div'
			});
			spyOn(view, 'template').and.callThrough();
			view.render();
			expect(view.template).toHaveBeenCalledWith(view.context);
			expect(this.$testDiv.html()).toEqual('Template content');
		});
	});
});
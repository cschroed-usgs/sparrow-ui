/*jslint browser: true */
/*global expect */
/*global jasmine */

define([
	'squire',
	'backbone',
	'models/SelectionModel',
	'collections/ModelCollection'
], function(Squire, Backbone, SelectionModel, ModelCollection) {

	describe('SelectModelView', function() {
		var updateMenuOptionsSpy;
		var SelectModelView;
		var selectionModel;
		var collection;
		var stateDeferred;

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
			}
		];

		beforeEach(function(done) {
			// create test dom
			$('body').append('<div id="test-div"></div>');
			this.$testDiv = $('#test-div');
			this.$testDiv.append('<select class="constituent-select"><option value="TN"></option><option value="TP"></option></select>' +
				'<select class="region-select"><option value="region1"></option><option value="region2"></option></select>' +
				'<button class="explore-model"></button>');

			selectionModel = new SelectionModel();
			collection = new ModelCollection(COLLECTION);
			stateDeferred = $.Deferred();
			updateMenuOptionsSpy = jasmine.createSpy('updateMenuOptionsSpy');

			var injector = new Squire();
			injector.mock('views/SelectMenuView', Backbone.View.extend({
				updateMenuOptions : updateMenuOptionsSpy
			}));
			injector.mock('text!templates/model_selection.html', '');
			injector.require(['views/SelectModelView'], function(view) {
				SelectModelView = view;
				done();
			});

			injector.mock('utils/SpatialUtils', {
				getStatesForRegion : jasmine.createSpy('getStatesForRegion').and.returnValue(stateDeferred)
			});
		});

		afterEach(function() {
			this.$testDiv.remove();
		});

		it('Expects a constituent and region select view are created', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});

			expect(view.constituentSelectView).toBeDefined();
			expect(view.regionSelectView).toBeDefined();
		});

		it('Expects disabled to be set in the view\'s context by default', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});
			expect(view.context.disabled).toBe(false);
		});

		it('Expects disabled to set in the view\'s context to be set if passed in at creation', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection,
				disabled : true
			});
			expect(view.context.disabled).toBe(true);
		});

		it('Expects the context to contain the appropriate menu object objects for constituents and regions', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});
			expect(view.context.constituents.length).toBe(2);
			expect(view.context.constituents[0]).toEqual({
				text : 'Total Nitrogen',
				value : 'TN',
				selected : false
			});
			expect(view.context.constituents[1]).toEqual({
				text : 'Total Phosphorus',
				value : 'TP',
				selected : false
			});

			expect(view.context.regions.length).toBe(2);
			expect(view.context.regions[0]).toEqual({
				text : 'Region 1',
				value : 'region1',
				selected : false
			});
			expect(view.context.regions[1]).toEqual({
				text : 'Region 2',
				value : 'region2',
				selected : false
			});
		});

		it('Expects that a call to render calls updateMenuOptions on the subviews', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});
			view.render();
			expect(updateMenuOptionsSpy.calls.count()).toBe(2);
		});

		it('Expects that if the collection is updated the view the regions and constituents properties are updated and the view is rendered', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});
			spyOn(view, 'render');
			collection.remove(collection.models[2]);
			expect(view.context.constituents.length).toBe(1);
			expect(view.context.regions.length).toBe(2);
			expect(view.render).toHaveBeenCalled();
		});

		it('Expects that if changeConstituent is called the model is updated', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});
			var ev = {
				currentTarget : {
					value : 'TP'
				}
			};
			view.changeConstituent(ev);
			expect(selectionModel.get('constituent')).toEqual('TP');
		});

		it('Expects that if changeRegion is called the model is updated', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});
			var ev = {
				currentTarget : {
					value : 'region1'
				}
			};
			view.changeRegion(ev);
			expect(selectionModel.get('region')).toEqual('region1');
		});

		it('Expects that if the model constituent attribute changes, the region select view choices are updated and the constituent menu value is set', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});
			selectionModel.set('constituent', 'TP');
			expect(updateMenuOptionsSpy).toHaveBeenCalled();
			expect(updateMenuOptionsSpy.calls.mostRecent().args[0]).toEqual([{
					text : 'Region 1',
					value : 'region1',
					selected : false
			}]);
			expect(this.$testDiv.find('.constituent-select').val()).toEqual('TP');
		});

		it('Expects that if the model region attribute changes, the constituent select view choices are updated and the region menu value is set', function() {
			var view = new SelectModelView({
				el : this.$testDiv,
				model : selectionModel,
				collection : collection
			});
			selectionModel.set('region', 'region2');
			expect(updateMenuOptionsSpy).toHaveBeenCalled();
			expect(updateMenuOptionsSpy.calls.mostRecent().args[0]).toEqual([{
					text : 'Total Nitrogen',
					value : 'TN',
					selected : false
			}]);
			expect(this.$testDiv.find('.region-select').val()).toEqual('region2');
		});
	});
});
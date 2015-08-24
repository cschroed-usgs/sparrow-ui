/*jslint browser: true */
/*global expect */
/*global jasmine */

define([
	'squire',
	'backbone',
	'models/selectionModel',
	'collections/ModelCollection'
], function(Squire, Backbone, SelectionModel, ModelCollection) {

	describe('SelectModelView', function() {
		var updateMenuOptionsSpy;
		var SelectModelView;
		var selectionModel;
		var collection;

		var COLLECTION = [
			{
				id : 'id1',
				region : 'Region 1',
				regionId : 'region1',
				constituent : 'TN'
			},
			{
				id : 'id2',
				region : 'Region 2',
				regionId : 'region2',
				constituent : 'TN'
			},
			{
				id : 'id3',
				region : 'Region 1',
				regionId : 'region1',
				constituent : 'TP'
			}
		];

		beforeEach(function(done) {
			// create test dom
			$('body').append('<div id=test-div"></div>');
			this.$testDiv = $('#test-div');
			this.$testDiv.append('<select class="constituent-select"><option></option></select>' +
				'<select class="region-select"><option></option></select>' +
				'<button class="explore-model"></button>');

			selectionModel = new SelectionModel();
			collection = new ModelCollection();
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
		});

		afterEach(function() {
			this.$testDiv.remove();
		});

		it('Expects a constituent and region select view are created', function() {
			var view = new SelectModelView({
				model : selectionModel,
				collection : collection
			});

			expect(view.constituentSelectView).toBeDefined();
			expect(view.regionSelectView).toBeDefined();
		});

		it('Expects disabled to be set in the view\'s context by default', function() {
			var view = new SelectModelView({
				model : selectionModel,
				collection : collection
			});
			expect(view.context.disabled).toBe(false);
		});

		it('Expects disabled to set in the view\'s context to be set if passed in at creation', function() {
			var view = new SelectModelView({
				model : selectionModel,
				collection : collection,
				disabled : true
			});
			expect(view.context.disabled).toBe(true);
		});

		it('Expects that a call to render calls updateMenuOptions on the subviews', function() {
			var view = new SelectModelView({
				model : selectionModel,
				collection : collection
			});
			view.render();
			expect(updateMenuOptionsSpy.calls.count()).toBe(2);
			expect(updateMenuOptionsSpy.calls.argsFor(0)).toEqual([[]]);
			expect(updateMenuOptionsSpy.calls.argsFor(1)).toEqual([[]]);
		});

		it('Expects that a call to render when the view was created')
	});
});
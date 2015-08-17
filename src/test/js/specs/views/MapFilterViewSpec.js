define([
	'squire',
	'backbone'
], function(Squire, Backbone) {
	xdescribe('MapFilterView', function () {
		var mapFilterView, mapFilterViewInitializeSpy, templateSpy, injector;

		beforeEach(function(done) {
			$('body').append('<div id="map-sidebar-container"></div>');
			this.$testDiv = $('#map-sidebar-container');
			templateSpy = jasmine.createSpy('templateSpy').and.returnValue('Template content');

			injector = new Squire();
			mapFilterViewInitializeSpy = jasmine.createSpy('mapFilterViewInitializeSpy');
			injector.require(['views/MapFilterView'], function(mfView) {
				mapFilterView = mfView;
				done();
			});
		});

		it('has initial model set to defaults', function() {
			var testView = new mapFilterView();
 			expect(testView.model).not.toBe(null);
			expect(testView.model.get("state")).toEqual("state");
			expect(testView.model.get("waterBody")).toEqual("waterbody");
			expect(testView.model.get("waterShed")).toEqual("watershed");
			expect(testView.model.get("dataSeries")).toEqual("ds-total-yield");
			expect(testView.model.get("groupResultsBy")).toEqual("group-catchment");
		});

		it('changes the model when a new item is selected', function () {
			var testView = new mapFilterView().render();

			expect($('#state').length).toEqual(1);
			expect(testView.model.get("state")).toEqual("state");

			var $option = $('#state').children(":nth-child(2)");
			var value = $option.attr('value');
			$('#state').val(value);
			$('#state').trigger('change');

			expect(testView.model.get("state")).toEqual(value);
		});

		it('Expects the template property to be used to render this view ', function() {
			var testView = new mapFilterView({
				template : templateSpy
			});

 			expect(testView.template()).toEqual('Template content');
		});

		afterEach(function () {
			this.$testDiv.remove();
		});
	});
});
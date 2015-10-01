/* global expect */

define([
	'models/MapFilterModel'
], function (MapFilterModel) {
	
	describe("MapFilterModel", function () {
		it("resets to the defaults", function () {
			var model = new MapFilterModel();
			var defaults = model.defaults();
			model.reset();
			var test = model.attributes;
			
			expect(test.state).toBe(defaults.state);
			expect(test.waterBody).toBe(defaults.waterBody);
			expect(test.waterShed).toBe(defaults.waterShed);
			expect(test.dataSeries).toBe(defaults.dataSeries);
			expect(test.groupResultsBy).toBe(defaults.groupResultsBy);
			expect(test.waterSheds.length).toBe(defaults.waterSheds.length);
		});
	});
	
});
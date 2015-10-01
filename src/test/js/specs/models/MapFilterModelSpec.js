/* global expect */

define([
	'models/MapFilterModel'
], function (MapFilterModel) {
	
	describe("MapFilterModel", function () {
		it("resets to the defaults", function () {
			var model = new MapFilterModel();
			var defaults = model.defaults();
			
			model.set('state', ['AK']);
			model.set('waterBody', '...');
			model.set('waterShed', '...');
			model.set('dataSeries', '...');
			model.set('groupResultsBy', '...');
			model.set('waterSheds', [1]);
			
			var test = model.attributes;
			expect(test.state).not.toBe(defaults.state);
			expect(test.waterBody).not.toBe(defaults.waterBody);
			expect(test.waterShed).not.toBe(defaults.waterShed);
			expect(test.dataSeries).not.toBe(defaults.dataSeries);
			expect(test.groupResultsBy).not.toBe(defaults.groupResultsBy);
			expect(test.waterSheds.length).not.toBe(defaults.waterSheds.length);
			
			model.reset();
			test = model.attributes;
			
			
			
			expect(test.state).toBe(defaults.state);
			expect(test.waterBody).toBe(defaults.waterBody);
			expect(test.waterShed).toBe(defaults.waterShed);
			expect(test.dataSeries).toBe(defaults.dataSeries);
			expect(test.groupResultsBy).toBe(defaults.groupResultsBy);
			expect(test.waterSheds.length).toBe(defaults.waterSheds.length);
		});
	});
	
});
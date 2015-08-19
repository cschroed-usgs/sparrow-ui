/* global expect */

define([
	'backbone',
	'views/SelectMenuView'
], function (Backbone, SelectMenuView) {

	describe('SelectMenuView', function() {

		describe('Tests without a placeholder', function() {

			beforeEach(function() {
				$('body').append('<select id="test-select"></select');
			});

			afterEach(function() {
				$('#test-select').remove();
			});

			it('Expects a select menu view to contain the options specified', function() {
				var testView = new SelectMenuView({
					el : '#test-select',
					menuOptions: [{value: 'smith', text: 'Smith', selected: true},{value: 'jones', text: 'Jones', selected: false},{value: 'olsen', text: 'Olsen', selected: true}]
				});
				var $options = $('#test-select option');
				expect($options.length).toBe(3);
				expect($('#test-select option:nth-child(1)').val()).toEqual('smith');
				expect($('#test-select option:nth-child(2)').val()).toEqual('jones');
				expect($('#test-select option:nth-child(3)').val()).toEqual('olsen');

				expect($('#test-select option:nth-child(1)').html()).toEqual('Smith');
				expect($('#test-select option:nth-child(2)').html()).toEqual('Jones');
				expect($('#test-select option:nth-child(3)').html()).toEqual('Olsen');

				expect($('#test-select option:nth-child(1)').prop('defaultSelected')).toEqual(true);
				expect($('#test-select option:nth-child(2)').prop('defaultSelected')).toEqual(false);
				expect($('#test-select option:nth-child(3)').prop('defaultSelected')).toEqual(true);
			});

			it('Expects a menu to be sorted by text if sortBy is set to "text"', function() {
				var testView = new SelectMenuView({
					el : '#test-select',
					menuOptions: [{value: 'smith', text: 'Smith', selected: false},{value: 'jones', text: 'Jones', selected: false},{value: 'olsen', text: 'Olsen', selected: false}],
					sortBy : 'text'
				});

				expect($('#test-select option:nth-child(1)').val()).toEqual('jones');
				expect($('#test-select option:nth-child(2)').val()).toEqual('olsen');
				expect($('#test-select option:nth-child(3)').val()).toEqual('smith');
			});

			it('Expects a menu to be sorted by value if sortBy is set to "value"', function() {
				var testView = new SelectMenuView({
					el : '#test-select',
					menuOptions: [{value: 'smith', text: 'Smith', selected: false},{value: 'jones', text: 'Jones', selected: false},{value: 'olsen', text: 'Olsen', selected: false}],
					sortBy : 'value'
				});

				expect($('#test-select option:nth-child(1)').val()).toEqual('jones');
				expect($('#test-select option:nth-child(2)').val()).toEqual('olsen');
				expect($('#test-select option:nth-child(3)').val()).toEqual('smith');
			});

			it('Expects a menu to be sorted in reverse if sortAscending is set to false', function() {
				var testView = new SelectMenuView({
					el : '#test-select',
					menuOptions: [{value: 'smith', text: 'Smith', selected: false},{value: 'jones', text: 'Jones', selected: false},{value: 'olsen', text: 'Olsen', selected: false}],
					sortBy : 'text',
					sortAscending: false
				});

				expect($('#test-select option:nth-child(3)').val()).toEqual('jones');
				expect($('#test-select option:nth-child(2)').val()).toEqual('olsen');
				expect($('#test-select option:nth-child(1)').val()).toEqual('smith');
			});

			it('Expects the menu to be updated when updateMenuOptions is called', function() {
				var testView = new SelectMenuView({
					el : '#test-select',
					menuOptions: [{value: 'smith', text: 'Smith', selected: false},{value: 'jones', text: 'Jones', selected: false},{value: 'olsen', text: 'Olsen', selected: false}]
				});
				testView.updateMenuOptions([{value: '1', text: 'One', selected: false},{value: '2', text: 'Two', selected: false},{value: '3', text: 'Three', selected: false}]);
				expect($('#test-select option:nth-child(1)').val()).toEqual('1');
				expect($('#test-select option:nth-child(2)').val()).toEqual('2');
				expect($('#test-select option:nth-child(3)').val()).toEqual('3');
			});
		});

		describe('Tests with an placeholder', function() {
			beforeEach(function() {
				$('body').append('<select id="test-select"><option></option></select');
			});

			afterEach(function() {
				$('#test-select').remove();
			});

			it('Expects the placeholder to be preserved when creating and updating the menu', function() {
				var testView = new SelectMenuView({
					el : '#test-select',
					menuOptions: [{value: 'smith', text: 'Smith', selected: false},{value: 'jones', text: 'Jones', selected: false},{value: 'olsen', text: 'Olsen', selected: false}],
					hasPlaceholder : true
				});

				expect($('#test-select option').length).toBe(4);
				expect($('#test-select option:nth-child(1)').val()).toEqual('');
				expect($('#test-select option:nth-child(2)').val()).toEqual('smith');
				expect($('#test-select option:nth-child(3)').val()).toEqual('jones');
				expect($('#test-select option:nth-child(4)').val()).toEqual('olsen');
			});
		});
	});
});
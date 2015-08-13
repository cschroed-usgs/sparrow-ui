/*jslint browser:true*/
/*global expect*/
/*global jasmine*/

define([
	'views/BaseView'
],
function(BaseView) {
	describe('BaseView', function() {
		beforeEach(function() {
			$('body').append('<div id="test-div"></div>');
			this.$testDiv = $('#test-div');

			this.templateSpy = jasmine.createSpy('templateSpy').and.returnValue('Template content');

			this.TestView = BaseView.extend({
				template : this.templateSpy
			});
		});

		afterEach(function() {
			this.$testDiv.remove();
		});

		it('Expects the template property to be used to render this view if not overridden in options', function() {
			var testView = new this.TestView({
				el : this.$testDiv
			});

			expect(this.templateSpy).toHaveBeenCalled();
			expect(this.$testDiv.html()).toEqual('Template content');
		});

		it('Expects the template passed in via instantiation to override the template property when rendering', function() {
			var testTemplate = jasmine.createSpy('secondTemplateSpy').and.returnValue('New template content');
			var testView = new this.TestView({
				el : this.$testDiv,
				template : testTemplate
			});

			expect(this.templateSpy).not.toHaveBeenCalled();
			expect(testTemplate).toHaveBeenCalled();
			expect(this.$testDiv.html()).toEqual('New template content');
		});

		it('Expects that if the view is instantiated with a context, that context is called by the template function', function() {
			var testView = new this.TestView({
				el : this.$testDiv,
				template : this.templateSpy,
				context : {
					prop1 : 'One',
					prop2 : 'Two'
				}
			});

			expect(this.templateSpy).toHaveBeenCalledWith({
					prop1 : 'One',
					prop2 : 'Two'
			});
		});
	});

});
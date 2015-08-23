define([
	'handlebars',
	'views/BaseView',
	'text!templates/disambiguate_region.html',
	'bootstrap'
], function(Handlebars, BaseView, templateText) {
	var view = BaseView.extend({
		modalId : '#disambiguation-modal',
		template: Handlebars.compile(templateText),
		render : function (options) {
			var html = this.template(this.context);
			this.$el.append(html);
			
			this.modal = $(this.modalId).modal(options);
			
			return this;
		},
		initialize : function (options) {
			BaseView.prototype.initialize.apply(this, arguments);
			this.context.regions = options.regions;
		}
	});

	return view;
});
define([
	'handlebars',
	'views/BaseView',
	'text!templates/disambiguate_region.html',
	'bootstrap'
], function (Handlebars, BaseView, templateText) {
	var view = BaseView.extend({
		modalId: '#disambiguation-modal',
		template: Handlebars.compile(templateText),
		render: function (options) {
			var html = this.template(this.context);
			this.$el.append(html);

			this.modal = $(this.modalId).modal(options);

			// Bind to the view's modal window 
			this.$(this.modalId + ' button').one('click', $.proxy(function (evt) {
				var buttonId = evt.target.getAttribute('id'),
						insignificantIdLength = "button-region-".length,
						regionId = buttonId.substr(insignificantIdLength);

				if (regionId !== 'cancel') {
					this.selectModalModel.set('region', regionId);
				} else {
					this.selectModalModel.set('region', '');
				}
			}, this));

			return this;
		},
		initialize: function (options) {
			BaseView.prototype.initialize.apply(this, arguments);
			this.context.regions = options.regions;
			this.selectModalModel = options.selectModalModel;
		}
	});

	return view;
});
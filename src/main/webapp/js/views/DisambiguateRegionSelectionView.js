define([
	'underscore',
	'handlebars',
	'views/BaseView',
	'text!templates/disambiguate_region.html',
	'bootstrap'
], function (_, Handlebars, BaseView, templateText) {
	var view = BaseView.extend({
		template: Handlebars.compile(templateText),

		events : {
			'click .region-btn' : 'updateRegionSelection',
			'click #button-region-cancel' : 'unsetRegionSelection'
		},

		render: function () {
			var html = this.template(this.context);
			this.$el.append(html);

			this.modal = this.$el.modal(this.modalOptions);
		},

		/*
		 * @param {Object} options
		 *      @prop {Array of Object} regions - each object has an id and name property
		 *      @prop {SelectionModel} selectionModel
		 *      @prop {ModelCollection} collection
		 *      @prop {Object} modalOptions - options to use when creating the modal window in this view.
		 */
		initialize: function (options) {
			BaseView.prototype.initialize.apply(this, arguments);
			this.context.regions = _.map(options.regions, function(r) {
				return _.extend(r, {
					constituents : this.collection.getConstituents(r.id)
				});
			}, this);
			this.selectionModel = options.selectionModel;
			this.modalOptions = options.modalOptions || {};

		},

		updateRegionSelection : function(evt) {
			var regionId = $(evt.currentTarget).data('regionId');
			this.selectionModel.set('region', regionId);
		},

		unsetRegionSelection : function() {
			this.selectionModel.set('region', '');
		}
	});

	return view;
});
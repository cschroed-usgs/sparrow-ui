define([
	'underscore',
	'handlebars',
	'backbone'
], function(_, Handlebars, Backbone) {
	"use strict";

	var view = Backbone.View.extend({
		render : function() {
			if (this.hasPlaceholder) {
				this.$el.find('option').not(':first-child').remove();
			}
			else {
				this.$el.find('option').remove();
			}
			this.$el.append(this.template({options : this.menuOptions}));
			return this;
		},

		initialize : function(options) {
			this.hasPlaceholder = _.has(options, 'hasPlaceholder') ? options.hasPlaceholder : false;

			//'text', 'value', 'selected', or a custom function
			this.sortBy = _.has(options, 'sortBy') ? options.sortBy : false;

			//true for ascending, false for descending
			this.sortAscending = _.has(options, 'sortAscending') ? options.sortAscending : true
			this.menuOptions = _.has(options, 'menuOptions') ? options.menuOptions : [];

			this.template = Handlebars.compile('{{#each options}}<option value="{{value}}" {{#if selected}}selected{{/if}}>{{text}}</option>{{/each}}');
			Backbone.View.prototype.initialize.apply(this, arguments);
			this.updateMenuOptions(this.menuOptions);
		},

		updateMenuOptions : function(newOptions) {
			this.menuOptions = newOptions;
			if (this.sortBy) {
				this.menuOptions = _.sortBy(this.menuOptions, this.sortBy);
				if(!this.sortAscending){
					this.menuOptions.reverse();
				}
			}
			this.render();
		}
	});

	return view;
});



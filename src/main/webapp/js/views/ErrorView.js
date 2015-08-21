/*jslint browser:true */

define([
	'views/BaseView',
	'text!templates/app_broken_page.html'
], function(BaseView, templateText) {
	var view = BaseView.extend({
		template : function() {
			return templateText;
		}
	});

	return view;
});


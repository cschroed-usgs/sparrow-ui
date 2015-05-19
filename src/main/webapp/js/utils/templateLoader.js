/*jslint browser: true*/
/*global Handlebars*/
/*global _*/
var SP = SP || {};

SP.utils = SP.utils || {};

SP.utils.templateLoader = function(templateDir) {

	var self = {};

	var templates = {};

	self.getTemplate = function(name) {
		if (_.has(templates, name)) {
			return templates[name];
		}
		else {
			return null;
		}
	};

	self.loadTemplates = function(names) {
		var i;
		var loadingDeferreds = [];
		for (i = 0; i < names.length; i++) {
			templates[names[i]] = '';
			loadingDeferreds.push($.ajax({
				url : templateDir + names[i] + '.html',
				success : function(data) {
					templates[this] = Handlebars.compile(data);
				},
				error : function() {
					templates[this] = Handlebars.compile('Unable to load template');
				},
				context : names[i]
			}));
		}

		return $.when.apply(null, loadingDeferreds);
	};
};




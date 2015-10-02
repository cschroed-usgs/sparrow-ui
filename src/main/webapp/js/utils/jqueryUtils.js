/* jslint browser: true */
/*global define */
define(function () {
	"use strict";
	var that = {};

	that.findXMLNamespaceTags = function ($xml, nsTag) {
		var tag = nsTag.substr(nsTag.indexOf(':') + 1);
		var nsEscTag = nsTag.replace(':', '\\:');

		return $xml.find(nsEscTag + ', ' + tag);
	};

	return that;
});



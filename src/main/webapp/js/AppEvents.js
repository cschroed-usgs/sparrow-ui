define([
	'backbone',
	'underscore'
	],
	function(Backbone, _){
		
		var events = {
			spatialFilters: {
				finalized : 'spatialFiltersFinalized'
			}
		};
		
		return _.extend(events, Backbone.Events);
	}
);
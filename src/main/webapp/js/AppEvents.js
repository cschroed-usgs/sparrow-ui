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
		var extendedEvents = _.extend(events, Backbone.Events);
		return extendedEvents;
	}
);
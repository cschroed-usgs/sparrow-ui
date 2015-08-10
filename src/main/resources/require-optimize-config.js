({
//	wrapShim: true,
	optimizeCss: "none",
	optimize: "none",
	paths: {
		"ol": '${project.build.directory}/require-optimization/META-INF/resources/webjars/openlayers/${version.openlayers}/ol',
		"olLayerSwitcher": '${project.basedir}/src/main/webapp/js/vendor/ol3-layerswitcher/1.0.1/ol3-layerswitcher'
	},
	shim: {
		"olLayerSwitcher": ["ol"]
	},
	modules: [{
		name: "olLayerSwitcher",
		create : true
	}],
	dir: '${project.basedir}/src/main/webapp/js/ol-extended.js'
})
<%@page import="java.io.File"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="gov.usgs.cida.config.DynamicReadOnlyProperties"%>
<!DOCTYPE html>
<%!	protected DynamicReadOnlyProperties props = new DynamicReadOnlyProperties();

	{
		try {
			File propsFile = new File(getClass().getClassLoader().getResource("application.properties").toURI());
			props = new DynamicReadOnlyProperties(propsFile);
			props = props.addJNDIContexts(new String[0]);
		} catch (Exception e) {
			System.out.println("Could not find JNDI - Application will probably not function correctly");
		}

	}

	private String getProp(String key) {
		String result = props.getProperty(key, "");
		return result;
	}
	boolean development = Boolean.parseBoolean(getProp("development"));
	String version = getProp("application.version");
	String resourceSuffix = development ? "" : "-" + version + "-min";
%>
<%
	String baseUrl = props.getProperty("sparrow.base.url", request.getContextPath());
%>

<html lang="en"> 
	<head>
		<jsp:include page="/WEB-INF/jsp/components/common/meta-tags.jsp" />
		<title>Sparrow UI</title>
		<link type="text/css" rel="stylesheet" href="<%=baseUrl%>/<%= org.webjars.AssetLocator.getWebJarPath("css/bootstrap" + (development ? "" : ".min") + ".css")%>" />
		<link type="text/css" rel="stylesheet" href="<%=baseUrl%>/<%= org.webjars.AssetLocator.getWebJarPath("ol.css")%>" />
		<link type="text/css" rel="stylesheet" href="<%=baseUrl%>/js/vendor/ol3-layerswitcher/1.0.1/ol3-layerswitcher<%= resourceSuffix%>.css" />
        <link type="text/css" rel="stylesheet" href="<%= baseUrl%>/css/custom.css" />
	</head>
	<body>
		<div class="container-fluid">

			<%-- BEGIN USGS Header Template --%> 

			<div id="usgscolorband">

				<div id="usgsheader">

					<div id="usgsidentifier">
						<a href="http://www.usgs.gov/" target="_blank"><img src="img/usgslogo.jpg" alt="USGS - science for a changing world" title="U.S. Geological Survey Home Page"/></a>
					</div><%--usgsidentifier--%>

					<img src="img/banner.png" alt="banner"/>

					<div id="usgsccsabox">

						<div id="usgsccsa">
							<a href="http://www.usgs.gov/">USGS Home</a>
							<br /><a href="http://answers.usgs.gov/cgi-bin/gsanswers?tmplt=2">Contact USGS</a>
							<br /><a href="http://search.usgs.gov/">Search USGS</a>
							<br />
						</div><%--usgsccsa--%>

					</div><%--usgsccsabox--%>

				</div><%--usgsheader--%>
			</div><%--colorband--%>

			<%-- END USGS Header Template --%>

			<%-- Start App Title Area --%>
			<div id="page-content-container"></div>
			<%-- END Content Area --%>


			<%-- BEGIN USGS Footer Template --%>

            <div id="usgsfooter">

				<p id="usgsfooterbar">
                    <a href="http://www.usgs.gov/laws/accessibility.html" title="Accessibility Policy (Section 508)" target="_blank">Accessibility</a>
                    <a href="http://www.usgs.gov/foia/" title="Freedom of Information Act" target="_blank">FOIA</a>
                    <a href="http://www.usgs.gov/laws/privacy.html" title="Privacy policies of the U.S. Geological Survey." target="_blank">Privacy</a>
                    <a href="http://www.usgs.gov/laws/policies_notices.html" title="Policies and notices that govern information posted on USGS Web sites." target="_blank">Policies and Notices</a>

				</p><%-- usgsfooterbar --%>


				<p id="usgsfootertext">

                    <a href="http://www.usa.gov/" title="USAGov: Government Made Easy" id="link-usagov" target="_blank"><img id="usa" src="img/usa_gov.png" alt="usa_gov pic"/></a>

                    <a href="http://www.doi.gov/" target="_blank">U.S. Department of the Interior</a> |

					<a href="http://www.usgs.gov/" target="_blank">U.S. Geological Survey</a> |

					<a href="http://www.doioig.gov/" target="_blank">DOI Inspector General</a>

					<p>URL: http//cida.usgs.gov/sparrow</p>

					<p>Contact Information: <a href="mailto:cida_webmaster@usgs.gov?Subject=Hello%20again" target="_top">cida.usgs.gov/sparrow</a></p>

					<p>Page last modified: <script>document.write(document.lastModified);</script></p>

				</p><%-- usgsfootertext --%>

			</div><%-- usgsfooter --%>

			<%--  END USGS Footer Template ​--%>
        </div><%--container-fluid--%>
		<script>
			var require = {
				config: {
					'utils/logger': {
						isDevelopment: <%= development ? true : false%>
					},
					'utils/mapUtils': {
						'endpointGeoserver' : '<%= getProp("endpoint-geoserver")%>',
					    'conus_extent' : [-18341616.56817788, 1526597.395101606, -3196078.0356399175, 8013349.363494803];
					},
					'utils/spatialUtils' : {
						'endpointGeoserver' : '<%= getProp("endpoint-geoserver")%>'
				        'conus_extent' : [-18341616.56817788, 1526597.395101606, -3196078.0356399175, 8013349.363494803];

					},
					'init': {
						'contextPath': "<%=baseUrl%>/"
					}
				},
				baseUrl: "<%=baseUrl%>/js/",
				paths: {
					"bootstrap" :  ["<%=baseUrl%>/webjars/bootstrap/<%= getProp("version.bootstrap")%>/js/bootstrap<%= development ? "" : ".min"%>"] ,
					"jquery": ["<%=baseUrl%>/webjars/jquery/<%= getProp("version.jquery")%>/jquery<%= development ? "" : ".min"%>"],
					"backbone": ['<%=baseUrl%>/webjars/backbonejs/<%= getProp("version.backbone")%>/backbone<%= development ? "" : "-min"%>'],
					"underscore": ['<%=baseUrl%>/webjars/underscorejs/<%= getProp("version.underscore")%>/underscore<%= development ? "" : "-min"%>'],
					"handlebars": ['<%=baseUrl%>/webjars/handlebars/<%= getProp("version.handlebars")%>/handlebars<%= development ? "" : ".min"%>'],
					"text": ['<%=baseUrl%>/webjars/requirejs-text/<%= getProp("version.require.text")%>/text'],
					"loglevel": ['<%=baseUrl%>/webjars/loglevel/<%= getProp("version.loglevel")%>/loglevel<%= development ? "" : ".min"%>'],
					"ol": ['<%=baseUrl%>/webjars/openlayers/<%= getProp("version.openlayers")%>/ol<%= development ? "-debug" : ""%>'],
					"olshim": ['<%=baseUrl%>/js/vendor/olshim'],
					"olLayerSwitcher": ['<%=baseUrl%>/js/vendor/ol3-layerswitcher/1.0.1/ol3-layerswitcher<%= resourceSuffix%>']
				},
				shim: {
					"olLayerSwitcher": ["olshim"],
					"bootstrap": [ "jquery" ]
				}
			};
		</script>
		<script data-main="init" src="<%=baseUrl%>/<%= org.webjars.AssetLocator.getWebJarPath("require" + (development ? "" : ".min") + ".js")%>"></script>
	</body>
</html>

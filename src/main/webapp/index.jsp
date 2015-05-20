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
	String vJquery = getProp("version.jquery");
	String vBootstrap = getProp("version.bootstrap");
	String vFontAwesome = getProp("version.fontawesome");
	String vOpenlayers = getProp("version.openlayers");
	String vHandlebars = getProp("version.handlebars");
	String vUnderscore = getProp("version.underscore");
	String vBackbone = getProp("version.backbone");
	String vLog4Js = getProp("version.log4js");
	String resourceSuffix = development ? "" : "-" + version + "-min";
%>
<%
	String baseUrl = props.getProperty("sparrow.base.url", request.getContextPath());
	String relPath = baseUrl + "/";
%>

<html lang="en"> 
	<head>
		<jsp:include page="/WEB-INF/jsp/components/common/meta-tags.jsp" />
		<title>Sparrow UI</title>
		<link type="text/css" rel="stylesheet" href="<%=baseUrl%>/webjars/font-awesome/<%=vFontAwesome%>/css/font-awesome<%= development ? "" : ".min"%>.css" />
		<link type="text/css" rel="stylesheet" href="<%=baseUrl%>/webjars/openlayers/<%=vOpenlayers%>/ol.css" />
		<link type="text/css" rel="stylesheet" href="<%=baseUrl%>/js/vendor/ol3-layerswitcher/1.0.1/ol3-layerswitcher<%= resourceSuffix %>.css" />
        <link href="css/custom.css" rel="stylesheet" type="text/css">
	</head>
	<body>

    <div class="container-fluid">

    <!-- BEGIN USGS Header Template --> 

        <div id="usgscolorband">

            <div id="usgsheader">

                <div id="usgsidentifier">
                <a href="http://www.usgs.gov/" target="_blank"><img src="img/usgslogo.jpg" alt="USGS - science for a changing world" title="U.S. Geological Survey Home Page"/></a>
                </div><!--usgsidentifier-->

            <img src="img/banner.png" alt="banner"/>

            <div id="usgsccsabox">

                <div id="usgsccsa">
                    <a href="http://www.usgs.gov/">USGS Home</a>
                    <br /><a href="http://answers.usgs.gov/cgi-bin/gsanswers?tmplt=2">Contact USGS</a>
                    <br /><a href="http://search.usgs.gov/">Search USGS</a>
                    <br />
                </div><!--usgsccsa-->

            </div><!--usgsccsabox-->

        </div><!--usgsheader-->
        </div><!--colorband-->

    <!-- END USGS Header Template -->

    <!-- Start App Title Area -->

            <nav>
            <h4>SPARROW Surface Water-Quality Modeling&nbsp;</h4>
            <span class="fa fa-lg fa-question" aria-hidden="true"></span>
            <div id="titleButtons">
                <button>Save Session</button>
                <button>Help</button>
            </div>
        </nav>

    <!-- END App Title Area -->

    <!-- Start Content Area -->
        <div id="map-ui-container">
			
			<!--======Map======-->
            <div id="map-container"></div>

            <!--======Model Selection======-->
            <div id="model-selection-container">
                    <p>Explore a Model</p>
                <a href="#" id="reset-map">Reset Map</a>
                <div id="selection-clear">
                    <label for="constituent">1</label>
                    <select id="constituent">
                        <option value="" disabled selected>Select a Constituent</option>
                        <option value="Nitrogen">Nitrogen</option>
                        <option value="Phosphorus">Phosphorus</option>
                    </select>
                    <label for="national-model">2</label>
                    <select id="national-model">
                        <option value="" disabled selected>Select a National Model</option>
                        <option value="">Example</option>
                        <option value="">Example</option>
                    </select>
                    <label  id="or" for="regional-model">or</label>
                    <select id="regional-model">
                        <option value="" disabled selected>Select a Regional Model</option>
                        <option value="">Example</option>
                        <option value="">Example</option>
                    </select>
                    <button id="explore-model">Explore</button>
                </div>
            </div>

            <!--======Region Search======-->
            <div id="region-search-container">
                    <p>Find Area of Interest</p>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Enter HUC, Zipcode, State, Ect...">
                </div>
            </div>


            <!--======Map Filter Sidebar======-->
            <div id="map-sidebar-container">
                    <div id="filter-container">
                    <p>Choose Area of Interest&nbsp;</p>
                    <span class="fa fa-question" aria-hidden="true"></span>
                    <select id="state">
                            <option value="state">State</option>
                        <option value="Alabama">Alabama</option>
                        <option value="Alaska">Alaska</option>
                        <option value="Arizona">Arizona</option>
                    </select>
                    <select id="receiving-water-body">
                            <option value="receiving water body">Receiving Water Body</option>
                        <option value="Water Body 1">Water Body 1</option>
                        <option value="Water Body 2">Water Body 2</option>
                        <option value="Water Body 3">Water Body 3</option>
                    </select>
                    <select id="watershed">
                            <option value="watershed">Watershed</option>
                        <option value="">Example</option>
                        <option value="">Example</option>
                        <option value="">Example</option>
                    </select>
                    <p>Choose a Data Series&nbsp;</p>
                    <span class="fa fa-question" aria-hidden="true"></span>
                    <select id="data-series">
                            <option value="total yield">Incremental Yield</option>
                        <option value="Incremental Load">Incremental Load</option>
                        <option value="Flow-weighted Concentration">Flow-weighted Concentration</option>
                        <option value="Incremental Yield">Total Yield</option>
                    </select>
                    <p>Group Results by:</p>
                    <select id="group-result-by">
                        <option value="">Catchment</option>
                        <option value="">HUC 8</option>
                        <option value="">Tributary Outlet</option>
                        <option value="">Main River Basin</option>
                        <option value="">State</option>
                    </select>
                    <p class="advanced-toggle">Advanced Options</p>
                    <span class="glyphicon glyphicon-question-sign advanced-toggle" aria-hidden="true"></span>
                    <button class="advanced-options-item advanced-toggle" id="change-inputs">Change Inputs</button>
                    <button class="advanced-options-item advanced-toggle" id="downstream-tracking">Downstream Tracking</button>
                    <button id="advanced-options">Advanced Options</button>
                </div>
                <div id="download-container">
                    <p>View/Download Data</p>
                    <img src="img/view-icon.png" alt="view data icon" title="View Graph Data"/>
                    <img src="img/download_model-icon.png" alt="Download model icon" title="Download Model Data"/>
                    <img src="img/download-spatial-icon.png" alt="Download spatial icon" title="Download Spatial Data"/>
                    <img src="img/download-calibration-icon.png" alt="Download calibration icon" title="Download Calibration Data"/>
                </div>
            </div>
            
            <div id="legend">
                    <h4>Legend</h4>
            </div>
        </div><!--map-ui-container-->



    <!-- END Content Area -->


    <!-- BEGIN USGS Footer Template -->

            <div id="usgsfooter">

                    <p id="usgsfooterbar">
                    <a href="http://www.usgs.gov/laws/accessibility.html" title="Accessibility Policy (Section 508)" target="_blank">Accessibility</a>
                    <a href="http://www.usgs.gov/foia/" title="Freedom of Information Act" target="_blank">FOIA</a>
                    <a href="http://www.usgs.gov/laws/privacy.html" title="Privacy policies of the U.S. Geological Survey." target="_blank">Privacy</a>
                    <a href="http://www.usgs.gov/laws/policies_notices.html" title="Policies and notices that govern information posted on USGS Web sites." target="_blank">Policies and Notices</a>

                            </p><!--usgsfooterbar-->


                    <p id="usgsfootertext">

                    <a href="http://www.usa.gov/" alt="USA.gov logo" title="USAGov: Government Made Easy" width="90" height="26" target="_blank"><img id="usa" src="img/usa_gov.png" alt="usa_gov pic"/></a>

                    <a href="http://www.doi.gov/" target="_blank">U.S. Department of the Interior</a> |

                            <a href="http://www.usgs.gov/" target="_blank">U.S. Geological Survey</a> |

                            <a href="http://www.doioig.gov/" target="_blank">DOI Inspector General</a>

                    <p style="margin: 5px 0 5px 0; padding-left: 5px;">URL: http//cida.usgs.gov/ca_drought</p>

                <p style="margin: 5px 0 5px 0; padding-left: 5px;">Contact Information: <a href="mailto:cida_webmaster@usgs.gov?Subject=Hello%20again" target="_top">cida.usgs.gov/sparrow</a></p>

                    <p style="margin: 5px 0 5px 0; padding-left: 5px;">Page last modified: <script>document.write(document.lastModified);</script></p>

            </p><!--usgsfootertext-->

    </div><!--usgsfooter-->

    <!-- END USGS Footer Template -->​

        </div><!--container-fluid-->
		
		<jsp:include page="js/log4javascript/log4javascript.jsp">
			<jsp:param name="relPath" value="" />
			<jsp:param name="debug-qualifier" value="<%= development%>" />
		</jsp:include>

		<script type="text/javascript" src="<%= baseUrl%>/webjars/handlebars/<%=vHandlebars%>/handlebars<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="<%=baseUrl%>/webjars/jquery/<%=vJquery%>/jquery<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="<%=baseUrl%>/webjars/bootstrap/<%=vBootstrap%>/js/bootstrap<%= development ? "" : ".min"%>.js"></script>
		<script type="text/javascript" src="<%=baseUrl%>/webjars/openlayers/<%=vOpenlayers%>/ol<%= development ? "-debug" : ""%>.js"></script>
        <script type="text/javascript" src="<%=baseUrl%>/webjars/underscorejs/<%=vUnderscore%>/underscore<%= development ? "" : "-min"%>.js"></script>
        <script type="text/javascript" src="<%=baseUrl%>/webjars/backbonejs/<%=vBackbone%>/backbone<%= development ? "" : ".min"%>.js"></script>

		
		<script type="text/javascript" src="<%=baseUrl%>/js/vendor/ol3-layerswitcher/1.0.1/ol3-layerswitcher<%= resourceSuffix %>.js"></script>
		
		<script type="text/javascript" src="<%=baseUrl%>/js/utils/mapUtils<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%=baseUrl%>/js/init<%= resourceSuffix %>.js"></script>	
		<script type="text/javascript" src="<%=baseUrl%>/js/views/MapView<%= resourceSuffix %>.js"></script>
		<script type="text/javascript" src="<%=baseUrl%>/js/controller/AppRouter<%= resourceSuffix %>.js"></script>

        <script>
                    $(document).ready(function(){
                        var advanced = $('#advanced-options');
                        $(advanced).click(function(){
                           if(advanced.html() === 'Advanced Options'){
                               advanced.html('Close Advanced Options');
                           }else if(advanced.html() === 'Closed Advanced Options'){
                                 advanced.html('Advanced Options');
                                }else{
                                    advanced.html('Advanced Options');
                                }
                           $('.advanced-toggle').toggle(); 
                        });
                    });
                </script>
	</body>
</html>
package gov.usgs.cida.sparrow.ui.rest.data;

import gov.usgs.cida.sparrow.ui.model.ContextIdResponse;
import gov.usgs.cida.sparrow.ui.model.MapLayerResponse;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.WebApplicationException;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

/**
 *
 * @author dmsibley
 */
public class PredictionResourceTest {
	
	public PredictionResourceTest() {
	}
	
	@BeforeClass
	public static void setUpClass() {
	}
	
	@AfterClass
	public static void tearDownClass() {
	}
	
	@Before
	public void setUp() {
	}
	
	@After
	public void tearDown() {
	}

	/**
	 * Test of parseContextId method, of class PredictionResource.
	 * @throws javax.xml.parsers.ParserConfigurationException
	 * @throws org.xml.sax.SAXException
	 * @throws java.io.IOException
	 */
	@Test
	public void testParseContextId() throws ParserConfigurationException, SAXException, IOException {
		boolean exceptionThrown = false;
		File successResponse = new File("src/test/resources/dssResponses/getContextIdSuccess.xml");
		Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(successResponse);
		String expected = "-1717643560";
		String actual = "";
		try {
			actual = ContextIdResponse.build(doc).getContextId();
		} catch (WebApplicationException ex) {
			exceptionThrown = true;
		}
		assertFalse(exceptionThrown);
		assertEquals(expected, actual);
		
		exceptionThrown = false;
		File failResponse = new File("src/test/resources/dssResponses/getContextIdFail.xml");
		doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(failResponse);
		actual = "";
		expected = "";
		try {
			actual = ContextIdResponse.build(doc).getContextId();
		} catch (WebApplicationException ex) {
			exceptionThrown = true;
		}
		
		assertTrue(exceptionThrown);
		assertEquals(expected, actual);
	}

	/**
	 * Test of parseMapLayerInfo method, of class PredictionResource.
	 * @throws javax.xml.parsers.ParserConfigurationException
	 * @throws org.xml.sax.SAXException
	 * @throws java.io.IOException
	 */
	@Test
	public void testParseMapLayerInfo() throws ParserConfigurationException, SAXException, IOException {
		boolean exceptionThrown = false;
		File successResponse = new File("src/test/resources/dssResponses/RegisterMapLayerServiceSuccess.xml");
		Document doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(successResponse);
		List<Map<String, String>> expected = new ArrayList<>();
		Map<String, String> entry = new HashMap<String, String>();
		entry.put("CatchLayerName", "sparrow-catchment-reusable:54N1717643560");
		entry.put("FlowLayerDefaultStyleName", "54N1717643560-flowline-default");
		entry.put("FlowLayerName", "sparrow-flowline-reusable:54N1717643560");
		entry.put("CatchLayerDefaultStyleName", "54N1717643560-catchment-default");
		entry.put("EndpointUrl", "http://cida-eros-sparrowdev.er.usgs.gov:8081/sparrowgeoserver/wms");
		expected.add(entry);
		List<Map<String, String>> actual = new ArrayList<>();
		try {
			actual = MapLayerResponse.build(doc).getMapLayer();
		} catch (WebApplicationException ex) {
			exceptionThrown = true;
		}
		assertFalse(exceptionThrown);
		assertEquals(expected, actual);
		
		exceptionThrown = false;
		File failResponse = new File("src/test/resources/dssResponses/RegisterMapLayerServiceFail.xml");
		doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(failResponse);
		actual = new ArrayList<>();
		expected = new ArrayList<>();
		try {
			actual = MapLayerResponse.build(doc).getMapLayer();
		} catch (WebApplicationException ex) {
			exceptionThrown = true;
		}
		assertTrue(exceptionThrown);
		assertEquals(expected, actual);
	}
	
}

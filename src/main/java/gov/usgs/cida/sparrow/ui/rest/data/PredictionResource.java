package gov.usgs.cida.sparrow.ui.rest.data;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import gov.usgs.cida.config.DynamicReadOnlyProperties;
import gov.usgs.cida.sparrow.ui.utilities.JNDISingleton;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author dmsibley
 */
@Path("/prediction")
public class PredictionResource {
	
	private static final Logger LOG = LoggerFactory.getLogger(PredictionResource.class);
	private final static String SPARROW_URL = "http://cida.usgs.gov/sparrow";
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getPredictions(
			@QueryParam("model-id") String modelIdIn, 
			@QueryParam("data-series") String dataSeriesIn
	) {
		LOG.debug("Request to: /data/prediction");
		Gson gson = new Gson();
		List<Map<String,String>> predictions = new ArrayList<>();
		
		String modelId = verifyModelId(modelIdIn, "54");
		String dataSeries = verifyDataSeries(dataSeriesIn, "total_yield");
		
		String predictionContext = "<PredictionContext "
				+ "xmlns=\"http://www.usgs.gov/sparrow/prediction-schema/v0_2\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" model-id=\"" + modelId + "\">"
				+ "<adjustmentGroups conflicts=\"accumulate\">"
				+ "<individualGroup enabled=\"true\"></individualGroup>"
				+ "</adjustmentGroups>"
				+ "<analysis>"
				+ "<dataSeries source=\"\">" + dataSeries + "</dataSeries>"
				+ "</analysis>"
				+ "<terminalReaches>"
				+ "</terminalReaches>"
				+ "<nominalComparison type=\"none\"></nominalComparison>"
				+ "</PredictionContext>";
		
		Client client = ClientBuilder.newClient();
		DynamicReadOnlyProperties jndiProps = JNDISingleton.getInstance();
		String sparrowUrl = jndiProps.get("sparrow-dss-url");
		if (Strings.isNullOrEmpty(sparrowUrl)) {
			sparrowUrl = SPARROW_URL;
		}
		String contextId = getContextId(client, sparrowUrl, predictionContext);
		LOG.debug(contextId);
		
		List<Map<String, String>> mapLayer = getMapLayerInfo(client, sparrowUrl, contextId);
		LOG.debug(mapLayer.toString());
		
		predictions.addAll(mapLayer);
		
		String output = gson.toJson(predictions);
		return Response.ok(output).build();
	}
	
	private static String verifyModelId(String in, String defaultValue) {
		String result = defaultValue;
		if (!Strings.isNullOrEmpty(in)) {
			result = in.trim();
		}
		return result;
	}
	
	private static String verifyDataSeries(String in, String defaultValue) {
		String result = defaultValue;
		if (!Strings.isNullOrEmpty(in)) {
			result = in.trim();
		}
		return result;
	}
	
	private static String getContextId(Client client, String url, String predictionContext) {
		String result = "";
		if (!Strings.isNullOrEmpty(url) && !Strings.isNullOrEmpty(predictionContext)) {
			WebTarget webTarget = client.target(url).path("getContextId");
			Document doc = webTarget
					.request(MediaType.APPLICATION_XML_TYPE)
					.post(Entity.entity(predictionContext, MediaType.TEXT_XML_TYPE), Document.class);
			NodeList nodes = doc.getElementsByTagName("PredictionContext-response");
			if (0 < nodes.getLength()) {
				Node node = nodes.item(0);
				Node attr = node.getAttributes().getNamedItem("context-id");
				if (null != attr) {
					result = attr.getTextContent();
				}
			}
		}
		return result;
	}
	
	private static List<Map<String, String>> getMapLayerInfo(Client client, String url, String contextId) {
		List<Map<String,String>> result = new ArrayList<>();
		if (!Strings.isNullOrEmpty(url) && !Strings.isNullOrEmpty(contextId)) {
			WebTarget webTarget = client.target(url).path("RegisterMapLayerService")
					.queryParam("context-id", contextId)
					.queryParam("projected-srs", "EPSG:4326");
			Document doc = webTarget
					.request(MediaType.APPLICATION_XML_TYPE)
					.get(Document.class);
			NodeList nodes = doc.getElementsByTagName("SparrowDataLayerResponse");
			for (int i = 0; i < nodes.getLength(); i++) {
				Map<String, String> dataLayer = new HashMap<>();
				Node node = nodes.item(i);
				NodeList props = node.getChildNodes();
				for (int j = 0; j < props.getLength(); j++) {
					Node prop = props.item(j);
					dataLayer.put(prop.getNodeName(), prop.getTextContent());
				}
				result.add(dataLayer);
			}
		}
		return result;
	}
}

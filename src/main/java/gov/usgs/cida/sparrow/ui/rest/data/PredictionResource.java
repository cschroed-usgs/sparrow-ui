package gov.usgs.cida.sparrow.ui.rest.data;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import com.google.common.base.Strings;
import com.google.gson.Gson;
import gov.usgs.cida.config.DynamicReadOnlyProperties;
import gov.usgs.cida.sparrow.ui.model.ContextIdResponse;
import gov.usgs.cida.sparrow.ui.model.MapLayerResponse;
import gov.usgs.cida.sparrow.ui.model.PredictionRequestOptions;
import gov.usgs.cida.sparrow.ui.utilities.JNDISingleton;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;

/**
 *
 * @author dmsibley
 */
@Path("/prediction")
public class PredictionResource {

	private static final Logger LOG = LoggerFactory.getLogger(PredictionResource.class);
	private static final String SPARROW_URL = "http://cida.usgs.gov/sparrow";
	private final Mustache mustache;

	public PredictionResource() {
		MustacheFactory mf = new DefaultMustacheFactory();
		this.mustache = mf.compile("PredictionContextRequest.mustache");
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getPredictions(
			@QueryParam(value = "model-id") @DefaultValue("") String modelId,
			@QueryParam("data-series") @DefaultValue("total_yield") String dataSeries
	) {
		LOG.debug("Request to: /data/prediction");
		Gson gson = new Gson();

		PredictionRequestOptions params = PredictionRequestOptions.builder()
				.setModelId(modelId)
				.setDataSeries(dataSeries)
				.build();

		StringWriter sw = new StringWriter();
		mustache.execute(sw, params);
		String predictionContext = sw.toString();

		Client client = ClientBuilder.newClient();
		DynamicReadOnlyProperties jndiProps = JNDISingleton.getInstance();
		String sparrowUrl = jndiProps.getProperty("sparrow-dss-url", SPARROW_URL);
		String contextId = getContextId(client, sparrowUrl, predictionContext);
		LOG.debug(contextId);

		List<Map<String, String>> mapLayer = getMapLayerInfo(client, sparrowUrl, contextId);
		LOG.debug(mapLayer.toString());

		String output = gson.toJson(mapLayer);
		return Response.ok(output).build();
	}

	protected static String getContextId(Client client, String url, String predictionContext) {
		String result = "";
		if (!Strings.isNullOrEmpty(url) && !Strings.isNullOrEmpty(predictionContext)) {
			try {
				WebTarget webTarget = client.target(url).path("getContextId");
				Document doc = webTarget
						.request(MediaType.APPLICATION_XML_TYPE)
						.post(Entity.entity(predictionContext, MediaType.TEXT_XML_TYPE), Document.class);
				result = ContextIdResponse.build(doc).getContextId();
			} catch (WebApplicationException ex) {
				throw new IllegalArgumentException("Could not retrieve context ID", ex);
			}
		}
		return result;
	}

	protected static List<Map<String, String>> getMapLayerInfo(Client client, String url, String contextId) {
		List<Map<String, String>> result = new ArrayList<>();
		if (!Strings.isNullOrEmpty(url) && !Strings.isNullOrEmpty(contextId)) {
			try {
				WebTarget webTarget = client.target(url).path("RegisterMapLayerService")
						.queryParam("context-id", contextId)
						.queryParam("projected-srs", "EPSG:4326");
				Document doc = webTarget
						.request(MediaType.APPLICATION_XML_TYPE)
						.get(Document.class);
				result = MapLayerResponse.build(doc).getMapLayer();
			} catch (WebApplicationException ex) {
				throw new IllegalArgumentException("Could not retrieve map layer", ex);
			}
		}
		return result;
	}
}

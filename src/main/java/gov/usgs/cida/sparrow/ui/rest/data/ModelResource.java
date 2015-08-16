package gov.usgs.cida.sparrow.ui.rest.data;

import gov.usgs.cida.config.DynamicReadOnlyProperties;
import gov.usgs.cida.sparrow.ui.utilities.JNDISingleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


/**
 * Query on the model resource
 *
 * @author isuftin
 */
@Path("/model")
public class ModelResource {

	private final static String SB_URL = "https://www.sciencebase.gov/catalog/items";
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getModels() {
		Client client = ClientBuilder.newClient();
		DynamicReadOnlyProperties jndiProps = JNDISingleton.getInstance();
		WebTarget webTarget = client.target(SB_URL)
				.queryParam("parentId", jndiProps.get("sciencebase-sparrow-locator"))
				.queryParam("max", "1000")
				.queryParam("format", "json")
				.queryParam("fields", "tags");
		Invocation.Builder request = webTarget.request(MediaType.APPLICATION_JSON);
		return request.get();
	}
}

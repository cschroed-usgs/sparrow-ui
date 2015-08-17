package gov.usgs.cida.sparrow.ui.rest.data;

import gov.usgs.cida.config.DynamicReadOnlyProperties;
import gov.usgs.cida.sparrow.ui.utilities.CacheManagerUtil;
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
import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Query ScienceBase to pull back the model resource.
 *
 * Will cache valid responses and used the cached version if available.
 *
 * @author isuftin
 */
@Path("/model")
public class ModelResource {

	private static final Logger LOG = LoggerFactory.getLogger(ModelResource.class);
	private final static String SB_URL = "https://www.sciencebase.gov/catalog/items";
	private final static String CACHE_NAME = "model";

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getModels() {
		LOG.debug("Request to: /data/model");
		String keyName = "all_sb_models";
		CacheManager cm = CacheManagerUtil.getManager();
		Response response;
		
		if (!cm.cacheExists(CACHE_NAME)) {
			LOG.debug("{} cache does not yet exist. Creating.", CACHE_NAME);
			cm.addCache(CACHE_NAME);
		}
		Cache modelCache = cm.getCache(CACHE_NAME);

		if (!modelCache.isKeyInCache(keyName)) {
			LOG.debug("{} not found in cache {}", keyName, CACHE_NAME);
			// The sciencebase model response is not yet in the cache. 
			// Go grab the response from ScienceBase and if everything comes 
			// ok, cache that response
			Client client = ClientBuilder.newClient();
			DynamicReadOnlyProperties jndiProps = JNDISingleton.getInstance();
			WebTarget webTarget = client.target(SB_URL)
					.queryParam("parentId", jndiProps.get("sciencebase-sparrow-locator"))
					.queryParam("max", "1000")
					.queryParam("format", "json")
					.queryParam("fields", "tags");
			Invocation.Builder request = webTarget.request(MediaType.APPLICATION_JSON);
			response = request.get();

			// Check if response is OK. If so, cache the String response. Otherwise,
			// I will send the original response (which should be an error) back
			// to the client.
			if (response.getStatus() == 200) {
				String model = response.readEntity(String.class);
				modelCache.put(new Element(keyName, model));
				LOG.debug("New entry stored into cache {}, key {}", CACHE_NAME, keyName);
				// We already pulled the string out of the client response so
				// re-assign the response to a new Response object
				response = Response.ok(model, MediaType.APPLICATION_JSON).build();
			}

		} else {
			LOG.debug("{} found in cache {}", keyName, CACHE_NAME);
			// There is already a cached response from sciencebase, so use that
			String model = (String) modelCache.get(keyName).getObjectValue();
			response = Response.ok(model, MediaType.APPLICATION_JSON).build();
		}

		return response;
	}
}

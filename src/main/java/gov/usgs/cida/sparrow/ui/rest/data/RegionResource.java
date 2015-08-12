package gov.usgs.cida.sparrow.ui.rest.data;

import com.google.gson.Gson;
import gov.usgs.cida.sparrow.ui.model.ModelUtil;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 *
 * @author isuftin
 */
@Path("/region")
public class RegionResource {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRegions() {
		Gson gson = new Gson();

		List<String> regions = ModelUtil.getModels()
				.stream()
				.map((m) -> m.getRegion())
				.distinct()
				.sorted()
				.collect(Collectors.toList());

		Map<String, List<String>> regionMap = new HashMap<>();
		regionMap.put("regions", regions);
		String output = gson.toJson(gson.toJson(regionMap));
		return Response.ok(output).build();
	}
}

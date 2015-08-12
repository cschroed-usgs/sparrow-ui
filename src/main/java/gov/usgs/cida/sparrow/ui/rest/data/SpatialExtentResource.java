package gov.usgs.cida.sparrow.ui.rest.data;

import com.google.gson.Gson;
import gov.usgs.cida.sparrow.ui.rest.model.ModelUtil;
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
@Path("/spatialextent")
public class SpatialExtentResource {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSpatialExtents() {
		Gson gson = new Gson();

		List<String> extents = ModelUtil.getModels()
				.stream()
				.map((m) -> m.getSpatialExtent())
				.distinct()
				.sorted()
				.collect(Collectors.toList());

		Map<String, List<String>> extentsMap = new HashMap<>();
		extentsMap.put("spatialextents", extents);
		String output = gson.toJson(gson.toJson(extentsMap));
		return Response.ok(output).build();
	}
}

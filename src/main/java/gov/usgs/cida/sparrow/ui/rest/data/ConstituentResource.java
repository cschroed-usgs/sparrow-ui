package gov.usgs.cida.sparrow.ui.rest.data;

import com.google.gson.Gson;
import gov.usgs.cida.sparrow.ui.model.Model;
import gov.usgs.cida.sparrow.ui.model.ModelUtil;
import java.util.ArrayList;
import java.util.Collection;
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
@Path("/constituent")
public class ConstituentResource {
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getConstituents() {
		Gson gson = new Gson();
		
		List<String> constituents = ModelUtil.getModels()
				.stream()
				.map((m) -> m.getConstituent())
				.distinct()
				.sorted()
				.collect(Collectors.toList());
		
		Map<String, List<String>> constituentsMap = new HashMap<>();
		constituentsMap.put("constituents", constituents);
		String output = gson.toJson(gson.toJson(constituentsMap));
		return Response.ok(output).build();
	}
}

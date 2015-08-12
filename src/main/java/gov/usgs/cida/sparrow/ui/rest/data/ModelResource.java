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
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Query on the model resource
 *
 * @author isuftin
 */
@Path("/model")
public class ModelResource {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getModels() {
		Gson gson = new Gson();
		List<Model> models = ModelUtil.getModels();

		// Sort models by ID
		models.sort((p1, p2) -> Integer.compare(p1.getId(), p2.getId()));
		Collection<Map<Integer, String>> modelsMaps = new ArrayList<>();

		models.stream().map((m) -> {
			Map<Integer, String> modelMap = new HashMap<>();
			modelMap.put(m.getId(), gson.toJson(m));
			return modelMap;
		}).forEach((modelMap) -> {
			modelsMaps.add(modelMap);
		});

		String output = gson.toJson(modelsMaps);
		return Response.ok(output).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/id/{id}")
	public Response getModelById(@PathParam("id") int id) {
		Gson gson = new Gson();
		Response response = null;

		// Find a model that matches the id
		Model model = ModelUtil.getModels().stream().filter(m -> {
			return m.getId() == id;
		}).findFirst().get();

		if (model == null) {
			response = Response.status(Response.Status.NOT_FOUND).build();
		} else {
			String output = gson.toJson(model);
			response = Response.ok(output).build();
		}

		return response;
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/name/{name}")
	public Response getModelByName(@PathParam("name") String name) {
		Gson gson = new Gson();
		Response response = null;

		// Find a model that matches the id
		Model model = ModelUtil.getModels().stream().filter(m -> {
			return m.getName().equals(name);
		}).findFirst().get();

		if (model == null) {
			response = Response.status(Response.Status.NOT_FOUND).build();
		} else {
			String output = gson.toJson(model);
			response = Response.ok(output).build();
		}

		return response;
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/constituent/{ct}")
	public Response getModelByConstituent(@PathParam("ct") String consituent) {
		Gson gson = new Gson();
		Response response = null;

		// Find a model that matches the id
		List<Model> model = ModelUtil.getModels().stream().filter(m -> {
			return m.getConstituent().equals(consituent);
		}).collect(Collectors.toList());

		if (model == null) {
			response = Response.status(Response.Status.NOT_FOUND).build();
		} else {
			String output = gson.toJson(model);
			response = Response.ok(output).build();
		}

		return response;
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/region/{region}")
	public Response getModelByRegion(@PathParam("region") String region) {
		Gson gson = new Gson();
		Response response = null;

		// Find a model that matches the id
		List<Model> model = ModelUtil.getModels().stream().filter(m -> {
			return m.getRegion().equals(region);
		}).collect(Collectors.toList());

		if (model == null) {
			response = Response.status(Response.Status.NOT_FOUND).build();
		} else {
			String output = gson.toJson(model);
			response = Response.ok(output).build();
		}

		return response;
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/spatialextent/{se}")
	public Response getModelsBySpatialExtent(@PathParam("se") String se) {
		Gson gson = new Gson();
		Response response = null;

		// Find a model that matches the id
		List<Model> model = ModelUtil.getModels().stream().filter(m -> {
			return m.getSpatialExtent().equals(se);
		}).collect(Collectors.toList());

		if (model == null) {
			response = Response.status(Response.Status.NOT_FOUND).build();
		} else {
			String output = gson.toJson(model);
			response = Response.ok(output).build();
		}

		return response;
	}
}

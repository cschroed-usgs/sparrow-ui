package gov.usgs.cida.sparrow.ui.rest.data;

import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author dmsibley
 */
@Provider
public class InvalidArgsMapper implements ExceptionMapper<IllegalArgumentException> {
	private static final Logger log = LoggerFactory.getLogger(InvalidArgsMapper.class);

	@Override
	public Response toResponse(IllegalArgumentException exception) {
		Gson gson = new Gson();
		Map<String, String> result = new HashMap<>();
		
		result.put("status", "error");
		result.put("message", exception.getMessage());
		
		return Response.status(400)
				.type(MediaType.APPLICATION_JSON_TYPE)
				.entity(gson.toJson(result))
				.build();
	}

}

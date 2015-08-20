package gov.usgs.cida.sparrow.ui.rest.data;

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
public class WhatTheHellMapper implements ExceptionMapper<Exception>{
	private static final Logger log = LoggerFactory.getLogger(WhatTheHellMapper.class);

	@Override
	public Response toResponse(Exception exception) {
		log.error("Exception Encountered", exception);
		return Response.serverError().build();
	}

}

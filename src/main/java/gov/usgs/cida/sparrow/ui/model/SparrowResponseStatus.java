package gov.usgs.cida.sparrow.ui.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author dmsibley
 */
public class SparrowResponseStatus {

	private static final Logger log = LoggerFactory.getLogger(SparrowResponseStatus.class);
	protected final Boolean okStatus;
	protected final String message;

	public SparrowResponseStatus(Boolean okStatus, String message) {
		this.okStatus = okStatus;
		this.message = message;
	}

	public Boolean getOkStatus() {
		return okStatus;
	}

	public String getMessage() {
		return message;
	}
}

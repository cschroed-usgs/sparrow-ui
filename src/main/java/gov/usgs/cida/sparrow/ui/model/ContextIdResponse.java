/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package gov.usgs.cida.sparrow.ui.model;

import javax.ws.rs.WebApplicationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author dmsibley
 */
public class ContextIdResponse {
	private static final Logger log = LoggerFactory.getLogger(ContextIdResponse.class);
	
	protected final SparrowResponseStatus status;
	protected final String contextId;
	
	protected ContextIdResponse(SparrowResponseStatus status, String contextId) {
		this.status = status;
		this.contextId = contextId;
	}

	public SparrowResponseStatus getStatus() {
		return status;
	}

	public String getContextId() {
		return contextId;
	}
	
	public static ContextIdResponse build(Document doc) {
		ContextIdResponse result = null;
		SparrowResponseStatus okStatus = verify(doc);
		String contextId = "";
		if (okStatus.getOkStatus()) {
			NodeList nodes = doc.getElementsByTagName("PredictionContext-response");
			if (0 < nodes.getLength()) {
				Node node = nodes.item(0);
				Node attr = node.getAttributes().getNamedItem("context-id");
				if (null != attr) {
					contextId = attr.getTextContent();
				}
			}
		} else {
			throw new WebApplicationException(okStatus.getMessage(), 400);
		}
		result = new ContextIdResponse(okStatus, contextId);
		return result;
	}
	
	protected static SparrowResponseStatus verify(Document doc) {
		SparrowResponseStatus result;
		boolean okStatus = false;
		String statusMessage = "";
		NodeList statusNodes = doc.getElementsByTagName("status");
		if (0 < statusNodes.getLength()) {
			Node statusNode = statusNodes.item(0);
			String status = statusNode.getTextContent();
			okStatus = "OK".equals(status);
			if (!okStatus) {
				NodeList messageNodes = doc.getElementsByTagName("message");
				if (0 < messageNodes.getLength()) {
					statusMessage = messageNodes.item(0).getTextContent();
				}
			}
		}
		result = new SparrowResponseStatus(okStatus, statusMessage);
		return result;
	}
}

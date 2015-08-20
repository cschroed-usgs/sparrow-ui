/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package gov.usgs.cida.sparrow.ui.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
public class MapLayerResponse {
	private static final Logger log = LoggerFactory.getLogger(MapLayerResponse.class);
	
	protected final SparrowResponseStatus status;
	protected final List<Map<String, String>> mapLayer;

	protected MapLayerResponse(SparrowResponseStatus status, List<Map<String, String>> mapLayer) {
		this.status = status;
		this.mapLayer = mapLayer;
	}

	public SparrowResponseStatus getStatus() {
		return status;
	}

	public List<Map<String, String>> getMapLayer() {
		return mapLayer;
	}
	
	public static MapLayerResponse build(Document doc) {
		MapLayerResponse result = null;
		SparrowResponseStatus okStatus = verify(doc);
		List<Map<String, String>> mapLayer = new ArrayList<>();
		if (okStatus.getOkStatus()) {
			NodeList nodes = doc.getElementsByTagName("SparrowDataLayerResponse");
			for (int i = 0; i < nodes.getLength(); i++) {
				Map<String, String> dataLayer = new HashMap<>();
				Node node = nodes.item(i);
				NodeList props = node.getChildNodes();
				for (int j = 0; j < props.getLength(); j++) {
					Node prop = props.item(j);
					if (Node.TEXT_NODE != prop.getNodeType()) {
						dataLayer.put(prop.getNodeName(), prop.getTextContent());
					}
				}
				mapLayer.add(dataLayer);
			}
		} else {
			throw new WebApplicationException(okStatus.getMessage(), 400);
		}
		result = new MapLayerResponse(okStatus, mapLayer);
		return result;
	}

	protected static SparrowResponseStatus verify(Document doc) {
		SparrowResponseStatus result;
		boolean okStatus = false;
		String statusMessage = "";
		NodeList statusNodes = doc.getElementsByTagName("Status");
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

package gov.usgs.cida.sparrow.ui.rest.model;

/**
 * Represents a Sparrow model
 * @author isuftin
 */
public class Model {
	
	private int id;
	private String name;
	private String constituent;
	private String region;
	private String spatialExtent;
	
	public Model(){};
	public Model(int id, String name, String constituent, String region, String spatialExtent) {
		this.id = id;
		this.name = name;
		this.constituent = constituent;
		this.region = region;
		this.spatialExtent = spatialExtent;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getConstituent() {
		return constituent;
	}

	public void setConstituent(String constituent) {
		this.constituent = constituent;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getSpatialExtent() {
		return spatialExtent;
	}

	public void setSpatialExtent(String spatialExtent) {
		this.spatialExtent = spatialExtent;
	}
	
	
	
}

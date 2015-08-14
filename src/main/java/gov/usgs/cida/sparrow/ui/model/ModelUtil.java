package gov.usgs.cida.sparrow.ui.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Utility functions for Model data
 * @author isuftin
 */
public class ModelUtil {
	private final static List<Model> models;
	
	static {
		models = new ArrayList<>();
		models.add(new Model(22, "1992 Total Nitrogen Model for the Conterminous U.S.", "TN", "Conterminous US", "Conterminous US"));
		models.add(new Model(23, "1992 Total Phosphorus Model for the Conterminous U.S.", "TP", "Conterminous US", "Conterminous US"));
		models.add(new Model(24, "Total Organic Carbon Model for the Conterminous U.S.", "TOC", "Conterminous US", "Conterminous US"));
		models.add(new Model(25, "2000 National SPARROW model of dissolved-solids transport", "TDS", "Conterminous US", "Conterminous US"));
		models.add(new Model(30, "1992 SPARROW model of suspended sediment (covers the period 1975-2007)", "Susp. Sediment", "Conterminous US", "Conterminous US"));
		
		models.add(new Model(37, "2002 Mississippi/Atchafalaya Basin Total Nitrogen Model", "TN", "Mississippi", "Super Region"));
		models.add(new Model(38, "2002 Mississippi/Atchafalaya Basin Total Phosphorus Model", "TP", "East Coast", "Super Region"));
		
		models.add(new Model(51, "2002 Total Nitrogen Model for the Northeast and Mid Atlantic Regions (MRB1)", "TN", "Northeast (MRB1)", "Region (MRB)"));
		models.add(new Model(52, "2002 Total Phosphorus Model for the Northeast and Mid Atlantic Regions (MRB1)", "TP", "Southeast (MRB1)", "Region (MRB)"));
		models.add(new Model(50, "2002 Total Nitrogen Model for the Southeastern U.S. (MRB2)", "TN", "Southeast (MRB2)", "Region (MRB)"));
		models.add(new Model(49, "2002 Total Phorphorus Model for the Southeastern U.S. (MRB2)", "TP", "Southeast (MRB2)", "Region (MRB)"));
		models.add(new Model(41, "2002 Upper Midwest Total Nitrogen in Water Model (MRB3)", "TN", "Upper Midwest (MRB3)", "Region (MRB)"));
		models.add(new Model(42, "2002 Upper Midwest Total Phophorus in Water Model (MRB3)", "TP", "Upper Midwest (MRB3)", "Region (MRB)"));
		models.add(new Model(57, "2002 Total Nitrogen SPARROW Model for the MIssouri River Basin (MRB4)", "TN", "Missouri (MRB4)", "Region (MRB)"));
		models.add(new Model(58, "2002 Total Phosphorus SPARROW Model for the Missouri River Basin (MRB4)", "TP", "Missouri (MRB4)", "Region (MRB)"));
		models.add(new Model(35, "2002 Total Nitrogen Model for the Lower Mississippi, Arkansas-White-Red, and Texas Gulf Regions (MRB5)", "TN", "Lower Midwest (MRB5)", "Region (MRB)"));
		models.add(new Model(36, "2002 Total Phosphorus Model for the Lower Mississippi, Arkansas-White-Red, and Texas Gulf Regions (MRB5)", "TP", "Lower Midwest (MRB5)", "Region (MRB)"));
		models.add(new Model(43, "2002 Total Nitrogen Model for the U.S. Pacific Northwest (MRB7)", "TN", "Pacific Northwest (MRB7)", "Region (MRB)"));
		models.add(new Model(44, "2002 Total Phosphorus Model for the U.S. Pacific Northwest (MRB7)", "TP", "Pacific Northwest (MRB7)", "Region (MRB)"));
		models.add(new Model(54, "2002 Total Nitrogen Model for the Chesapeake Bay Watershed reported in SIR 2011-5167", "TN", "Chesapeake Bay", "Sub-Region"));
		models.add(new Model(55, "2002 Total Phosphorus Model for the Chesapeake Bay Watershed reported in SIR 2011-5167", "TP", "Chesapeake Bay", "Sub-Region"));
		models.add(new Model(53, "Total Dissolved Solids Model for the Southwestern U.S.", "TDS", "Southwestern US", "Sub-Region"));
	}

	public static List<Model> getModels() {
		return new ArrayList<>(models);
	}
}

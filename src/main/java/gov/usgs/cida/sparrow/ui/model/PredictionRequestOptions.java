package gov.usgs.cida.sparrow.ui.model;

import com.google.common.base.Strings;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author dmsibley
 */
public class PredictionRequestOptions {
	private static final Logger LOG = LoggerFactory.getLogger(PredictionRequestOptions.class);
	
	protected String modelId;
	protected String dataSeries;

	protected PredictionRequestOptions(String modelId, String dataSeries) {
		this.modelId = modelId;
		this.dataSeries = dataSeries;
	}

	public String getModelId() {
		return modelId;
	}

	public String getDataSeries() {
		return dataSeries;
	}
	
	public static Builder builder() {
		return new Builder();
	}
	
	public static class Builder {
		protected String modelId;
		protected String dataSeries;
		
		public Builder() {
			
		}

		public Builder setModelId(String modelId) {
			this.modelId = Strings.nullToEmpty(modelId).trim();
			return this;
		}

		public Builder setDataSeries(String dataSeries) {
			this.dataSeries = Strings.nullToEmpty(dataSeries).trim();
			return this;
		}
		
		protected List<String> validateBuilder() {
			List<String> result = new ArrayList<String>();
			if (Strings.isNullOrEmpty(modelId)) {
				result.add("model-id");
			}
			if (Strings.isNullOrEmpty(dataSeries)) {
				result.add("data-series");
			}
			return result;
		}
		
		public PredictionRequestOptions build() throws IllegalArgumentException {
			PredictionRequestOptions result = null;
			
			List<String> invalids = validateBuilder();
			if (!invalids.isEmpty()) {
				throw new IllegalArgumentException("These fields cannot be empty: " + invalids.toString());
			}
			result = new PredictionRequestOptions(modelId, dataSeries);
			
			return result;
		}
	}
}

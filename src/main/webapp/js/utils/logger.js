define([
	"log4js"
], function (log4js) {
	return {
		init: function (params) {
			if (!params) {
				params = {};
			}
			var LOG = log4js.getLogger();
			var LOG4JS_PATTERN_LAYOUT = params.LOG4JS_PATTERN_LAYOUT || "%rms - %-5p - %m%n";
			var LOG4JS_LOG_THRESHOLD = params.LOG4JS_LOG_THRESHOLD || "info"; // info will be default
			var appender = new log4js.BrowserConsoleAppender();
			appender.setLayout(new log4js.PatternLayout(LOG4JS_PATTERN_LAYOUT));
			var logLevel;
			switch (LOG4JS_LOG_THRESHOLD) {
				case "trace" :
					logLevel = log4js.Level.TRACE;
					break;
				case "debug" :
					logLevel = log4js.Level.DEBUG;
					break;
				case "info" :
					logLevel = log4js.Level.INFO;
					break;
				case "warn" :
					logLevel = log4js.Level.WARN;
					break;
				case "error" :
					logLevel = log4js.Level.ERROR;
					break;
				case "fatal" :
					logLevel = log4js.Level.FATAL;
					break;
				case "off" :
					logLevel = log4js.Level.OFF;
					break;
				default:
					logLevel = log4js.Level.INFO;
			}
			appender.setThreshold(logLevel);

			LOG.addAppender(appender);
			
			return LOG;
		}
	};
});
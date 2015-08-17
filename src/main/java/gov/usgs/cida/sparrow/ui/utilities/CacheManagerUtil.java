package gov.usgs.cida.sparrow.ui.utilities;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import net.sf.ehcache.CacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author isuftin
 */
@WebListener
public class CacheManagerUtil implements ServletContextListener {

	private static final Logger LOG = LoggerFactory.getLogger(CacheManagerUtil.class);
	static CacheManager cm;

	public static CacheManager getManager() {
		return cm;
	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		LOG.debug("Creating cache manager");
		cm = CacheManager.newInstance(getClass().getResource("/ehcache.xml"));

	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		LOG.debug("Shutting down cache manager");
		cm.shutdown();
	}

}

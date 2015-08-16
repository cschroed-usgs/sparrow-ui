package gov.usgs.cida.sparrow.ui.utilities;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import net.sf.ehcache.CacheManager;

/**
 *
 * @author isuftin
 */
@WebListener
public class CacheManagerUtil implements ServletContextListener {

	static CacheManager cm;

	public static CacheManager getManager() {
		return cm;
	}
	
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		cm = CacheManager.newInstance(getClass().getResource("/ehcache.xml"));
		
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		cm.shutdown();
	}

}

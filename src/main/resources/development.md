Developers Notes
===

###LESS Compilation During Development

####Netbeans 
Part of the build process is compiling LESS to CSS.	

Our CSS is created entirely from using the [LESS](http://lesscss.org/) processor. 
The LESS we write is converted to CSS at build time. However, during development,
we also want to be able to dynamically make changes to our LESS files and see the 
changes in seconds. NetBeans allows us to compile LESS to CSS on save. In order 
to activate this feature, go to your project's properties by right-clicking on 
the project and selecting `Properties`. In the left-hand pane, choose  CSS 
Preprocessors and select the LESS tab. Make sure that the checkbox to enable LESS
compilation is checked and that the `Watch` window has has `/css` as the output 
directory and `/less` as the input directory.

Our LESS also includes the Bootstrap project's LESS in order to extend our capabilities. 
During the Maven packaging of the application, the Bootstrap LESS is extracted from the dependency
JAR into the target directory at `staged-less/bootstrap/`. Our `custom.less` file
tries to import `bootstrap/bootstrap.less`. The compiler will look in the current 
directory to find this file. If it can't find it, the LESS compiler will fail. Because
Bootstrap's LESS file is not found in the same directory, you need to tell NetBeans
an alternate location to search for LESS files for compilation. To do this, go to 
your project's properties by right-clicking on the project and selecting `Properties`.
In the left-hand pane, choose  CSS Preprocessors and select the LESS tab. At the
bottom you should see an input box labeled `Compiler Options`. In there you should enter 
`${web.root}/../../../target/less-webjars/`

This tells the compiler to also look in the target directory to find other LESS files to compile against. 

###Comments in JSP and Handlebars templates
When creating comments in JSPs or Handlebars that render HTML, 
try not to use HTML comment tags `<!-- -->`. These comments are usually for developers
and make their way into the final HTML and end up increasing the size of the transfer
to the browser. 

Instead, in JSP, use JSP comment tags `<%-- --%>` and in Handlebars, use Handlebars 
comment tags `{{!-- --}}` or `{{! }}`.

These comments will not make it into the final product and will not be served to 
the client.
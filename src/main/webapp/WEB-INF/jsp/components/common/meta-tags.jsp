<%@page contentType="text/html" pageEncoding="UTF-8"%>

<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
<meta http-equiv="CONTENT-TYPE" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes" /> 
<meta name="description" content=" " />
<meta name="author" content="Ivan Suftin, Mary Bucknell, David Sibley, Phil Russo" />
<meta name="keywords" content="${param.keywords}" />
<meta name="publisher" content="${param.publisher}" />
<link rel="icon" href="${param['baseUrl']}/favicon.ico" type="image/x-icon" />
<script type="text/javascript">
    /* This application does not support <IE9 - Stop early if <IE9*/
    if (navigator.appName === 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        if (ua.toLowerCase().indexOf('msie 6') !== -1 || ua.toLowerCase().indexOf('msie 7') !== -1 || ua.toLowerCase().indexOf('msie 8') !== -1) {
            alert("We apologize, but this application does not support Internet Explorer versions lower than 9.0.\n\nOther supported browsers are Firefox, Chrome and Safari.");
            window.open('http://windows.microsoft.com/en-us/internet-explorer/downloads/ie-9/worldwide-languages');
        }
    }
</script>
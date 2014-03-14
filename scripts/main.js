
var controller;
ISNLogger.debugMode = false;

ISNLogger.log("enter main js");
$(document).ready(function(){
	ISNLogger.log("document ready");
    if (controllerObject && typeof controllerObject === 'function') {
        controller = new controllerObject();
    }
});
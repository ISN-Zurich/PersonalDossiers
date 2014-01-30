
var controller;
ISNLogger.debugMode = false;

ISNLogger.log("enter main js");
$(document).ready(function(){
	ISNLogger.log("document ready");
    if (controlerObject && typeof controlerObject === 'function') {
        controller = new controlerObject();
    }
});
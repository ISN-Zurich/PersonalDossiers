var controller,imageHandler;
ISNLogger.log("enter main js");
$(document).ready(function(){
	ISNLogger.log("document ready");
	controller = new dossierController();
	imageHandler= new ImageHandler(controller);
});
var controller,imageHandler;
console.log("enter main js");
$(document).ready(function(){
	console.log("document ready");
	controller = new dossierController();
	imageHandler= new ImageHandler(controller);
});
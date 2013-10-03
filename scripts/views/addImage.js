
//it is like a model for the selection of images
function ImageHandler(controller){

    console.log("runs in image handler constructor");
    var self=this;

    self.controller=controller;
    $(document).bind("dataSuccessfullySent", function(){
	window.location.href="index.html";
    });
    $(document).bind("click", imageSelectHandler);

    function imageSelectHandler(e){
	console.log("run into final image select handler");
	var targetE = e.target;
	var targetID = targetE.id;
	console.log("targetID is "+targetID);

	var myID=targetID.substring(4);
	var imgString= $("#imgx"+myID).attr("src");
	console.log("string of image is "+imgString);
	//update the model with the new image, in order it to be sent in the next step to the server
	self.controller.models['bookmark'].setDossierImageURL(imgString);
	//send to the server the new image url and update the database
	self.controller.models['bookmark'].sendDataToServer();

        console.log("clicked on image");
    }
    console.log("image handler ready");
}




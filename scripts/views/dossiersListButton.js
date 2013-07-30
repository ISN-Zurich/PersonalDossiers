/*jslint vars: true, sloppy: true */

function DossiersButtonView(controller){
	var self=this;
	self.controller = controller;
	self.tagID="findinformation";
	this.open();

    $(document).bind('DossierListUpdate', function(){
        console.log('dossier list needs update');
        self.update();
    });

    $("#findinformation").bind("click", function(e){
        if (e.target.id === 'userprofile') {
            window.location.href="user.html";
        }
        else {
		console.log("clicked the dossier cat on the left");
		var targetE = e.target;
		console.log("targetE is "+targetE);
		var targetID = targetE.id;
		console.log("targetID is "+targetE.id);
		var dosID = targetID.substring(10);
		console.log("dosID is "+dosID);
		var userModel = self.controller.models.user;
		userModel.setActiveDossier(dosID);
		window.location.href="index.html";
		//window.href="index.html";
		e.stopPropagation();
        }
    });
	
}

DossiersButtonView.prototype.openDiv=openView;

DossiersButtonView.prototype.open = function(){
	console.log("open in DossierList Button View");
	this.update();
};

DossiersButtonView.prototype.update = function(){

	var self=this;
	console.log("enter update dossiers button list");
	$("#findinformation").empty();
	//if we are logged in
	if (self.controller.oauth){

		//if the user has created some dossiers
		if (self.controller.models.dossierList.listIsPresent()) { 
			console.log("there is dossier list in update of dossiers button");
			self.controller.models.dossierList.reset();

			do {
				var dossierId=self.controller.models.dossierList.getDossierId();
				p1=$("<p/>",{
					"class": "bold clickable",
					"id":"dossierBtn"+dossierId,
					"text": self.controller.models.dossierList.getDossierTitle()
				}).appendTo("#findinformation");
			} while (self.controller.models.dossierList.nextDossier());	
		}

		p2=$("<p/>",{
			"class": (self.controller.oauth ? "bold": "bold hidden") + " clickable",
			"id":"userprofile",
			"text": "User Profile"
		}).appendTo("#findinformation");	
	}
};

DossiersButtonView.prototype.closeDiv= closeView;

DossiersButtonView.prototype.close = function(){
	
	console.log("close dossier button");
	this.closeDiv();
};

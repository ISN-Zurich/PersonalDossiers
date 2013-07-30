/*jslint vars: true, sloppy: true */
function DossierUsersView(Controller){
	var self=this;
	self.controller=controller;
	self.tagID="dossierUsers";
	this.open();
}


DossierUsersView.prototype.openDiv=openView;

DossierUsersView.prototype.open = function(){
	console.log("open dossierUsersView");
	this.update();
};

DossierUsersView.prototype.update = function(){
	var self=this;
	console.log("enter update users list for a dossier");
	$("#dossierUsers").empty();
	if (self.controller.models.userlist && self.controller.models.userlist.length >0) {
		do {
			dossierId=self.controller.getActiveDossier();
			p1=$("<p/>",{
				"class": "bold clickable",
				"id":"user", //might need user id or dossier id
				"text": self.controller.models.user.getUsername()
			}).appendTo("#dossierUsers");
		} while (self.controller.models.user.nextUser());	
	}
};
	


DossierUsersView.prototype.closeDiv= closeView;

DossiersButtonView.prototype.close = function(){
	
	console.log("close dossier users view");
	this.closeDiv();
};
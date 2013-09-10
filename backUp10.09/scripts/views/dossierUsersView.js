/*jslint vars: true, sloppy: true */
function DossierUsersView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="dossierUsers";
}


DossierUsersView.prototype.openDiv=openView;

DossierUsersView.prototype.open = function(){
	console.log("open dossierUsersView");
	
	this.update();
};

DossierUsersView.prototype.update = function(){
	var self=this;
	console.log("enter update users list for a dossier");
	$("#dossierUsers").removeClass("hidden");
	console.log("userlist is "+self.controller.models.bookmark.userlist);
	if (self.controller.models.bookmark.userlist && self.controller.models.bookmark.userlist.length >0) {
		console.log("dossierUsersView: userlist exists ");
		do {
				p1=$("<p/>",{
				"class": "bold clickable",
				"id":"user"+self.controller.models.bookmark.getUserid(), //might need user id 
				"text": self.controller.models.bookmark.getUsername()
			}).appendTo("#dossierUsers");
		} while (self.controller.models.bookmark.nextUser());	
	}
};
	
DossierUsersView.prototype.closeDiv= closeView;

DossiersButtonView.prototype.close = function(){
	
	console.log("close dossier users view");
	this.closeDiv();
};
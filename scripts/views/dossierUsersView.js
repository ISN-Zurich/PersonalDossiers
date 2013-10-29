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
	
	$("#dossierOwners").show();
	$("#dossierEditors").show();
	$("#dossierUsers").show();
	
	
};

DossierUsersView.prototype.update = function(){
	var self=this;
	console.log("enter update users list for a dossier");
	
	var bookmarkModel=self.controller.models.bookmark;
	bookmarkModel.resetUserIndex();
	console.log("userlist is in View is "+JSON.stringify(self.controller.models.bookmark.userlist));
	if (bookmarkModel.userlist && bookmarkModel.userlist.length >0) {
		console.log("dossierUsersView: userlist exists ");
		do {

		if (self.controller.models.bookmark.getUsertype() == "owner"){
			ownerContainer=$("<div/>",{
				"id":"owner"+self.controller.models.bookmark.getUserid(),
				"class":"pd_loginContainer clickable pd_listItem",
				"text": self.controller.models.bookmark.getUsername()
			}).appendTo("#pd_udossierOwners");
		}
		
		if (self.controller.models.bookmark.getUsertype() == "editor"){
			editorContainer=$("<div/>",{
				"id":"editor"+self.controller.models.bookmark.getUserid(),
				"class":"pd_loginContainer clickable pd_listItem",
				"text": self.controller.models.bookmark.getUsername()
			}).appendTo("#pd_udossierEditors");}
		
		if (self.controller.models.bookmark.getUsertype() == "user"){
			editorContainer=$("<div/>",{
				"id":"user"+self.controller.models.bookmark.getUserid(),
				"class":"pd_loginContainer clickable pd_listItem",
				"text": self.controller.models.bookmark.getUsername()
			}).appendTo("#pd_udossierUsers");}
					
		} while (self.controller.models.bookmark.nextUser());	
	
	} //end of external if
};
	
DossierUsersView.prototype.closeDiv= closeView;

DossiersButtonView.prototype.close = function(){
	
	console.log("close dossier users view");
	this.closeDiv();
};
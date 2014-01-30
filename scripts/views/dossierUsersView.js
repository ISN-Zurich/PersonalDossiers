/*jslint vars: true, sloppy: true */
function DossierUsersView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="dossierUsers";
	self.owners=false;
	self.editors=false;
	self.users=false;
}

DossierUsersView.prototype.openDiv=openView;

DossierUsersView.prototype.open = function(){
	var self=this;
	ISNLogger.log("open dossierUsersView");
	self.update();
	if (self.owners){
		$("#dossierOwners").show();
	}
	if (self.editors){
		$("#dossierEditors").show();
	}
	if (self.users){
		$("#dossierUsers").show();
	}
};

DossierUsersView.prototype.update = function(){
	var self=this;
	ISNLogger.log("enter update users list for a dossier");
	
	var bookmarkModel=self.controller.models.bookmark;
	bookmarkModel.resetUserIndex();
	ISNLogger.log("userlist is in View is "+JSON.stringify(self.controller.models.bookmark.userlist));
	if (bookmarkModel.userlist && bookmarkModel.userlist.length >0) {
		ISNLogger.log("dossierUsersView: userlist exists ");
		do {

		if (self.controller.models.bookmark.getUsertype() == "owner"){
			self.owners=true;
			ownerContainer=$("<div/>",{
				"id":"owner"+self.controller.models.bookmark.getUserid(),
				"class":"pd_loginContainer clickable userlistItem",
				"text": self.controller.models.bookmark.getUsername()
			}).appendTo("#pd_udossierOwners");
		}
		
		if (self.controller.models.bookmark.getUsertype() == "editor"){
			self.editors=true;
			editorContainer=$("<div/>",{
				"id":"editor"+self.controller.models.bookmark.getUserid(),
				"class":"pd_loginContainer clickable userlistItem",
				"text": self.controller.models.bookmark.getUsername()
			}).appendTo("#pd_udossierEditors");}
		
		if (self.controller.models.bookmark.getUsertype() == "user"){
			self.users=true;
			editorContainer=$("<div/>",{
				"id":"user"+self.controller.models.bookmark.getUserid(),
				"class":"pd_loginContainer clickable userlistItem",
				"text": self.controller.models.bookmark.getUsername()
			}).appendTo("#pd_udossierUsers");}
					
		} while (self.controller.models.bookmark.nextUser());	
	
	} //end of external if
};
	
DossierUsersView.prototype.closeDiv= closeView;

DossierUsersView.prototype.close = function(){
	
	ISNLogger.log("close dossier users view");
	this.closeDiv();
};

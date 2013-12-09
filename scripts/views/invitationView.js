/*jslint vars: true, sloppy: true */

function InvitationView(controller){
	var self = this;
	self.controller=controller;
	self.tagID="invitationView";	
		
	$(document).bind("BookmarkModelLoaded", function() {
		self.usertype=self.controller.getUserType();
		if (self.usertype === "owner"){
			console.log("we will open the invtiation box, we have an owner");
			self.open();
		}
	});
	
	
} //end of constructor


InvitationView.prototype.openDiv=openView;

InvitationView.prototype.open=function(){
	console.log("open invitation view");
	this.update();
	this.openDiv();
};


InvitationView.prototype.update=function(){
	
};

InvitationView.prototype.closeDiv=closeView;

InvitationView.prototype.close= function(){
	console.log("close invitation view");
	this.closeDiv();
};

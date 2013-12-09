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
	
	$("#pd_invite_bar_text").bind("click", function() {
		$("#roleSelectorView").show();
	});
	
	$("#adminRole").bind("click", function() {
		
		// 1. visuals of usertype button selection
		$("#userRoleSpan").removeClass("userRoleSelected");
		$("#userRoleSpan").addClass("userRoleUnSelected");
		
		$("#userRole").removeClass("selectedRole");
		$("#userRole").addClass("UnselectedRole");
		
		$("#adminRole").addClass("selectedRole");
		
		// 2. role assignment
		
		//userModel.setRole("owner");
	});
	
	$("#editorRole").bind("click", function() {
		
		// 1. visuals 
		$("#userRole").removeClass("selectedRole");
		$("#userRole").addClass("UnselectedRole");
		
		$("#userRoleSpan").removeClass("userRoleSelected");
		$("#userRoleSpan").addClass("userRoleUnSelected");
		
		
		
		
		$("#adminRole").removeClass("selectedRole");
		$("#editorRole").removeClass("roleSeparator");
		$("#editorRole").addClass("selectedRole");
		$("#editorRole").addClass("roleSeparator");
		
		// 2 . role assigment
		
		//userModel.setRole("editor");
	});
	
	$("#userRole").bind("click", function() {
		$("#userRole").removeClass("roleSeparator");
		$("#userRole").addClass("selectedRole");
		
		// 2 . role assigment

		//userModel.setRole("user");
		
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

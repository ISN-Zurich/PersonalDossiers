/**
 * User Profile View
 */
function userProfileView(controller){
	console.log("enter user profile view");
	var self=this;
	self.controller=controller;
	self.tagID="userProfile";
}

userProfileView.prototype.open = function(){
	console.log("enter open in user profile view");
	this.update(); 
};

userProfileView.prototype.update= function(){
	var self=this;

	$("#welcome").empty();
	$("#welcome").hide();

	$("#userProfile").empty();
	$("#notifications").empty();
	if ( self.controller.models.user.userProfile ) {
		$("#userProfile").html("<p>Welcome to user profile view</p>");
	}
};
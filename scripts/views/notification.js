/**
*  Notifications Page
*/

function notificationView(controller){
	ISNLogger.log("enter notification view constructor");
	var self=this;
	self.controller = controller;
	self.tagID='st_notifications';
}

notificationView.prototype.open = function(){
	ISNLogger.log("open notifications page");
	this.update();
};

notificationView.prototype.update = function(){
	var self=this;

	$("#welcome").empty();
	$("#welcome").hide();

	$("#userProfile").empty();
	
	$("#notifications").empty();
	if (self.controller.models.user.userProfile ) {
		$("#notifications").html("<p>Notifications</p>");
	}
};
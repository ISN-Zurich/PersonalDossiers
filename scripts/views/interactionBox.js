/**
 * this class describes general functionality of the interaction box
 *  - handlers of click event on dossiers item/icon of the interaction box
 *  - handlers of click event on user profile item/icon of the interaction box
 * @param controller
 */


function interactionBox(controller){
	console.log("enter interaction box constructor");
	var self=this;
	self.controller=controller;
	
//	$("#st_dossiers").bind("click", function(){
//		console.log("clicked  dossiers icon");
//		self.controller.views.welcome.open();
//	});
//	
//	$("#st_user").bind("click", function(){
//		console.log("clicked  user profile icon");
//		self.controller.views.user.open();
//	});
//	
//	
//	$("#st_notifications").bind("click", function(){
//		console.log("clicked  notification icon");
//		self.controller.views.notifications.open();
//	});
}
/**
 * this class describes general functionality of the interaction box
 *  - handlers of click event on dossiers item/icon of the interaction box
 *  - handlers of click event on user profile item/icon of the interaction box
 * @param controller
 */


function interactionBox(controller){
	ISNLogger.log("enter interaction box constructor");
	var self=this;
	self.controller=controller;
	
//	$("#st_dossiers").bind("click", function(){
//		console.log("clicked  dossiers icon");
//		setDossiersColorization();
//		self.controller.views.welcome.open();
//		self.views.addDossier.open();
//	});
//	
//	$("#st_user").bind("click", function(){
//		console.log("clicked  user profile icon");
//		setUserProfileColorization();
//		self.controller.views.welcome.close();
//		self.controller.views.addDossier.close();
//		self.controller.views.user.open();
//	});
//	
//	
//	$("#st_notifications").bind("click", function(){
//		console.log("clicked  notification icon");
//		self.controller.views.notifications.open();
//	});
}
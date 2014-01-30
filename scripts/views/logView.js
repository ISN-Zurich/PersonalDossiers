/**
 * This view decides what tab sub module to display on the interaction bar:
 * - the Li for login
 * - the Lo for logout
 *
 * 
 * */

function LogView(controller){
	ISNLogger.log("enter logView constructor");
	var self=this;
	self.controller=controller;
	this.tagID='logView';
	this.logView = null;
	//this.open();
	
	 $(document).bind('UserProfileUpdate', function(){
		 ISNLogger.log("caught user profile update in log view");
	  // self.update();
		 $("#logView").removeClass("disable"); 
	 });
	  
//	 $(document).bind('DossierListUpdate', function(){
//		  ISNLogger.log("caught dossier list update in log view");
//	        //self.update();
//	        $("#logView").removeClass("disable"); 
//	    });
////	
//	  $(document).bind("click", function(e){
//	  ISNLogger.log("clicked 1");
//	  var targetE= e.target;
//	  var targetId= targetE.id;
//	 
//	  //if the logout confirmation is visible
//	  if ($("#st_log_out_confirm").is(":visible") && targetId!== "#logView"){
//	  ISNLogger.log("clicekd 2");
//	  if (targetId !== 'st_log_out_confirm'){
//	  $("#st_log_out_confirm").addClass("hide"); 
//	  
//	  
//	  }
//
//	  if ($("#st_log_out_confirm").hasClass("hidden") && targetId== "st_log_out"){
//	  ISNLogger.log("clicked 3");
//	  $("#st_log_out_confirm").removeClass("hidden"); 
//	  $("#st_log_out").addClass("selected"); 
//	  ISNLogger.log("removedClass from 3");
//	  }
////	  }
//	  }
//});
	 
	 $("#logView").bind('click', function(){
		 ISNLogger.log("click loggout button");
		 if(!$("#st_logout_confirm").is(':visible')){
			 $("#st_user").removeClass("pd_sb_icon");
			 $("#st_dossiers").removeClass("pd_sb_icon");
			 $("#logView").addClass("pd_sb_icon");
			 $("#st_logout_confirm").removeClass("hide");}
		 else{
			 $("#st_logout_confirm").addClass("hide"); 
		 }
	 });
	 
	 $("#st_logout_confirm").bind('click', function(){
		  ISNLogger.log("click loggout confirm button");
		  self.controller.logout();
	 });
	 
}

LogView.prototype.openDiv=openView;

LogView.prototype.open = function(){
	this.update();
	this.openDiv();
};


//LogView.prototype.update = function(){
//	var self=this;
//	ISNLogger.log("enter open logView");
//	if (self.controller.oauth){
//		ISNLogger.log("we are authenticated, we will show the logout btn");
//		this.showLogout();
//	} else {
//		ISNLogger.log("we are not authenticated, we will show the login btn");
//		this.showLogin();
//	}
//};
//

LogView.prototype.closeDiv=closeView;

LogView.prototype.close=function(){
	$("#st_logout_confirm").addClass("hide");
	this.closeDiv();
};
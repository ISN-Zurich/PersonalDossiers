/**
 * This view decides what tab sub module to display on the interaction bar:
 * - the Li for login
 * - the Lo for logout
 *
 * 
 * */

function LogView(controller){
	console.log("enter logView constructor");
	var self=this;
	self.controller=controller;
	this.tagID='logView';
	this.logView = null;
	//this.open();
	
	 $(document).bind('UserProfileUpdate', function(){
		 console.log("caught user profile update in log view");
	  // self.update();
		 $("#logView").removeClass("disable"); 
	 });
	  
//	 $(document).bind('DossierListUpdate', function(){
//		  console.log("caught dossier list update in log view");
//	        //self.update();
//	        $("#logView").removeClass("disable"); 
//	    });
////	
//	  $(document).bind("click", function(e){
//	  console.log("clicked 1");
//	  var targetE= e.target;
//	  var targetId= targetE.id;
//	 
//	  //if the logout confirmation is visible
//	  if ($("#st_log_out_confirm").is(":visible") && targetId!== "#logView"){
//	  console.log("clicekd 2");
//	  if (targetId !== 'st_log_out_confirm'){
//	  $("#st_log_out_confirm").addClass("hide"); 
//	  
//	  
//	  }
//
//	  if ($("#st_log_out_confirm").hasClass("hidden") && targetId== "st_log_out"){
//	  console.log("clicked 3");
//	  $("#st_log_out_confirm").removeClass("hidden"); 
//	  $("#st_log_out").addClass("selected"); 
//	  console.log("removedClass from 3");
//	  }
////	  }
//	  }
//});
	 
	 $("#logView").bind('click', function(){
		 console.log("click loggout button");
		 if(!$("#st_logout_confirm").is(':visible')){
			 $("#st_logout_confirm").removeClass("hide");}
		 else{
			 $("#st_logout_confirm").addClass("hide"); 
		 }
	 });
	 
	 $("#st_logout_confirm").bind('click', function(){
		  console.log("click loggout confirm button");
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
//	console.log("enter open logView");
//	if (self.controller.oauth){
//		console.log("we are authenticated, we will show the logout btn");
//		this.showLogout();
//	} else {
//		console.log("we are not authenticated, we will show the login btn");
//		this.showLogin();
//	}
//};
//

LogView.prototype.closeDiv=closeView;

LogView.prototype.close=function(){
	this.closeDiv();
};

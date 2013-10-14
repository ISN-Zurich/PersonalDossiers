function landingView(controller){
	var self=this;
	self.controller=controller;
	self.tagID = 'landingView';
	
	$(document).bind('UserProfileUpdate', function(){
		console.log("user profile update binded in landing view");
		self.update();
	});
	
	$(document).bind('DossierListUpdate', function(){
		self.update();
	});
	    
	   $("#st_log_in").bind("click", function(){
			 console.log("clicked the login button");
			 self.controller.models.authentication.loadData();
			 self.controller.models.user.checkActiveUser();
			 self.controller.views.login.open();			
		 });   
	   
}

landingView.prototype.open = function(){
	
			
	this.update();
};

landingView.prototype.update = function(){
	 var self= this;
	 
	 //prepare colorization of interaction box for the authenticated area
	 
//	 $("#st_dossiers").removeClass("disable");
//	 $("#st_dossiers").addClass("pd_a_selected");
//	 
//	 $("#span_dossiers").removeClass("pd_disable");
//	 $("#span_dossiers").addClass("pd_selected");
//	 
//	 	 
//	 $("#logView").removeClass("pd_a_selected");
//	 $("#logView").addClass("pd_interactionItem");
//	
//	 $("#st_user").removeClass("disable");
//	 $("#span_user").removeClass("pd_disable");
	
	 var hash= window.location.hash;
	 var hashTag = hash.substring(1);
	 self.controller.colorizeInteractiveBox(hashTag);
	 self.controller.chooseView(hashTag);
	 
	 $("#videoView").addClass("hide");
	 $("#landingView").removeClass("hide");
	 $("#loginFormContainer").addClass("hide");
	 $("#IntroductionPD").addClass("hide");
	 
	 var hashTag = self.controller.getHash();
	 self.controller.chooseView(hashTag);
};

landingView.prototype.close = function(){
	$('#'+this.tagID).addClass("hidden");
};
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
	this.open();
	
	 $(document).bind('UserProfileUpdate', function(){
		 console.log("caught user profile update in log view");
	   self.update();
	  });
	  $(document).bind('DossierListUpdate', function(){
		  console.log("caught dossier list update in log view");
	        self.update();
	    });
	
}

LogView.prototype.open = function(){
	this.update();
};


LogView.prototype.update = function(){
	var self=this;
	console.log("enter open logView");
	if (self.controller.oauth){
		console.log("we are authenticated, we will show the logout btn");
		this.showLogout();
	} else {
		console.log("we are not authenticated, we will show the login btn");
		this.showLogin();
	}
};

LogView.prototype.showLogout = function(){
	$("#st_log_in").empty();
	$("#st_log_in").hide();
	$("#st_log_out").remove();
	
	
	var self=this;
	console.log("enter show logout");

	 span = $("<span/>", {
		"id": "st_log_out",
		"class":"tabs_margin",
		"text": "Lo"
	}).appendTo("#logView");
	 
	 divConfirm = $("<div/>", {
			"id": "st_log_out_confirm",
			"class":"red hidden",
			"text": "are you sure you want to log out?"
	}).appendTo("#InteractionBar");
	 

	 
	 $("#st_log_out_confirm").bind("click", function(){
		 self.controller.logout();
	 });
	 
	 $(document).bind("click", function(e){
		 console.log("clicked 1");
		 var targetE= e.target;
		 var targetId= targetE.id;
		 //if the logout confirmation is visible
		 if (!$("#st_log_out_confirm").hasClass("hidden") && targetId!== "st_log_out"){
			 console.log("clicekd 2");
			 if (targetId !== 'st_log_out_confirm'){
				 $("#st_log_out_confirm").addClass("hidden"); 
				 $("#st_log_out").removeClass("selected"); 
			 }
		 }
		 
		 if ($("#st_log_out_confirm").hasClass("hidden") && targetId== "st_log_out"){
			 console.log("clicked 3");
			 $("#st_log_out_confirm").removeClass("hidden"); 
			 $("#st_log_out").addClass("selected"); 
			 console.log("removedClass from 3");
			}
	 });
};


LogView.prototype.showLogin = function(){
	$("#st_log_in").remove();
	$("#st_log_out").hide();
	$("#st_log_out_confirm").addClass("hidden");
	
	var self=this;
	console.log("enter show login");

	 span = $("<span/>", {
		 "id":"st_log_in",
		"class":"tabs_margin selected",
		"text": "Li"
	}).appendTo("#logView");
	 
	  
	 $("#st_log_in").bind("click", function(){
		 console.log("clicked the login button");
		 self.controller.models.authentication.loadData();
		 self.controller.models.user.checkActiveUser();
		 self.controller.views.login.open();			
	 });
	
};
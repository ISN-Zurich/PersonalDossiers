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
	this.tagID='st_log';
	this.logView = null;
	this.open();
	
	 $(document).bind('UserProfileUpdate', function(){
	   self.update();
	  });
	 $(document).bind('LogoutSent', function(){
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
	$("#st_log_out").remove();
	
	var self=this;
	console.log("enter show logout");
	 div = $("<div/>", {
		"id":"st_log_out",
		"class": "sb_icon"		
	}).appendTo("#InteractionBar");

	 span = $("<p/>", {
		"class":"tabs_margin",
		"text": "Lo"
	}).appendTo("#st_log_out");
	 
	 $("#st_log_out").bind("click", function(){
		 console.log("clicked the logout button");
		 self.controller.logout();			
	 });
};


LogView.prototype.showLogin = function(){
	$("#st_log_in").remove();
	var self=this;
	console.log("enter show login");
	 div = $("<div/>", {
		"id":"st_log_in",
		"class": "sb_icon"		
	}).appendTo("#InteractionBar");

	 span = $("<p/>", {
		"class":"tabs_margin",
		"text": "Li"
	}).appendTo("#st_log_in");
	 
	  
	 $("#st_log_in").bind("click", function(){
		 console.log("clicked the login button");
		 self.controller.models.authentication.loadData();
		 self.controller.models.user.checkActiveUser();
		 self.controller.views.login.open();	
		
		 		
	 });
	
};
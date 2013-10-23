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
	
	  $(document).bind("click", function(e){
	  console.log("clicked 1");
	  var targetE= e.target;
	  var targetId= targetE.id;
	  if($("#st_log_out") && $("#st_log_out_confirm")){
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
	  }
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
	var self=this;
	$("#st_log_in").empty();
	$("#st_log_in").hide();
	$("#st_log_out").remove();
	
	
	var self=this;
	console.log("enter show logout");

	 span = $("<span/>", {
		"id": "st_log_out",
		"class":"pd_tabs_margin pd_active",
		"text": "Lo"
	}).appendTo("#logView");
	 
	 divConfirm = $("<div/>", {
			"id": "st_log_out_confirm",
			"class":"box snippetlist hidden"
	}).insertBefore("#loginFormContainer");
	 
//	 divHeader = $("<div/>", {
//			"class":"sidebar-header darkblue",
//			"text": "Logout Confirmation"
//	}).appendTo(divConfirm);
	 
	 div2 = $("<div/>", {
			"class":"snippetlist-content greyBg"
	}).appendTo(divConfirm);
	 
	 div3 = $("<div/>", {
			"class":"about_section_desc"
	}).appendTo(div2);
	 
	 ul = $("<ul/>", {
		
	}).appendTo(div3);
	 
	liContainer = $("<li/>", {
			"class":"pd_loginContainer"
		}).appendTo(ul);
	
	divFinal= $("<div/>", {
		"id": "confirmationMsg",
		"class":"pd_loginContainer red clickable",
		"text":"are you sure you want to log out?"
	}).appendTo(liContainer);
	 
	
	 
//	 buttonContainer = $("<div/>", {
//		 	"id": "logoutBtn_container",
//			"class":"adv_search_buttons right"
//	}).insertAfter("#st_log_out_confirm");
//	 
//	 button = $("<div/>", {
//		 	"id": "pd_logoutBtn",
//			"class":"search_bar_button right",
//			"value": "Logout",
//			"name": "Logout",
//			"text": "Logout"
//	}).appendTo(buttonContainer);
//	 
	 
	 
	 
	 $("#st_log_out_confirm").bind("click", function(){
		 self.controller.logout();
	 });
	 
	 $("#logView").bind("click", function(){
		 console.log("clicked log view, the loggout button");
		 $("#st_log_out").addClass("selected"); 
		 $("#st_log_out_confirm").removeClass("hidden"); 
		 self.controller.loggoutClicked=true;
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
		"class":"pd_tabs_margin pd_selected",
		"text": "Li"
	}).appendTo("#logView");
	 
	  
	 $("#st_log_in").bind("click", function(){
		 console.log("clicked the login button");
		 self.controller.models.authentication.loadData();
		 self.controller.models.user.checkActiveUser();
		 self.controller.views.login.open();			
	 });
	
};


LogView.prototype.showLogoutConfirm = function(){
	 $("#st_log_out").addClass("selected"); 
	 $("#logView").addClass("pd_a_selected");
	 $("#st_dossiers").removeClass("pd_a_selected");
	 $("#st_user").removeClass("pd_a_selected");
	 
	 $("#st_log_out_confirm").removeClass("hidden"); 
	 
	 $("#st_log_out_confirm").bind("click", function(){
		 self.controller.logout();
	 });
};
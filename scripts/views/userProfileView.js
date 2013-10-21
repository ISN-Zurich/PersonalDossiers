/**
 * User Profile View
 */
function userProfileView(controller){
	console.log("enter user profile view");
	var self=this;
	self.controller=controller;
	self.tagID="userProfile";
	
	$("#pd_uContainer3").bind("click", function(e){
		console.log("clicked the edit user profile button");
		 $("#titleInput").attr('contenteditable', 'true');
		 $("#nameInput").attr('contenteditable', 'true');
		 $("#emailInput").attr('contenteditable', 'true');
		  
		//self.controller.models.dossierList.addDossier();
	});
}

userProfileView.prototype.open = function(){
	console.log("enter open in user profile view");
	this.update(); 
};

userProfileView.prototype.update= function(){
	var self=this;
	
	console.log("enter update user profile view");
	
	$("#welcome").empty();
	$("#welcome").hide();

	$("#userProfile").empty();
	$("#notifications").empty();
	var userModel=self.controller.models.user;
	if (userModel.userProfile) {		
		
	//$("#userProfile").html("<p>Welcome to user profile view</p>");
		headerBlue =$("<div/>", {
			"id": "dossierListHeader",
			"class": "sidebar-header darkblue",
			"text":"Edit your profile"
		}).appendTo("#userProfile");
		
		titleContainer =$("<div/>", {
			
		}).appendTo("#userProfile");
		
		titleLabel =$("<div/>", {
			"class": "adv_search_label",
			"text":"Title"			
		}).appendTo(titleContainer);
		
		console.log("designed the title label ");
		
		titleinput =$("<div/>", {
			"id":"titleInput",
			"class": " adv_search_label adv_search_input_container",
			//"text":"Mr." //to be designed dynamically	
		    "text": userModel.getTitle()
		}).appendTo(titleContainer);
		
		console.log("designed the title value ");
		nameContainer =$("<div/>", {
			
		}).appendTo("#userProfile");
		
		nameLabel =$("<div/>", {
			"class": "adv_search_label",
			"text":"Name"			
		}).appendTo(nameContainer);
		
		nameinput =$("<div/>", {
			"id":"nameInput",
			"class": "adv_search_label adv_search_input_container",
			//"text":"Tim" //to be designed dynamically
			"text":userModel.getName()			
		}).appendTo(nameContainer);
		
				
		emailContainer =$("<div/>", {

		}).appendTo("#userProfile");

		emailnameLabel =$("<div/>", {
			"class": "adv_search_label",
			"text":"Email"
		}).appendTo(emailContainer);

		emailnameinput =$("<div/>", {
			"id":"emailInput",
			"class": " adv_search_label adv_search_input_container",
			text:userModel.getEmail()	
		}).appendTo(emailContainer);
				
	}
	
};
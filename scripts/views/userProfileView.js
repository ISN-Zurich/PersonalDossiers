/**
 * User Profile View
 */
function userProfileView(controller){
	console.log("enter user profile view");
	var self=this;
	self.controller=controller;
	self.tagID="userProfile";
}

userProfileView.prototype.open = function(){
	console.log("enter open in user profile view");
	this.update(); 
};

userProfileView.prototype.update= function(){
	var self=this;

	$("#welcome").empty();
	$("#welcome").hide();

	$("#userProfile").empty();
	$("#notifications").empty();
	if ( self.controller.models.user.userProfile ) {		
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
		
		titleinput =$("<div/>", {
			"class": "adv_search_input_container",
			"text":"Mr." //to be designed dynamically			
		}).appendTo(titleContainer);
		nameContainer =$("<div/>", {
			
		}).appendTo("#userProfile");
		
		nameLabel =$("<div/>", {
			"class": "adv_search_label",
			"text":"Name"			
		}).appendTo(nameContainer);
		
		nameinput =$("<div/>", {
			"class": "adv_search_input_container",
			"text":"Tim" //to be designed dynamically			
		}).appendTo(nameContainer);
		
		lastnameContainer =$("<div/>", {

		}).appendTo("#userProfile");

		lastnameLabel =$("<div/>", {
			"class": "adv_search_label",
			"text":"Surname"			
		}).appendTo(lastnameContainer);

		lastnameinput =$("<div/>", {
			"class": "adv_search_input_container",
			"text":"Wender" //to be designed dynamically			
		}).appendTo(lastnameContainer);
		
		emailContainer =$("<div/>", {

		}).appendTo("#userProfile");

		emailnameLabel =$("<div/>", {
			"class": "adv_search_label",
			"text":"Email"			
		}).appendTo(emailContainer);

		emailnameinput =$("<div/>", {
			"class": "adv_search_input_container",
			"text":"wendel.sipo.gess.ethz.ch" //to be designed dynamically			
		}).appendTo(emailContainer);
				
	}
	
};
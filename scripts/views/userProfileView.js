/*jslint vars: true, sloppy: true */
/**
* User Profile View
 */
function userProfileView(controller){
	console.log("enter user profile view");
	var self=this;
	self.controller=controller;
	self.tagID="userProfile";
	self.editMode=false;
	
	
//remove the warning messages when start typing again
	
	$("#pd_newPassword").bind("click", function(e){
		console.log("click change password container");
		if (!$("#warning_empty").hasClass("hide")){
			$("#warning_empty").addClass("hide")
		}
		
		if (!$("#warning_confirm").hasClass("hide")){
			$("#warning_confirm").addClass("hide")
		}
	});
	
	
	$("#pd_confirm_newPassword").bind("click", function(e){
		console.log("click change password container");
		if (!$("#warning_empty").hasClass("hide")){
			$("#warning_empty").addClass("hide")
		}
		
		if (!$("#warning_confirm").hasClass("hide")){
			$("#warning_confirm").addClass("hide")
		}
	});
	
	$("#pd_uContainer3").bind("click", function(e){
		console.log("clicked the edit user profile button");
		
		//close the edit password sub view
		$("#changePasswordContainer").addClass('hide');
		$("#userProfileContainer").removeClass('hide');
		
		$("#pd_pContainer4").removeClass('pd_profile_selected');
		 $("#titleInput").attr('contenteditable', 'true');
		 $("#nameInput").attr('contenteditable', 'true');
		 $("#emailInput").attr('contenteditable', 'true');
		 $("#saveChanges_container").removeClass('hide');
		 
		 $(this).addClass('pd_profile_selected');
		 self.editMode = true;	
	});
	
	$("#save_changes_submit").bind("click", function(e){
		console.log("click save changes before if");
		if (self.editMode){
		console.log("clicked the save changes  button");
		self.saveChanges();
		self.controller.models.user.sendUserProfileToServer();
		 $("#titleInput").attr('contenteditable', 'false');
		 $("#nameInput").attr('contenteditable', 'false');
		 $("#emailInput").attr('contenteditable', 'false');
		 $("#saveChanges_container").addClass('hide');
		 self.editMode=false;
		}
	});
	
	$("#pd_pContainer4").bind("click", function(e){
		 $("#pd_uContainer3").removeClass('pd_profile_selected');
		console.log("clicked the edit password button");
		 $("#pd_newPassword").attr('contenteditable', 'true');
		 $("#pd_confirm_newPassword").attr('contenteditable', 'true');
		self.showPasswordForm();
		$("#userProfileContainer").addClass('hide');
		 $("#saveChangesPswd_container").removeClass('hide');
		 $(this).addClass('pd_profile_selected');
		 self.editMode = true;	
	});
	
	$("#save_password_submit").bind("click", function(e){
		console.log("click save changes before if");
		if (self.editMode){
		console.log("clicked the save changes  button");
		self.savePasswordChanges();
		}
	});
	
} //end of constructor

userProfileView.prototype.openDiv=openView;

userProfileView.prototype.open = function(){
	console.log("enter open in user profile view");

	this.update(); 
	this.openDiv();
};

userProfileView.prototype.update= function(){
	var self=this;
	console.log("enter update user profile view");
	
	self.controller.activeView=self.controller.views.user; 
	$("#profileViewContainer").removeClass("hide");
		
	var userModel=self.controller.models.user;
	if (userModel.userProfile) {		
					
		$("#titleInput").text(userModel.getTitle());
		
		$("#nameInput").text(userModel.getName());

		$("#emailInput").text(userModel.getEmail());
	}
	
};


userProfileView.prototype.saveChanges= function(){
	var value_title = $("#titleInput").text();
	 this.controller.models.user.setUserTitle(value_title);
	 var value_name = $("#nameInput").text();
	 this.controller.models.user.setUserName(value_name);
	 var value_email = $("#emailInput").text();
	 this.controller.models.user.setUserEmail(value_email);
	 $("#successful_message1").fadeIn();
	 $("#successful_message1").fadeOut(5000);
};


userProfileView.prototype.showPasswordForm= function(){
	var self=this;
	userModel= self.controller.models.user;
	$("#userProfileContainer").addClass("hide");
	$("#warning_empty").addClass("hide");
	$("#warning_confirm").addClass("hide");
	$("#changePasswordContainer").removeClass("hide");
	$("#pd_currentPassword").text(userModel.getPassword());
};

userProfileView.prototype.savePasswordChanges= function(){
	console.log("enter save password changes");
	var new_password = $("#pd_newPassword").text();
	var form_validation=true;;
	var confirm_password = $("#pd_confirm_newPassword").text();
 if (new_password.length == 0 || confirm_password.length ==0) {
	 // one or both of the input password fields are empty
	 $("#warning_empty").fadeIn();
	 $("#warning_empty").fadeOut(5000);
	 form_validation=false;
 }
 
 if (new_password !== confirm_password){
	 $("#warning_confirm").fadeIn();
	 $("#warning_confirm").fadeOut(5000);
	 form_validation=false;
 }
	
 if (form_validation){
	 console.log("passed the form validation");
	 this.controller.models.user.sendUserPasswordToServer(new_password);
	 $("#pd_newPassword").attr('contenteditable', 'false');
	 $("#pd_confirm_newPassword").attr('contenteditable', 'false');
	 $("#saveChangesPswd_container").addClass('hide');
	 $("#successful_message2").fadeIn();
	 $("#successful_message2").fadeOut(5000);
	 self.editMode=false;
 }
};


userProfileView.prototype.closeDiv=closeView;

userProfileView.prototype.close=function(){
	//close the button on the right side
	$("#profileViewContainer").addClass("hide");

	//close the content area that contains the user data
	this.closeDiv();
};

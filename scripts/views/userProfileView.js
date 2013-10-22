/**
 * User Profile View
 */
function userProfileView(controller){
	console.log("enter user profile view");
	var self=this;
	self.controller=controller;
	self.tagID="userProfile";
	self.editMode=false;
	
	$("#pd_uContainer3").bind("click", function(e){
		console.log("clicked the edit user profile button");
		 $("#titleInput").attr('contenteditable', 'true');
		 $("#nameInput").attr('contenteditable', 'true');
		 $("#emailInput").attr('contenteditable', 'true');
		 $("#saveChanges_container").removeClass('hide');
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
		console.log("clicked the edit password button");
		 $("#pd_newPassword").attr('contenteditable', 'true');
		 $("#pd_confirm_newPassword").attr('contenteditable', 'true');
		self.showPasswordForm();
		 $("#saveChangesPswd_container").removeClass('hide');
		 self.editMode = true;	
	});
	
	$("#save_password_submit").bind("click", function(e){
		console.log("click save changes before if");
		if (self.editMode){
		console.log("clicked the save changes  button");
		self.savePasswordChanges();
		self.controller.models.user.sendUserPasswordToServer();
		 $("#pd_newPassword").attr('contenteditable', 'false');
		 $("#pd_confirm_newPassword").attr('contenteditable', 'false');
		 $("#saveChangesPswd_container").addClass('hide');
		 self.editMode=false;
		}
	});
	
} //end of constructor

userProfileView.prototype.open = function(){
	console.log("enter open in user profile view");
	this.update(); 
};

userProfileView.prototype.update= function(){
	var self=this;
	
	console.log("enter update user profile view");
	
	$("#welcome").empty();
	$("#welcome").hide();

	$("#notifications").empty();
	$("#userProfile").removeClass("hide");
	
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
};


userProfileView.prototype.showPasswordForm= function(){
	var self=this;
	userModel= self.controller.models.user;
	$("#userProfileContainer").addClass("hide");
	$("#changePasswordContainer").removeClass("hide");
	$("#pd_currentPassword").text(userModel.getPassword());
};

userProfileView.prototype.savePasswordChanges= function(){
	console.log("enter save password changes");
	var new_password = $("#pd_newPassword").text();
//	 this.controller.models.user.setUserTitle(value_title);
//	 var value_name = $("#nameInput").text();
//	 this.controller.models.user.setUserName(value_name);
//	 var value_email = $("#emailInput").text();
	 this.controller.models.user.sendUserPasswordToServer(new_password);
};


/*jslint vars: true, sloppy: true */

function RegistrationView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="registrationView";	
	self.userModel= self.controller.models.user;
	
	
	$(document).bind('PasswortNotValidated', function(){
		console.log("bound passwort not validated in registration view");
		$("#passwordRegistrationInput").hide();
		$("#empty_password").hide();
		$("#short_password").show();	
	});

	$(document).bind('PasswortEmpty', function(){
		console.log("bound passwort empty in registration view");
		$("#passwordRegistrationInput").hide();
		$("#short_password").hide();	
		$("#empty_password").show();	
	});

	
	$(document).bind('RegistrationValidated', function(){
		console.log("bound registation validated in registration view");
		$("#submit_confirmation").removeClass("inactive_registration");
		$("#submit_confirmation").addClass("active_registration");	
	});


	$(document).bind('RegistrationNotValidated', function(){
		console.log("bound registation NOT validated in registration view");
		$("#submit_confirmation").removeClass("active_registration");	
		$("#submit_confirmation").addClass("inactive_registration");
	});
	
	$("#registerButton").bind("click", function(e){
		console.log("clicked on the register button");
		self.controller.transitionToRegistration();
		
		$("#titleRegistrationInput").attr('contenteditable', 'true');
		$("#nameRegistrationInput").attr('contenteditable', 'true');
		$("#emailRegistrationInput").attr('contenteditable', 'true');
		$("#passwordRegistrationInput").attr('contenteditable', 'true');
		$("#passwordRegConfirmInput").attr('contenteditable', 'true');
			
	});
	
	$("#cancel_registration").bind("click", function(e){
		self.controller.transitionToIntroduction();	
	});
	
	$("#titleRegistrationInput").focusout(function(e){
		console.log("focused out title in registration");
		var value_title = $("#titleRegistrationInput").text();
		self.userModel.setUserTitle(value_title);
	});
	
	
	/**
	 * When focusing out from the name field check
	 * - if the name field has been filled in
	 * - if yes, then the validation status for this field is set to 1 (=true) otherwise to 0 (=false)
	 * - check the general validation status of the registration form in order to display the registration button active or not
	 */
	
	$("#nameRegistrationInput").focusout(function(e){
		console.log("focused out name in registration");
		var value_name = $("#nameRegistrationInput").text();

		self.userModel.setName(value_name);

		if (!self.userModel.setName(value_name)) {
			$("#nameRegistrationInput").hide();
			$("#empty_name").show();
		}
	});
	
	
	/**
	 * When focusing out from the email field check
	 * - if the email field has been filled in
	 * - if yes, then the validation status for this field is set to 1 (=true) otherwise to 0 (=false)
	 * - check the general validation status of the registration form in order to display the registration button active or not
	 */
	$("#emailRegistrationInput").focusout(function(e){
		console.log("focused out email in registration");
		var value_email = $("#emailRegistrationInput").text();
		self.userModel.setUserEmail(value_email);

		// there is any kind of error during the set of email
		if (!self.userModel.setUserEmail(value_email)) {
			
			//email has not been set at all
		if (self.userModel.emailEmpty){
				$("#emailRegistrationInput").hide();
				$("#empty_mail").show();
		}
			
			//email is not set in a valid format
//			if (!self.userModel.emailValidated){
//				$("#emailRegistrationInput").hide();
//				$("#empty_mail").show();
//			}
		}
	});

	
	/**
	 * When focusing out from the password field check
	 * 
	 * */
	$("#passwordRegistrationInput").focusout(function(e){
		console.log("focused out password in registration");
		var value_password = $("#passwordRegistrationInput").text();
		var hash_password = self.userModel.getHashPassword(value_password);
		self.userModel.setPassword(hash_password ? hash_password : "", value_password ? value_password.length : "");
	});
	
	/**
	 * When focusing out from the confirmation of the password field the following check controlls take
	 * - check if the field is empty
	 * - check the matching of the field with the password field
	 * - if the above conditions are met correctly, then the validation status for this field is set to 1 (=true)
	 * - check the general validation status of the registration form in order to display the registration button active or not
	 */
	$("#passwordRegConfirmInput").focusout(function(e){
		console.log("focus out password confirmation");
		
		var firstCheck=true;
		var password = $("#passwordRegistrationInput").text();
		var hash_password = self.userModel.getHashPassword(password);
		var confirm_password = $("#passwordRegConfirmInput").text();
		if (confirm_password){
		var hash_confirm = self.userModel.getHashPassword(confirm_password);
		}
		
		self.userModel.setConfirmPassword(hash_confirm);
			
		if (!self.userModel.setConfirmPassword(hash_confirm)) {
			$("#passwordRegConfirmInput").hide();
			$("#empty_confirmPassword").show();
			var firstCheck=false;
		}
		
			
		//if the confirmed password has been set, check its matching with the password
		if (firstCheck){
			self.userModel.checkPasswordConfirmation(hash_password,hash_confirm);
		}
	});
	

	$("#empty_name").bind("click", function(e){
		console.log("clicked on the empty name");
		$(this).hide();
		$("#nameRegistrationInput").show();
		
	});
	
	$("#empty_mail").bind("click", function(e){
		console.log("clicked on the empty email");
		$(this).hide();
		$("#emailRegistrationInput").show();
		
	});
	
	$("#empty_password").bind("click", function(e){
		console.log("clicked on the empty password");
		$(this).hide();
		$("#passwordRegistrationInput").show();
	});
	
	$("#short_password").bind("click", function(e){
		console.log("clicked on the empty password");
		$(this).hide();
		$("#passwordRegistrationInput").show();
	});
	
	$("#empty_confirmPassword").bind("click", function(e){
		console.log("clicked on the empty password");
		$(this).hide();
		$("#passwordRegConfirmInput").show();
	});

	/**
	 * Colorization of password and confirmation password fields
	 * during the completeness of the confirmation password field
	 */
	$("#passwordRegConfirmInput").keyup(function(e){
		console.log("enter focus in confirm password field");
		
		var new_password = $("#passwordRegistrationInput").text();
		
		var confirm_password = $("#passwordRegConfirmInput").text();

		
		console.log("new password is" +new_password);
		console.log("confirm password is" +confirm_password);
		if (new_password !== confirm_password){
			
			console.log("the two fields are not matching with each other");
			$("#pd_reg_password_confirm_label").css('background-color', 'red');
			$("#pd_reg_password_confirm_label").css('color', '#fff');
		}
		
		if (new_password == confirm_password){
			console.log("the two fields match with each other");
			$("#pd_reg_password_confirm_label").css('background-color', '#0089CF');
			$("#pd_reg_password_confirm_label").css('color', '#fff');
		}
		

	});
	
	/**
	 * clean any background color from labels of fields 
	 *
	 */	
	$("#registrationContainer").bind("click", function(e){
		$("#pd_registration_email_label").css('background-color', '#ebedee');
		$("#pd_registration_email_label").css('color', '#4C5160'); 
	});
	
	
	
	$("#submit_confirmation").bind("click", function(e){
		console.log("clicked submit confirmation");
		var value_password = $("#passwordRegistrationInput").text();
		self.controller.models.user.register(value_password);

		//clean any background color of the label
		$("#pd_registration_password_label").css('background-color', '#ebedee');
		$("#pd_registration_password_label").css('color', '#4C5160');
		$("#pd_reg_password_confirm_label").css('background-color', '#ebedee');
		$("#pd_reg_password_confirm_label").css('color', '#4C5160');
	});

}

RegistrationView.prototype.openDiv= openView;

RegistrationView.prototype.open = function(){
	this.update();
	this.openDiv();
};

RegistrationView.prototype.update = function(){
	
};


RegistrationView.prototype.closeDiv=closeView;


RegistrationView.prototype.close = function(){
	console.log("close welcome view");
	this.closeDiv();
};


/*jslint vars: true, sloppy: true */

function RegistrationView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="registrationView";	
	self.userModel= self.controller.models.user;
	
	
	
	$(document).bind('EmailAlreadyTaken', function(){
		console.log("bound email already taken registration view");
		$("#emailRegistrationInput").hide();
		$("#existing_mail").show();	
		
		$("#pd_registration_email_label").css('background-color', 'red');
		$("#pd_registration_email_label").css('color', '#fff'); 
	});
	
	
	$(document).bind('NameEmpty', function(){
		console.log("bound name empty d in registration view");
		$("#nameRegistrationInput").hide();
		$("#empty_name").show();	
	});
	
	
	$(document).bind('EmailEmpty', function(){
		console.log("bound email empty in registration view");
				
		$("#emailRegistrationInput").hide();
		$("#empty_mail").show();	
	});
	
	$(document).bind('EmailNotValidated', function(){
		console.log("bound email not validated in registration view");
		$("#emailRegistrationInput").hide();
		$("#notvalid_mail").show();	
	});
	
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
	
	$(document).bind('PasswortConfirmEmpty', function(){
		console.log("bound confirm passwort empty in registration view");
		$("#passwordRegConfirmInput").hide();	
		$("#empty_confirmPassword").show();	
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
	 * focusing out from the name field 
	 */
	
	$("#nameRegistrationInput").focusout(function(e){
		console.log("focused out name in registration");
		var value_name = $("#nameRegistrationInput").text();
		self.userModel.setName(value_name);
	});
	
	
	/**
	 * focusing out from the email field 
	 */
	$("#emailRegistrationInput").focusout(function(e){
		console.log("focused out email in registration");
		var value_email = $("#emailRegistrationInput").text();
		self.userModel.setUserEmail(value_email);
	});

	
	/**
	 * focusing out from the password field 
	 * */
	$("#passwordRegistrationInput").focusout(function(e){
		console.log("focused out password in registration");
		var value_password = $("#passwordRegistrationInput").text();
		var hash_password = self.userModel.getHashPassword(value_password);
		self.userModel.setPassword(hash_password ? hash_password : "", value_password ? value_password.length : "");
	});
	
	
	/**
	 * * focusing out from the password field
	 */
	
	$("#passwordRegConfirmInput").focusout(function(e){
		console.log("focus out password confirmation");
		
		var password = $("#passwordRegistrationInput").text();
		if(password){
			var hash_password = self.userModel.getHashPassword(password);
		}
		var confirm_password = $("#passwordRegConfirmInput").text();
		if (confirm_password){
			var hash_confirm = self.userModel.getHashPassword(confirm_password);
		}
		self.userModel.setConfirmPassword(hash_confirm,hash_password);
	});
	

	
	$("#empty_name").bind("click", function(e){
		console.log("clicked on the empty name");
		$("#empty_name").hide();
		$("#nameRegistrationInput").show();
		
	});
	
	$("#empty_mail").bind("click", function(e){
		console.log("clicked on the empty email");
		$("#empty_mail").hide();
		$("#emailRegistrationInput").show();
		
	});
	
	$("#notvalid_mail").bind("click", function(e){
		console.log("clicked on the not valid email");
		$("#notvalid_mail").hide();
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


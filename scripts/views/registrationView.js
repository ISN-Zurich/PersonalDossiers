/*jslint vars: true, sloppy: true */

function RegistrationView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="registrationView";	
	
	$("#registerButton").bind("click", function(e){
		console.log("clicked on the register button");
		self.controller.transitionToRegistration();
		
		$("#titleRegistrationInput").attr('contenteditable', 'true');
		$("#nameRegistrationInput").attr('contenteditable', 'true');
		$("#emailRegistrationInput").attr('contenteditable', 'true');
		$("#passwordRegistrationInput").attr('contenteditable', 'true');
		$("#passwordRegConfirmInput").attr('contenteditable', 'true');
			
	});
	
	$("#titleRegistrationInput").focusout(function(e){
		console.log("focused out title in registration");
		var value_title = $("#titleRegistrationInput").text();
		self.controller.models.user.setUserTitle(value_title);
	});
	
	$("#nameRegistrationInput").focusout(function(e){
		console.log("focused out name in registration");
		var value_name = $("#nameRegistrationInput").text();
		self.controller.models.user.setUserName(value_name);
	});
	
	$("#emailRegistrationInput").focusout(function(e){
		console.log("focused out email in registration");
		var value_email = $("#emailRegistrationInput").text();
		
		self.controller.models.user.setUserEmail(value_email);
		
	});
	
	$("#submit_confirmation").bind("click", function(e){
		console.log("clicked submit confirmation");
		form_validation=true;
		//check if password is set 
		var value_password = $("#passwordRegistrationInput").text();
		var value_password_confirm = $("#passwordRegConfirmInput").text();
		if (value_password.length ==0) {
		console.log("password is empty");
		$("#pd_registration_password_label").css('background-color', 'red');
		$("#pd_registration_password_label").css('color', '#fff'); 
		form_validation=false;
		}
		if (value_password_confirm.length == 0) {
		$("#pd_reg_password_confirm_label").css('background-color', 'red');
		$("#pd_reg_password_confirm_label").css('color', '#fff'); 
				// $("#warning_empty").fadeIn();
				// $("#warning_empty").fadeOut(5000);
			 form_validation=false;
		}
		 if (form_validation){
			 console.log("the password is filled in so validation done");
			 self.controller.models.user.register(value_password);
		 }	
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
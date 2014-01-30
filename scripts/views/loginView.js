function LoginView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="loginFormContainer";
		
	$("#loginButton").bind("click", login);
	
	$(document).bind("keyup", keyfield);
	
	function keyfield(e){
		ISNLogger.log("keydown caught");
		var keycode=e.keyCode;
		if (keycode===13){
			ISNLogger.log("keydown is enter");
			login();
		}	
	}
	
	function login(){
		var authenticationModel = self.controller.models['authentication'];
		var email=$("#username").val();
		var password=$("#password").val();
		authenticationModel.authenticateUser(email, password);			
	}
};


LoginView.prototype.openDiv=openView;

LoginView.prototype.open = function(){
	this.update();
	this.openDiv();
};

LoginView.prototype.update = function(){

};
LoginView.prototype.closeDiv=closeView;

LoginView.prototype.close=function(){
	$('#username').val("");
	$('#password').val("");
	this.closeDiv();
};

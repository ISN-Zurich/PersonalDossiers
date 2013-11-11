function LoginView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="loginFormContainer";
		
	$("#loginButton").bind("click", function(){
		var authenticationModel = self.controller.models['authentication'];
		var email=$("#username").val();
		var password=$("#password").val();
		authenticationModel.authenticateUser(email, password);			
	});
	
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

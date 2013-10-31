function LoginView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="login";
		
	$("#loginButton").bind("click", function(){
		var authenticationModel = self.controller.models['authentication'];
		var email=$("#username").val();
		var password=$("#password").val();
		authenticationModel.authenticateUser(email, password);			
	});
	
};


LoginView.prototype.openDiv=openView;

LoginView.prototype.open = function(){
	$('#delete').hide();
	$("#findinformation").hide();
	$("#socials").hide();
	$("#landingView").removeClass("hide");
	console.log("open in LoginView");
	this.update();
	$('#'+this.tagID).removeClass("hidden");
};

LoginView.prototype.update = function(){

};

LoginView.prototype.close=function(){
	$('#'+this.tagID).addClass("hidden");
	$('#username').val("");
	$('#password').val("");
};

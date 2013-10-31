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
	//load data when we open the login view from the interaction box and not when we first launch the service
	//self.controller.models.authentication.loadData();
};

LoginView.prototype.update = function(){

};

LoginView.prototype.close=function(){
	$('#'+this.tagID).addClass("hidden");
	$('#username').val("");
	$('#password').val("");
};

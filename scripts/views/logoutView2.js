function LogoutView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="delete";
	$("#delete").bind("click", function(){
		console.log("clicked the logout button");
		//window.location.href="user.html";
		var authenticationModel = self.controller.models['authentication'];
		authenticationModel.logout();			
	});
}

LogoutView.prototype.openDiv=openView;

LogoutView.prototype.open = function(){};

LogoutView.prototype.close = function(){};



function LogoutView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="delete";
	this.open();
	$("#delete").bind("click", function(){
		ISNLogger.log("clicked the logout button");
		self.controller.logout();			
	});
	
}

LogoutView.prototype.openDiv=openView;

LogoutView.prototype.open = function(){
	//das logout button hier dynamisch generieren, wenn es keine logut button auf der Seite gibt.
	//1. zeigt den Logout Button
	this.update();
	
};

LogoutView.prototype.update = function(){
    $('#delete').empty();
    ISNLogger.log("design dynamically logout button");
    var p = $("<p/>", {
	"class": "bold active clickable",
	"text": "Logout"
    }).appendTo("#delete");
    
};

LogoutView.prototype.close = function(){
	//2. Verstecken den Logout Button
    
};

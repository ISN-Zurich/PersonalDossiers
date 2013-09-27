
/*jslint vars: true, sloppy: true */

function LogoutView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="delete";
	this.open();
	$("#delete").bind("click", function(){
		console.log("clicked the logout button");
		self.controller.logout();			
	});
	
}

LogoutView.prototype.openDiv=openView;

LogoutView.prototype.open = function(){
	//das logut button hier dynamisch generieren, wenn es keine logut button auf der Seite gibt.
	//1. zeigt den Logout Button
	this.update();
	
};

LogoutView.prototype.update = function(){
    $('#delete').empty();
    console.log("design dynamically logout button");
    p = $("<p/>", {
	"class": "bold active clickable",
	"text": "Logout"
    }).appendTo("#delete");
    
};

LogoutView.prototype.close = function(){
	//2. Verstecken den Logout Button
    
};

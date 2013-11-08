/*jslint vars: true, sloppy: true */

function addEmbedButton(controller){
	
	console.log("enter add embed button");
	var self=this;
	self.controller=controller;
	self.tagID="addEmbedBtn";
		
	$("#addEmbedBtn").bind("click", function(e){
		console.log("clicked the add Embed button");
	});
	
}

addEmbedButton.prototype.openDiv=openView;

addEmbedButton.prototype.open= function(){
	console.log("open add embed View");
	this.update();
	this.openDiv();
};

addEmbedButton.prototype.update= function(){
		
};

addEmbedButton.prototype.closeDiv=closeView;

addEmbedButton.prototype.close= function(){
	console.log("close add embed view");
	this.closeDiv();
};
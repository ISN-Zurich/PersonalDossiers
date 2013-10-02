/*jslint vars: true, sloppy: true */


function AddDossierView(controller){
	console.log("enter AddDossierView");
	var self=this;
	self.controller=controller;
	self.tagID="addDossier";
	this.open();
	
	$("#addDossier").bind("click", function(e){
		console.log("clicked the add Dossier button");
		self.controller.models.dossierList.addDossier();
	});
		
} //end of constructor



AddDossierView.prototype.openDiv=openView;

AddDossierView.prototype.open= function(){
	console.log("open add Dossier View");
	this.update();
	
};

AddDossierView.prototype.update= function(){
	
	p1=$("<p/>",{
		"class": "bold clickable",
		"id":"addDossierBtn",
		"text": "add a new Dossier"
	}).appendTo("#addDossier");
	console.log("designed the add dossier button");
};

AddDossierView.prototype.closeDiv=closeView;

AddDossierView.prototype.close= function(){
	console.log("close add dossier view");
	this.closeDiv();
};
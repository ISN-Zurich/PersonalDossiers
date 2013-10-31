/*jslint vars: true, sloppy: true */


function AddDossierView(controller){
	console.log("enter AddDossierView");
	var self=this;
	self.controller=controller;
	self.tagID="addDossier";
		
	$("#addDossier").bind("click", function(e){
		console.log("clicked the add Dossier button");
		self.controller.models.dossierList.addDossier();
	});
		
} //end of constructor



AddDossierView.prototype.openDiv=openView;

AddDossierView.prototype.open= function(){
	console.log("open add Dossier View");
	this.update();
	$('#'+this.tagID).show();
};

AddDossierView.prototype.update= function(){
	
	
};

AddDossierView.prototype.closeDiv=closeView;

AddDossierView.prototype.close= function(){
	console.log("close add dossier view");
	this.closeDiv();
};
/*jslint vars: true, sloppy: true */

function addDossierView(controller){
	ISNLogger.log("enter AddDossierView");
	var self=this;
	self.controller=controller;
	self.tagID="addDossierBtn";
		
	$("#addDossierBtn").bind("click", function(e){
		ISNLogger.log("clicked the add Dossier button");
		self.controller.models.dossierList.addDossier();
	});

		
}//end of constructor



addDossierView.prototype.openDiv=openView;

addDossierView.prototype.open= function(){
	ISNLogger.log("open add Dossier View");
	this.update();
	this.openDiv();
};

addDossierView.prototype.update= function(){
		
};

addDossierView.prototype.closeDiv=closeView;

addDossierView.prototype.close= function(){
	ISNLogger.log("close add dossier view");
	this.closeDiv();
};

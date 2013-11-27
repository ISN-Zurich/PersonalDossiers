/*jslint vars: true, sloppy: true */
function bookmarkView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="bookmarkList";	
	
	$(document).bind('DossierListUpdate', function(){
		console.log("bound dossier list update in bookmark view");
		self.open();
	});
}

bookmarkView.prototype.openDiv=openView;

bookmarkView.prototype.open = function(){
	this.update();
	
	this.openDiv();
};

bookmarkView.prototype.update = function(){
	var self=this;
	
	var dossierListModel=self.controller.models.dossierList;
	
	if (dossierListModel.listIsPresent()){
		dossierListModel.reset();
		dossierId=dossierListModel.getDossierId();
	
	do {
		this.renderDossierItem();
		
	} while (dossierListModel.nextDossier());
	
	}
};

bookmarkView.prototype.renderDossier=function(){
	
	console.log("enter render Dossier");
	
	var bookmarkModel = self.controller.models.bookmark;
	var dossierListModel=self.controller.models.dossierList;
	var	dossierID = self.controller.models.dossierList.getDossierId();
		

	var li=$("<li/>", {
		"id": "item"+dossierID,
		"class":"liItem"
	}).appendTo("#bookmarkList");
	

	divA=$("<a/>", {
		"class": "dossierItemText",
		//"href":bookmarkModel.getISNURL(), 
		//"text":bookmarkModel.getTitle(),
		"text":self.controller.models.dossierList.getDossierTitle(),
		"target": "_blank"
	}).appendTo(li);	
};



bookmarkView.prototype.closeDiv= function(){};

bookmarkView.prototype.close = function(){
	this.closeDiv();	
};
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
	
	$("#bookmarkList").empty();
	
	if (dossierListModel.listIsPresent()){
		dossierListModel.reset();
		dossierId=dossierListModel.getDossierId();
	
	do {
		this.renderDossier();
		
	} while (dossierListModel.nextDossier());
	
	}
};

bookmarkView.prototype.renderDossier=function(){
	
	console.log("enter render Dossier");
	
	var bookmarkModel = self.controller.models.bookmark;
	var dossierListModel=self.controller.models.dossierList;
	var	dossierID = self.controller.models.dossierList.getDossierId();
	var isFollowedDossier = dossierListModel.isFollowedDossier();
	
	if (!isFollowedDossier){
	
	var div1=$("<div/>", {
	"id": "item"+dossierID,
		"class":"clickable pd_editDossier bookmarkItem"
	}).appendTo("#bookmarkList");
	
	
	var div2=$("<div/>", {
		"class":"grey_bar st clickable",
		"text":self.controller.models.dossierList.getDossierTitle()
	}).appendTo(div1);
	
	var span=$("<span/>", {
		"class":"st_editDosser iconMoon",
		"text": "K"
	}).appendTo(div2);
	}
	
};



bookmarkView.prototype.closeDiv= function(){};

bookmarkView.prototype.close = function(){
	this.closeDiv();	
};
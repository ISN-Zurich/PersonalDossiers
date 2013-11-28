/*jslint vars: true, sloppy: true */
function bookmarkView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="bookmarkList";	
	
	//will move the binding of the dossier list update to the librarybookmark model
	// it will load the bookmarkedossiers, and when this is ready, the bookmark view will open
//	$(document).bind('DossierListUpdate', function(){
//		console.log("bound dossier list update in bookmark view");
//		self.open();
//	});
	
	$(document).bind('BookmarkedDossierListUpdate', function(){
	console.log("bound bookmarked dossier list update in bookmark view");
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

		var height=	$("#bookmarkContainer").height();
		this.controller.notifyNewHeight(height);
	}
	
};

bookmarkView.prototype.renderDossier=function(){
	
	console.log("enter render Dossier");
	
	var bookmarkModel = self.controller.models.bookmark;
	var dossierListModel=self.controller.models.dossierList;
	var	dossierID = self.controller.models.dossierList.getDossierId();
	var isFollowedDossier = dossierListModel.isFollowedDossier();
	var library_id= self.controller.library_item_id;
	console.log("library id is "+library_id);

	if (!isFollowedDossier){

		var div1=$("<div/>", {
			"id": "item"+dossierID,
			"class":"clickable pd_editDossier bookmarkItem"
		}).appendTo("#bookmarkList");


		var div2=$("<div/>", {
			"class":"pd_bookmarked_bar st clickable",
			//"class":!bookmarkModel.hasItem(library_id) ? "grey_bar st clickable" : "pd_bookmarked_bar st clickable",
					"text":self.controller.models.dossierList.getDossierTitle()
		}).appendTo(div1);

		var span=$("<span/>", {
			"class":"st_editDosser st_bookmarked iconMoon",
			//"class":!bookmarkModel.hasItem(library_id) ? "st_editDosser st_unbookmarked iconMoon" : "st_editDosser st_bookmarked iconMoon",
					"text": "K"
		}).appendTo(div2);
	}
	
};



bookmarkView.prototype.closeDiv= function(){};

bookmarkView.prototype.close = function(){
	this.closeDiv();	
};
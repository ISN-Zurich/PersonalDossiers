/*jslint vars: true, sloppy: true */
function bookmarkView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="bookmarkList";	
	self.libBookmarkModel=self.controller.models.bookmarkDossier;
		
	//will move the binding of the dossier list update to the librarybookmark model
	// it will load the bookmarkedossiers, and when this is ready, the bookmark view will open
//	$(document).bind('DossierListUpdate', function(){
//		ISNLogger.log("bound dossier list update in bookmark view");
//		self.open();
//	});
	
	$(document).bind('BookmarkedDossierListUpdate', function(){
		ISNLogger.log("bound bookmarked dossier list update in bookmark view");
		self.open();
	});
	
	$("#bookmarkList").bind("click", function(e){
		var targetE = e.target.nodeName;
		ISNLogger.log("target clicked "+targetE);
		if ($(targetE)){
			var targetID = e.target.id;
			ISNLogger.log("targetID is "+targetID);
			var dossierID = targetID.substring(4);
			ISNLogger.log("dossier ID is "+dossierID);
			self.libBookmarkModel.addItem(dossierID);
		}
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

		ISNLogger.log("passed the design of the bookmarks list");
		var height=	$("#bookmarkContainer").outerHeight();
		ISNLogger.log("height of bookmark container is "+height);
		this.controller.notifyNewHeight(height);
	}
	
	
	
	
};

bookmarkView.prototype.renderDossier=function(){
	
	ISNLogger.log("enter render Dossier");
	
	var libraryBookmarkModel = self.controller.models.bookmarkDossier;
	var dossierListModel=self.controller.models.dossierList;
	var	dossierID = self.controller.models.dossierList.getDossierId();
	var isFollowedDossier = dossierListModel.isFollowedDossier();
	var library_id= self.controller.library_item_id;
	ISNLogger.log("dossier id in render dossier is"+dossierID);
	ISNLogger.log("library id is "+library_id);

	if (!isFollowedDossier){
		ISNLogger.log("is not a following dossier, passed design");
		
		var div1=$("<div/>", {
			//"id": "item"+dossierID,
			"class":"clickable pd_editDossier bookmarkItem"
			
		}).appendTo("#bookmarkList");


		var div2=$("<div/>", {
			"id": "item"+dossierID,
			"class":"st clickable overflowText grey_bar",
			"text":self.controller.models.dossierList.getDossierTitle()
		}).appendTo(div1);
	
//		var tspan = $("<span/>", {
//			"id":"item"+dossierID,
//			"class": "overflowText bookmarkButtonText",
//			"text":self.controller.models.dossierList.getDossierTitle()
//		}).appendTo(div2);

		var span=$("<span/>", {
					"id": "icon"+ dossierID,
					"class":libraryBookmarkModel.hasItem(dossierID) ? "st_editDosser pd_bookmark_icon_exist iconMoon" : "st_editDosser pd_bookmark_icon iconMoon",
					"text": "K"
		}).appendTo(div2);
	
	}
	
};



bookmarkView.prototype.closeDiv= function(){};

bookmarkView.prototype.close = function(){
	this.closeDiv();	
};
/***
 * Design the overview page of the dossier.
 * This contains the list of the items of the dossier (publication, audio, video, articles)
 * */

function DossierContentView(dController){
	var self=this;
	self.controller=dController;
	self.tagID = 'contentArea';

	self.deleteMode = 0;
	$(document).bind("click", deleteClickHandler);
	$(window).bind("click", function(){
		// rescue click to cancel a delete request
		if (self.deleteMode > 0) {
			$('#delete-confirm-'+self.deleteMode).hide();
			$('#delete-'+self.deleteMode).show();
			self.deleteMode = 0;
		}
	});
	
	$(window).bind('keydown', function(e){
		if (e.keyCode == 27 && self.deleteMode > 0) {
			$('#delete-confirm-'+self.deleteMode).hide();
			$('#delete-'+self.deleteMode).show();
			self.deleteMode = 0;
		}
	});
	
	function deleteClickHandler(e) {
		var targetE = e.target;
		var targetID = targetE.id;
		if($(targetE).hasClass("deleteButton") ) {
			self.deleteMode = true;
			var myID = targetID.substring(7);
			self.deleteMode = myID;
			$(targetE).hide();
			$("#delete-confirm-" + myID).show();
			e.stopPropagation();
		}
		else if ($(targetE).hasClass("deleteConfirmButton")) {
			// get rid off the element 
			var myID = targetID.substring(15);
			self.removeItem(myID);
			self.deleteMode = 0;
			e.stopPropagation();
		}
	};
}


/**
 * opens the view
 * @prototype
 * @function openDiv
 **/ 
DossierContentView.prototype.openDiv = openView;

DossierContentView.prototype.open = function() {
	$("#contentArea").empty();
	$("#delete").removeClass("hidden");
	console.log("open dossier list view");
	this.renderList();
	this.openDiv();
};

/**
 * closes the view
 * @prototype
 * @function closeDiv
 **/ 
DossierContentView.prototype.closeDiv = closeView;


/**
 * empties the course list
 * @prototype
 * @function close
 **/ 
DossierContentView.prototype.close = function() {
	moblerlog("close course list view");
	this.active = false;
	this.closeDiv();
	$("#contentArea").empty();
};




//rename to renderItemList
DossierContentView.prototype.renderList = function() {
	
	var bookmarkModel = self.controller.models['bookmark'];
	console.log("dossier list length in dossier content view "+bookmarkModel.dossierList.length);
	
	// we need to get the dossier list for the active dossier
	// bookmark.getDossierList();
		
	//Design Content Area
	if (bookmarkModel.dossierList && bookmarkModel.dossierList.length > 0) {
		//console.log("dossier list is "+JSON.stringify(bookmarkModel.dossierList));
		console.log("dossier list index is "+bookmarkModel.index);
		for (bookmarkModel.index=0; bookmarkModel.index < bookmarkModel.dossierList.length; bookmarkModel.index++){
			this.renderItem();
			bookmarkModel.setIndex(bookmarkModel.index++);
		}
//		do{
//			this.renderItem();
//			
//		}while (bookmarkModel.nextItem());
	//	}while (bookmarkModel.index<bookmarkModel.dossierList.length);
	}
};


DossierContentView.prototype.renderItem = function() {
	//var self=this;

	var bookmarkModel = self.controller.models['bookmark'];
	
	console.log("enter render Item");
	var	dossierID = self.controller.models['bookmark'].getItemId();
	console.log("dossier item id is"+dossierID);
	var div1=$("<div/>", {
		"id": "item"+dossierID, //to get the itemID dynamically from the model
		"class" : "column featured2 hideOT dossier_item "
	}).appendTo("#contentArea");
	
	var divFloat=$("<div/>", {
		"class" : "floatleft"
	}).appendTo(div1);
	
	var divA=$("<a/>", {
		"href":bookmarkModel.getISNURL()
	}).appendTo(divFloat);
	
	var img=$("<img/>", {
		"class" : "floatleft",
		"src": bookmarkModel.getThumbnail(),
		"width":"80",
		"height":"60"
	}).appendTo(divA);
	
	var divFloatText=$("<div/>", {
		"class" : "floatleft overviewcontent dossier_text"
	}).appendTo(div1);
	
	var divh1=$("<h1/>", {	}).appendTo(divFloatText);
	
	var divAText=$("<a/>", {
		"class": "header1",
		"href":bookmarkModel.getISNURL(), 
		text:bookmarkModel.getTitle()
	}).appendTo(divh1);
	
	var divp1=$("<p/>", {
		"class":"small",
		text:bookmarkModel.getDate()+"/"+bookmarkModel.getType() 
	}).appendTo(divFloatText);
	
	var divp2=$("<p/>", {
		text:bookmarkModel.getDescription()
	}).appendTo(divFloatText);
	
	var div3 = $("<div/>", {
		class:"deletecontainer"
	}).appendTo(divFloatText);
	
	var delButton = $("<div/>", {
		id: "delete-"+ dossierID,
		text: "Delete",
		"class": "deleteButton"
	}).appendTo(div3);
	
	var delConfirmButton = $("<div/>", {
		id: "delete-confirm-" + dossierID,
		text: "Really delete?",
		"class": "deleteConfirmButton"
	}).appendTo(div3);
	
	var lastbr1=$("<br/>", {
		
	}).appendTo(divFloatText);
	var lastbr2=$("<br/>", {
		
	}).appendTo(divFloatText);
	
}
/**
 *	In this function we delete a dossier item by performing two tasks
 *	1. Remove its visual representation
 *	2. Actual remove it by deleting the data from the database
 */

DossierContentView.prototype.removeItem=function(id){
	var bookmarkModel = self.controller.models['bookmark'];
	//call the model removeBookmark()
	bookmarkModel.removeItem(id);	
	// remove the visuals
	$("#item"+ id).remove();
};


DossierContentView.prototype.arrangeItem=function(id){
	// call the model removeBookmark()
		// remove the visuals
	$("#item"+ id).remove();
};

/**
 * This View contains the list of items of a dossier plus the dossier title on top.
 * 
 */

/*jslint vars: true, sloppy: true */
function badgeView(dController){
	var self=this;
	self.controller=dController;
	self.tagID = 'badgeArea';
	
	$("#pd_footer_gen").bind("click", function(){
		window.open(
				'http://yellowjacket.ethz.ch/tools/index.html',
				'_blank' 
		);
	});	
		
}


/**
 * opens the view
 * @prototype
 * @function openDiv
 **/ 
badgeView.prototype.openDiv = openView;

badgeView.prototype.open = function() {
	this.update();
	this.openDiv();
};



badgeView.prototype.update= function(){
	
	var self=this;
	var bookmarkModel= self.controller.models.bookmark;

	var titleContainer=$("<h4/>", {
		"id":"titleContainer",
		"class":"widget-title"
	}).prependTo("#badgeArea");


	var span=$("<span/>", {
		"id":"headerTitle",
		text:bookmarkModel.getDossierTitle()
	}).appendTo(titleContainer);
	
    this.renderBadgeList();
	
};

/**
 * closes the view
 * @prototype
 * @function closeDiv
 **/ 
badgeView.prototype.closeDiv = closeView;


/**
 * empties the course list
 * @prototype
 * @function close
 **/ 
badgeView.prototype.close = function() {
	moblerlog("close course list view");
	this.active = false;
	this.closeDiv();
	$("#badgeArea").empty();
};


badgeView.prototype.renderBadgeList = function() {
	
	var bookmarkModel = self.controller.models.bookmark;
	console.log("dossier list length in dossier content view "+bookmarkModel.dossierList.length);
	
	//calculate ul height
	
	var iFrameHeight= window.innerHeight || document.documentElement.clientHeight;
	var headerHeight= $("#badgeHeader").height();
	var titleHeight= $("#titleContainer").height();
	var footerHeight = $("#pd_footer_gen").height();
	var totalHeight = headerHeight + titleHeight + footerHeight + 15;
	

	if (bookmarkModel.dossierList && bookmarkModel.dossierList.length > 0) {
		
		console.log("dossier list index is "+bookmarkModel.index);
		for (bookmarkModel.index=0; bookmarkModel.index < bookmarkModel.dossierList.length; bookmarkModel.index++){
			this.renderItem();
			bookmarkModel.setIndex(bookmarkModel.index++);
		}
	
	} else{
		//if the specific dossier has no dossier items
		console.log("the dossier has no dossier items");
		var div=$("<div/>", {
	    	"id":"noContent"
	        }).appendTo("#badgeArea");
		var p=$("<p/>", {
	    	"text": "Your Dossier has no items. You can add items  to the personal dossier if you go to http://isn.ethz.ch/. In there, under both the dossiers and the digital library menus there are various content items. If you enter in the ones you are interested in you will see an addBookmark button on the right side. By clicking on it, this item will be added to your active dossier"
	        }).appendTo(div);
	}
	var ulHeight=iFrameHeight - totalHeight;
	console.log("ulheight is "+ulHeight);
	$("#subnavi").css("height",ulHeight+"px" );
	
};


badgeView.prototype.renderItem = function() {
	//var self=this;

	var bookmarkModel = self.controller.models.bookmark;
	
	console.log("enter render Item");
	var	dossierID = self.controller.models.bookmark.getItemId();
	console.log("dossier item id is"+dossierID);
	

	var li=$("<li/>", {
		"id": "item"+dossierID,
		"class":"liItem"
	}).appendTo("#subnavi");
	

	divA=$("<a/>", {
		"class": "dossierItemText",
		"href":bookmarkModel.getISNURL(), 
		"text":bookmarkModel.getTitle(),
		"target": "_blank"
	}).appendTo(li);
	


};
/**
 *	In this function we delete a dossier item by performing two tasks
 *	1. Remove its visual representation
 *	2. Actual remove it by deleting the data from the database
 */

badgeView.prototype.removeItem=function(id){
	var bookmarkModel = self.controller.models.bookmark;
	//call the model removeBookmark()
	bookmarkModel.removeItem(id);	
	// remove the visuals
	$("#item"+id).remove();
};


badgeView.prototype.arrangeItem=function(id){
	// call the model removeBookmark()
		// remove the visuals
	$("#item"+ id).remove();
};


//the following function is used to display an error message
//when the contents of a dossier cannot be displayed because it is private

badgeView.prototype.loadErrorMessage = function(){
	var divError=$("<div/>", {
		"id": "dossiersError",
		"class":"errorDossiers",
		text: "Sorry you don't have permission to access the contents of this Dossier because it is private"
	}).appendTo("#contentArea");	
};
	
	

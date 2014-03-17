/**
 * This View contains the list of items of a dossier plus the dossier title on top.
 * 
 */

/*jslint vars: true, sloppy: true */
function BadgeView(dController){
	var self=this;
	self.controller=dController;
	self.tagID = 'badgeArea';
	
	$("#pd_footer_gen, #badgeHeader").bind("click", function(){
		window.open(
				baseURL()+ 'index.html',
				'_blank' 
		);
	});		
}

/**
 * opens the view
 * @prototype
 * @function openDiv
 **/ 
BadgeView.prototype.openDiv = openView;

/**
 * 
 */
BadgeView.prototype.open = function() {
	this.update();
	this.openDiv();
};

/**
 * 
 */
BadgeView.prototype.update= function(){
	var self=this;
	var bookmarkModel= self.controller.models.bookmark;

	var titleContainer=$("<h4/>", {
		"id":"titleContainer",
		"class":"widget-title"
	}).prependTo("#badgeArea");
        
    $('<a/>', {'href':hostURL() + '?id=' + this.controller.pubid, 'text': bookmarkModel.getDossierTitle(), 'target': '_blank' }).appendTo(titleContainer);
    
    this.renderBadgeList();
};

/**
 * closes the view
 * @prototype
 * @function closeDiv
 **/ 
BadgeView.prototype.closeDiv = closeView;

/**
 * empties the course list
 * @prototype
 * @function close
 **/ 
BadgeView.prototype.close = function() {
	moblerlog("close course list view");
	this.active = false;
	this.closeDiv();
	$("#badgeArea").empty();
};

BadgeView.prototype.renderBadgeList = function() {
	var bookmarkModel = self.controller.models.bookmark;
	ISNLogger.log("dossier list length in dossier content view " + bookmarkModel.dossierList.length);
	
	//calculate ul height
	
	var iFrameHeight = window.innerHeight || document.documentElement.clientHeight;
	var headerHeight = $("#badgeHeader").height();
	var titleHeight = $("#titleContainer").height();
	var footerHeight = $("#pd_footer_gen").height();
	var totalHeight = headerHeight + titleHeight + 2*footerHeight + 10;

	if (bookmarkModel.dossierList && bookmarkModel.dossierList.length > 0) {
		ISNLogger.log("dossier list index is " + bookmarkModel.index);
		for (bookmarkModel.index=0; bookmarkModel.index < bookmarkModel.dossierList.length; bookmarkModel.index++){
			this.renderItem();
			bookmarkModel.nextItem();
		} 
	} 
    else{
		//if the specific dossier has no dossier items
		ISNLogger.log("the dossier has no dossier items");
		var div = $("<div/>", {
	    	"id":"noContent"
	        }).appendTo("#badgeArea");
		var p=$("<p/>", {
	    	"text": "This dossier has no entries"
	        }).appendTo(div);
	}
    
	var ulHeight = iFrameHeight - totalHeight;
	ISNLogger.log("ulheight is " + ulHeight);
	$("#subnavi").css("height", ulHeight + "px" );	
};

/**
 * 
 */
BadgeView.prototype.renderItem = function() {
	var bookmarkModel = self.controller.models.bookmark;
	
	ISNLogger.log("enter render Item");
	var	dossierID = self.controller.models.bookmark.getItemId();
	ISNLogger.log("dossier item id is"+dossierID);
	
	var li=$("<li/>", {
		"id": "item"+dossierID,
		"class":"liItem"
	}).appendTo("#subnavi");
	
	divA=$("<a/>", {
		"class": "dossierItemText",
		"href": bookmarkModel.getISNURL(), 
		"text": bookmarkModel.getTitle(),
		"target": "_blank"
	}).appendTo(li);
};

/**
 *	In this function we delete a dossier item by performing two tasks
 *	1. Remove its visual representation
 *	2. Actual remove it by deleting the data from the database
 */
BadgeView.prototype.removeItem=function(id){
	var bookmarkModel = self.controller.models.bookmark;
	//call the model removeBookmark()
	bookmarkModel.removeItem(id);	
	// remove the visuals
	$("#item"+id).remove();
};

/**
 * 
 */
BadgeView.prototype.arrangeItem=function(id){
	// call the model removeBookmark()
		// remove the visuals
	$("#item"+ id).remove();
};

/**
 * the following function is used to display an error message
 * when the contents of a dossier cannot be displayed because it is private 
 */
BadgeView.prototype.loadErrorMessage = function(){
	var divError=$("<div/>", {
		"id": "dossiersError",
		"class":"errorDossiers",
		text: "Sorry you don't have permission to access the contents of this Dossier because it is private"
	}).appendTo("#contentArea");	
};

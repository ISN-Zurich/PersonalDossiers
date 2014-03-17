/*jslint vars: true, sloppy: true */

function DetailEmbedView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="contentFrame";
	self.dossier_id=self.controller.getHashedURLId();
	
	$("#dossiercontentHeader").bind("click", function(){
		window.location.href ="embedPageBig.html?id="+self.dossier_id;	
	});
}

DetailEmbedView.prototype.openDiv = openView;
DetailEmbedView.prototype.closeDiv= closeView;

DetailEmbedView.prototype.open = function(){
    this.updateNavigation()
	this.updateContent();
	this.openDiv();
};

/**
 * @method close()
 * 
 * close handler called by the controller before switching to a different view.
 */
DetailEmbedView.prototype.close = function() {
    this.resetNavigation();
    this.closeDiv();
};

/**
 * @method resetNavigation()
 * 
 * when navigating away from the details, the embed navigation must be properly reset.
 */
DetailEmbedView.prototype.resetNavigation = function() {
    $("#dossiercontentHeader").text("Personal Dossiers");
};

DetailEmbedView.prototype.updateNavigation = function() {
    $("#dossiercontentHeader").text("Back to Personal Dossiers");
};

DetailEmbedView.prototype.updateContent = function(){
	var self=this;
	var item_id= self.controller.getdossierItemId();
	var bookmarkModel=self.controller.models.bookmark;
	var authorsList=bookmarkModel.getAuthorList();
	ISNLogger.log("authorlist is "+bookmarkModel.getAuthorList());
	
	var authors        = bookmarkModel.showAuthors();
	var dossierTitle   = bookmarkModel.getTitle();
	var date           = bookmarkModel.getDate();
	var publisherTitle = bookmarkModel.getPublisher();
	
	$("#titleValue").text(dossierTitle);
	$("#publisherValue").text(publisherTitle);
	$("#authorValue").text(authors);
	$("#dateValue").text(date);
	
	ISNLogger.log("id of the clicked item is "+item_id);
	var url=baseURL()+"service/streamtest.php?id="+item_id;
	iFrame = $("<iframe/>", {
		"scrolling": "no",
		"class": "embediFrameBig",
		"src": url		
	}).appendTo("#contentFrame");
	
	var iFrameHeight= window.innerHeight || document.documentElement.clientHeight;
	var headerHeight= $("#dossiercontentHeader").height();
	var metadataHeight= $("#metadataPdf").height();
	var footerHeight = $("#pd_footer_gen").height();
	var totalHeight = headerHeight + footerHeight + metadataHeight + 40; 
	var contentFrameHeight=iFrameHeight - totalHeight;
	ISNLogger.log("ulheight is "+contentFrameHeight);
	$("#contentFrame").css("height",contentFrameHeight+"px" );
};

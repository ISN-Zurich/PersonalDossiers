/*jslint vars: true, sloppy: true */

function DetailEmbedView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="pd_embed_details";
	self.dossier_id=self.controller.getHashedURLId();
	
	$("#dossiercontentHeader").bind("click", function(e){
        self.controller.openDossier();
        e.preventDefault();
		// window.location.href ="embedPageBig.html?id="+self.dossier_id;	
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
    $("#dossiercontentHeader").removeClass('clickable');
    $("#dossiercontentHeader").text("ISN Personal Dossiers");
};

DetailEmbedView.prototype.updateNavigation = function() {
    $("#dossiercontentHeader").addClass('clickable');
    $("#dossiercontentHeader").text("Back to Dossier");
};

DetailEmbedView.prototype.updateContent = function(){
	var self=this;
    
    $("#pd_embed_details").empty();
    
	// var item_id= self.controller.getDossierItemId();
    var iFrame;
	var bookmarkModel=self.controller.models.bookmark;
    var item_id = bookmarkModel.getItemId();
    var item_type = bookmarkModel.getType();
    var item_url = bookmarkModel.getEmbedURL();
    if ( item_type === 'Publication' ) {
        // create the meta data block
        $("#pd_embed_details").html('<div id="metadataPdf"><div id="titlePdfContainer" class="metadataItem"><span id="titleLabel" class="metadataLabel"> Title: </span><span id="titleValue"> </span></div><div id="publisherContainer" class="metadataItem"><span id="publisherLabel" class="metadataLabel">Publisher:  </span><span id="publisherValue" ></span></div><div id="authorContainer" class="metadataItem"><span id="authorLabel" class="metadataLabel">Author(s):  </span><span id="authorValue"></span></div><div id="dateContainer" class="metadataItem"><span id="dateLabel" class="metadataLabel">Date:  </span><span id="dateValue" ></span></div></div>');
    
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

	   iFrame = $("<iframe/>", {
          "id": "contentFrame",
		  "scrolling": "no",
		  "class": "embediFrameBig",
		  "src": item_url		
	   }).appendTo("#pd_embed_details");
    }
    else {
        iFrame = $("<iframe/>", {
            "id": "contentFrame",
            "scrolling": "auto",
		  "class": "embediFrameBig",
		  "src": item_url		
	   }).appendTo("#pd_embed_details");
    }
	
	var iFrameHeight= window.innerHeight || document.documentElement.clientHeight;
	var headerHeight= $("#dossiercontentHeader").height();
	var metadataHeight= $("#metadataPdf").height() || 0;
	var footerHeight = $("#pd_footer_gen").height();
	var totalHeight = headerHeight + footerHeight + metadataHeight;// + 40; 
	var contentFrameHeight= iFrameHeight - totalHeight;
	ISNLogger.log("ulheight is "+contentFrameHeight);
	$("#contentFrame").css("height",contentFrameHeight+"px" );
};

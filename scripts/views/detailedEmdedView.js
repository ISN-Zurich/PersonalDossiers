/*jslint vars: true, sloppy: true */

function detailEmbedView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="contentFrame";
}


detailEmbedView.prototype.openDiv=openView;

detailEmbedView.prototype.open = function(){
	this.update();
	this.openDiv();
};


detailEmbedView.prototype.update = function(){
	
	var self=this;
	var item_id= self.controller.getdossierItemId();
	var dossier_id= self.controller.getHashedURLId();
	var bookmarkModel=self.controller.models.bookmark;
	var authorsList=bookmarkModel.getAuthorList();
	console.log("authorlist is "+bookmarkModel.getAuthorList());
	
//	author = $("<span/>", {
//		"class": "",
//		"text": authorsList[0]+", "+authorsList[1]
//	}).appendTo("#metadataPdf");
	$("#authorValue").text(authorsList[0]+","+ authorsList[1]);
	
	console.log("id of the clicked item is "+item_id);
	var url="http://yellowjacket.ethz.ch/tools/service/streamtest.php?id="+item_id;
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
	console.log("ulheight is "+contentFrameHeight);
	$("#contentFrame").css("height",contentFrameHeight+"px" );
};

detailEmbedView.prototype.closeDiv = closeView;

detailEmbedView.prototype.close = function(){
	
	this.closeDiv();
};
/*jslint vars: true, sloppy: true */

function detailEmbedView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="contentFrame";
	self.open();
}


detailEmbedView.prototype.openDiv=openView;

detailEmbedView.prototype.open = function(){
	this.update();
	this.openDiv();
};


detailEmbedView.prototype.update = function(){
	
	var self=this;
	var id= self.controller.getHashedURLId();
	console.log("id of the clicked item is "+id);
	var url="http://yellowjacket.ethz.ch/tools/service/streamtest.php?id="+id;
	iFrame = $("<iframe/>", {
		"scrolling": "no",
		"class": "embediFrameBig",
		"src": url		
	}).appendTo("#contentFrame");
	

};

detailEmbedView.prototype.closeDiv = closeView;

detailEmbedView.prototype.close = function(){
	
	this.closeDiv();
};
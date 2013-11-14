/*jslint vars: true, sloppy: true */

function addEmbedButton(controller){
	
	console.log("enter add embed button");
	var self=this;
	self.controller=controller;
	self.tagID="embedView";
		
	$("#addEmbedBtn").bind("click", function(e){
		console.log("clicked the add Embed button");
		self.update();
		$("#dropdown_embed").show();
	});
	
}

addEmbedButton.prototype.openDiv=openView;

addEmbedButton.prototype.open= function(){
	console.log("open add embed View");
	//this.update();
	this.openDiv();
};

addEmbedButton.prototype.update= function(){
	
	console.log("enter update in addEmbedd button");
		
	var self=this;
	var inputContainer=$("<input/>", {
		"type":"text",
		"width":"200px",
		"value":"<iframe src="+"http://yellowjacket.ethz.ch/tools/embedPageBig.html"+ "style="+ "width:475px;height:905px; border: none; overflow:hidden;></iframe>"
	}).appendTo("#dropdown_embed");
	
	
};

addEmbedButton.prototype.closeDiv=closeView;

addEmbedButton.prototype.close= function(){
	console.log("close add embed view");
	this.closeDiv();
};
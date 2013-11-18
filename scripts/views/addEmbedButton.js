/*jslint vars: true, sloppy: true */

function addEmbedButton(controller){
	
	console.log("enter add embed button");
	var self=this;
	self.controller=controller;
	self.tagID="embedView";
		
	$("#addEmbedBtn").bind("click", function(e){
		console.log("clicked the add Embed button");
		self.update();
		$("#inputContainer").select();
		$("#dropdown_embed").show();
	});
	
	
	// TODO: add event handler when click on the content embed button
	// - to show in the input container the link to the big embed html
	
	//TODO:add event handler when click on the badge embed button
	// - to show in the input container the link to the badge html
	
}

addEmbedButton.prototype.openDiv=openView;

addEmbedButton.prototype.open= function(){
	console.log("open add embed View");
	this.openDiv();
};


/** 
 * this function displays the drop-down box that contains
 * all the information and links to the embedded pages
 * by default the link to the content embed is displayed
 * 
 */ 

addEmbedButton.prototype.update= function(){
	
	console.log("enter update in addEmbedd button");
		
	var self=this;
	var dossierId=this.controller.getActiveDossier();

	$("#inputContainer").attr("value","<iframe src=\" "+"http://yellowjacket.ethz.ch/tools/embedPageBig.html?id="+dossierId+"\""+" style= \""+ "width:475px;height:905px; border: none; overflow:hidden; \"></iframe>");
	
	$("#inputContainer").bind("click",function(){
		$("#inputContainer").select();
	});
	
	$("#drop_info").show();

};

addEmbedButton.prototype.closeDiv=closeView;

addEmbedButton.prototype.close= function(){
	console.log("close add embed view");
	this.closeDiv();
};
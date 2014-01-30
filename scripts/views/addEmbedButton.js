/*jslint vars: true, sloppy: true */

function addEmbedButton(controller){
	
	ISNLogger.log("enter add embed button");
	var self=this;
	self.controller=controller;
	self.tagID="embedView";
	self.dossierId=self.controller.getActiveDossier();
		
	$("#addEmbedBtn").bind("click", function(e){
		ISNLogger.log("clicked the add Embed button");
		if ($("#dropdown_embed").is(":visible")){
			$("#dropdown_embed").hide();
		}
		else{
			self.update();
			$("#inputContainer").select();
			$("#dropdown_embed").show();
		}
	});
	
	$("#inputContainer").bind("focus",function(){
		$("#inputContainer").select();
	});

	$("#inputContainer").bind("click",function(){
		$("#inputContainer").select();
	});
	

	$("#contentEmbed").bind("click", function(e){
		$("#inputContainer").attr("value","<iframe scrolling=\"no\" src=\""+ baseURL() +"embedPageBig.html?id="+self.dossierId+"\""+" style= \""+ "width:475px;height:905px; border: none; overflow:hidden; \"></iframe>");
		$("#badgeStyle").removeClass("pd_activeBadge");
		$("#contentEmbed").addClass("pd_activeBadge");
		
	});
	
	$("#badgeStyle").bind("click", function(e){
		$("#inputContainer").attr("value","<iframe scrolling=\"no\" src=\""+baseURL()+"embedBadge.html?id="+self.dossierId+"\""+" style= \""+ "width:250px;height:480px; border: none; overflow:hidden; \"></iframe>");
		$("#contentEmbed").removeClass("pd_activeBadge");
		$("#badgeStyle").addClass("pd_activeBadge");
		
	});
	
}

addEmbedButton.prototype.openDiv=openView;

addEmbedButton.prototype.open= function(){
	ISNLogger.log("open add embed View");
	this.openDiv();
};


/** 
 * this function displays the drop-down box that contains
 * all the information and links to the embedded pages
 * by default the link to the content embed is displayed
 * 
 */ 

addEmbedButton.prototype.update= function(){
	
	ISNLogger.log("enter update in addEmbedd button");
		
	var self=this;
	var dossierId=this.controller.getActiveDossier();
	$("#addEmbedBtn").css("margin-bottom", "1px");
	
	$("#inputContainer").attr("value","<iframe scrolling=\"no\" src=\""+baseURL()+"embedPageBig.html?id="+dossierId+"\""+" style= \""+ "width:475px;height:905px; border: none; overflow:hidden; \"></iframe>");
	
	$("#inputContainer").focus();
	

	
	$("#drop_info").show();

};

addEmbedButton.prototype.closeDiv=closeView;

addEmbedButton.prototype.close= function(){
	ISNLogger.log("close add embed view");
	this.closeDiv();
};

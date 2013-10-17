/*jslint vars: true, sloppy: true */

function WelcomeView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="welcome"; 
	$("#addDossierBtn").bind("click", function(e){
		console.log("clicked the add Dossier button");
		self.controller.models.dossierList.addDossier();
	});
	
}

WelcomeView.prototype.openDiv=openView;

WelcomeView.prototype.open = function(){
	$('#delete').show();
	$('#findinformation').show();
	$('#socials').show();
	$('#addDossier').show();
	$('#dossierListHeader').show();
	console.log("called open of the WelcomeView");
	this.update();
	$('#'+this.tagID).removeClass("hidden");
};

WelcomeView.prototype.update = function(){
	var self=this;
	console.log("update the welcome view");
	
	//empty the sub views
	$("#userProfile").empty();
	$("#notifications").empty();
	$("#welcome").show();
	//$("#welcome").empty();
	
	$("#dossiersUl").empty();
	
	
	if ( self.controller.models.user.userProfile ) {
    	console.log("user profile existis, design welcome view");
	
}
	
		
	if (self.controller.models.dossierList.listIsPresent()) { 
		self.controller.models.dossierList.reset();
		
		console.log("dossier list is present design dossier list - welcome view");
		
		dossierId=self.controller.models.dossierList.getDossierId();
//		ul=$("<ul/>", {
//			"id":"dossiersUl"
//		}).appendTo('#welcome');
		do {
//			 li = $("<li/>", {
//				"class": "dossierCat",
//				"id" : "dossier" + self.controller.models.dossierList.getDossierId(),
//				"text":self.controller.models.dossierList.getDossierTitle()
//			}).appendTo("#dossiersUl");
			 
			div1 =$("<div/>", {
				"class": "column featured2 hideOT dossier_item"
			}).appendTo("#welcome");
			
			
			div2 =$("<div/>", {
				"class": "floatleft"
			}).appendTo(div1);
			
			img=$("<img/>", {
				"class": "floatleft",
				"src":"http://mercury.ethz.ch:80/serviceengine/Files/ISN/160x120/166389/iresourcemultiple_files/a01bc06e-3a33-4f5f-9290-5662c2349516/en/HassanWirajuda160x120.jpg",
				"width":"80px",
				"height":"60px"
			}).appendTo(div2);
			
			div3 =$("<div/>", {
				"class": "floatleft overviewcontent dossier_text"
			}).appendTo(div1);
			
			h1 =$("<h1/>", {
				"id" : "dossier" + self.controller.models.dossierList.getDossierId(),
				"text":self.controller.models.dossierList.getDossierTitle()
			}).appendTo(div3);
			
			pS =$("<p/>", {
				"class":"small",
			    "text": "2013-07-08"
			}).appendTo(div3);
			
			p =$("<p/>", {
				"class":"small",
			    "text": "In this podcast, the former Foreign Minister of Indonesia, Hassan Wirajuda, outlines the thinking behind Jakarta&amp;rsquo;s current &amp;lsquo;free and active&amp;rsquo; foreign policy (bebas aktif); how the policy is shaping its relationships with the US, China and other ASEAN states; and how it might impact Indonesia&amp;rsquo;s 2014 presidential election."
			}).appendTo(div3);
			if (self.controller.oauth){
			divDelContainer =$("<div/>", {
				"class": "deletecontainer"
			}).appendTo(div1);
			
			divDel1 =$("<div/>", {
				"id":"delete-",// dossierID the id of the dossier
				"class": "deleteButton"
			}).appendTo("#divDelContainer");
			
			divDelConfirm =$("<div/>", {
				"id":"delete-confirm",// dossierID the id of the dossier
				"class": "deleteConfirmButton",
				"text":"Really delete"
			}).appendTo(divDelContainer);
			}
			lastbr1=$("<br/>", {
				
			}).appendTo(div1);
			lastbr2=$("<br/>", {

			}).appendTo(div1);
			
		} while (self.controller.models.dossierList.nextDossier());
	}
	

	$("#dossiersUl").bind("click", function(e){
		console.log("clicked the dossier category");
		var targetE = e.target;
		var targetID = targetE.id;
		var dosID = targetID.substring(7);
		console.log("dosID is "+dosID);
		var userModel = self.controller.models.user;
		userModel.setActiveDossier(dosID);
		window.location.href="index.html";
		//window.href="index.html";
		e.stopPropagation();
	});
	
	
	
	
};

WelcomeView.prototype.close=function(){
	$('#'+this.tagID).addClass("hidden");
};



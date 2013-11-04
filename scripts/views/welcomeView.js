/*jslint vars: true, sloppy: true */

function WelcomeView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="welcomeBox"; 

	$("#welcomeBox").bind("click", function(e){
		// ensure that clicks on the headers are ignored
		
		console.log("clicked the dossier category");
		var targetE = e.target;
		if (targetE.id !== "followingListHeader") {
			var targetID = targetE.id;
			var dosID = targetID.substring(7);
			console.log("dosID is "+dosID);
			var userModel = self.controller.models.user;
			userModel.setActiveDossier(dosID);
			window.location.href="index.html";
			e.stopPropagation();
		}
	});
}

WelcomeView.prototype.openDiv=openView;

WelcomeView.prototype.open = function(){
	this.update();
	this.openDiv();
};

WelcomeView.prototype.update = function(){
	var self=this;
	console.log("update the welcome view");
	var hash= window.location.hash;
	var hashTag = hash.substring(1);
	self.controller.colorizeInteractiveBox(hashTag);

	 $("#welcome").empty();

		 
	if ( self.controller.models.user.userProfile ) {
		console.log("user profile existis, design welcome view");
	}

	var dossierListModel=self.controller.models.dossierList;

	if (dossierListModel.listIsPresent()) { 
		dossierListModel.reset();

		console.log("dossier list is present design dossier list - welcome view");
		dossierId=dossierListModel.getDossierId();
		
		welcomeElement=$("#welcome");
		
		//create non-optional elements
		var l1 = this.createListBlock("L1");
		welcomeElement.append(l1);
		// create the optional elements
		var hl2= $("<div/>", {
			"id": "followingListHeader",
			"class": "pd_grey_head",
			"text":"Followed"
		});
		var l2 = this.createListBlock("L2");
		

		var isFollowedDossier, l2Uninitialized = false; 
		do {
			isFollowedDossier = dossierListModel.isFollowedDossier();
			if (isFollowedDossier && !l2Uninitialized ) {
				l2Uninitialized = true;
				welcomeElement.append(hl2);
				welcomeElement.append(l2);
			}
			this.renderDossierItem(isFollowedDossier ? l2 : l1);
		} while (dossierListModel.nextDossier());

		return; // stop here
		
		// END OF DESIGN OF FIRST LIST OF DOSSIERS

	}

};

WelcomeView.prototype.close=function(){
	$('#'+this.tagID).addClass("hidden");
};

WelcomeView.prototype.createListBlock = function(listId){
	return $("<div/>", {
		"id": listId
	});
};

WelcomeView.prototype.renderDossierItem = function(parentE) {
	var self = this;
	var dossierListModel=self.controller.models.dossierList;
	
	// This item should have a border by the CSS styles unless it is the last element in the parent container
	div1 =$("<div/>", {
		"class": "column featured2  dossier_item"
	}).appendTo(parentE);


	div2 =$("<div/>", {
		"class": "floatleft"
	}).appendTo(div1);

	img=$("<img/>", {
		"class": "floatleft",
		"src":self.controller.models.dossierList.getDossierImage(),
		"width":"80px",
		"height":"60px"
	}).appendTo(div2);

	div3 =$("<div/>", {
		"class": "floatleft overviewcontent dossier_text"
	}).appendTo(div1);

	h1 =$("<h1/>", {
		"class":"clickable",
		"id" : "dossier" + self.controller.models.dossierList.getDossierId(),
		"text":self.controller.models.dossierList.getDossierTitle()
	}).appendTo(div3);

	pS =$("<p/>", {
		"class":"small",
		// "text": "2013-07-08"
	}).appendTo(div3);

	p =$("<p/>", {
		"class":"small",
		// "text": "In this podcast, the former Foreign Minister of Indonesia, Hassan Wirajuda, outlines the thinking behind Jakarta&amp;rsquo;s current &amp;lsquo;free and active&amp;rsquo; foreign policy (bebas aktif); how the policy is shaping its relationships with the US, China and other ASEAN states; and how it might impact Indonesia&amp;rsquo;s 2014 presidential election."
		"text":self.controller.models.dossierList.getDossierDescription()
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
	
	

}; 

WelcomeView.prototype.closeDiv=closeView;

WelcomeView.prototype.close = function(){
	console.log("close welcome view");
	this.closeDiv();
	
};

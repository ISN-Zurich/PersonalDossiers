/*jslint vars: true, sloppy: true */

function WelcomeView(controller){
	var self=this;
	self.controller=controller;
	self.tagID="welcome";

    $(document).bind('DossierListUpdate', function(){
        self.update();
    });
    
    $(document).bind('UserProfileUpdate', function(){
        self.update();
    });
    
}

WelcomeView.prototype.openDiv=openView;

WelcomeView.prototype.open = function(){
	$('#delete').show();
	$('#findinformation').show();
	$('#socials').show();
	$('#addDossier').show();
	console.log("called open of the WelcomeView");
	this.update();
	$('#'+this.tagID).removeClass("hidden");
};

WelcomeView.prototype.update = function(){
	var self=this;
	console.log("update the welcome view");
	$("#userProfile").empty();
	$("#notifications").empty();
	$("#welcome").show();
	$("#welcome").empty();
    if ( self.controller.models.user.userProfile ) {
    	console.log("user profile existis, design welcome view");
	$("#welcome").html("<p>Welcome "+self.controller.models.user.userProfile.name+"</p><p>Here is your personal dossier area</p>");
}
	
	
	
	if (self.controller.models.dossierList.listIsPresent()) { 
		self.controller.models.dossierList.reset();
		
		dossierId=self.controller.models.dossierList.getDossierId();
		ul=$("<ul/>", {
			"id":"dossiersUl"
		}).appendTo('#welcome');
		do {
			 li = $("<li/>", {
				"class": "dossierCat",
				"id" : "dossier" + self.controller.models.dossierList.getDossierId(),
				"text":self.controller.models.dossierList.getDossierTitle()
			}).appendTo("#dossiersUl");
		} while (self.controller.models.dossierList.nextDossier());
	}
	
	
	p1=$("<p/>",{
		"class": "deleteButton",
		"id":"addDossierBtn",
		"text": "add a new Dossier"
	}).appendTo("#dossiersUl");
	
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
	
	$("#addDossierBtn").bind("click", function(e){
		console.log("clicked the add Dossier button");
		self.controller.models.dossierList.addDossier();
	});
};

WelcomeView.prototype.close=function(){
	$('#'+this.tagID).addClass("hidden");
};

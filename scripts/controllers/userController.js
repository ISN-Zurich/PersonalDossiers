
/*jslint vars: true, sloppy: true */

function userController() {
	var self=this;
	document.domain = 'ethz.ch';
	
	self.activeView=false;
    self.initOAuth();
      
	//initialization of models 
	self.models = {};

	self.models.authentication = new AuthenticationModel(self);
	self.models.dossierList= new DossierListModel(self);
	self.models.user= new UserModel(self);
	console.log("model is initialized");

	self.views = {};

	//initialization of views 
	self.views.login= new LoginView(self);
	self.views.landing= new landingView(self);
	self.views.welcome= new WelcomeView(self);
	self.views.log= new LogView(self);
	console.log("log view is initialized");
	self.views.user= new userProfileView(self);
	self.views.interaction = new interactionBox(self);
	self.views.notifications = new notificationView(self);
		
	self.models.user.checkActiveUser();

	//we want to update the Log View once we have logged out
	//in order to display the Li in the interaction box
	 $(document).bind("LogoutSent", function(){
		 console.log("logout sent is binded");
		 self.views.log.open();
		 $("#landingView").hide();
		 //$("#welcome").hide();
	 });
	 
	 
	 $(window).bind( "hashchange",function(){
		 console.log("hash change event binded");
		 var hashTag = self.getHash();
		 self.chooseView(hashTag);
	 });
} //end of constructor


userController.prototype.getHash = function(){
	var hash= window.location.hash;
	var hashTag = hash.substring(1);
	return hashTag;	
};

userController.prototype.chooseView = function(viewHashString){
	switch (viewHashString){
	case 'personalDossiers':
	case '':
		this.views.welcome.open();
		break;
	case 'userProfile':
		this.views.user.open();
		break;
	case 'notifications':
		this.views.notifications.open();
		break;
	}	
};

userController.prototype.initOAuth = function() {
    console.log('initialize the oauth helper class');
    try {
	this.oauth = new OAuthHelper("http://yellowjacket.ethz.ch/tools/");
    }
    catch (e) {
        this.oauth = undefined;
    }

    if (this.oauth) {
        console.log('oauth ok');
    }
    else {
        console.log('oauth failed');
    }
};


userController.prototype.updateUserData = function() {
    if ( this.oauth ) {
        this.models.dossierList.getUserDossiers();
    } 
};


userController.prototype.transition = function(targetView){
	if (!this.activeView || this.activeView !== this.views[targetView]) {
		console.log("do transition to "+targetView);
		if (this.activeView) {
			this.activeView.close();
		}
		console.log("setting active view in controller");
		this.activeView = this.views[targetView];
		console.log("just set active view");
		this.activeView.open();
		console.log("opened active view in controller");
	}
};

userController.prototype.getActiveDossier = function() {
    var activedossierId =  this.models.user.getActiveDossier();
    if (!activedossierId){
	var dossierId = this.models.dossierList.getDefaultDossierId();
	return dossierId;
    }
    return activedossierId;
};


userController.prototype.logout = function() {
    this.models.authentication.logout();
};


var controller;
$(document).ready(function(){
	console.log("document ready");
	controller = new userController();
});

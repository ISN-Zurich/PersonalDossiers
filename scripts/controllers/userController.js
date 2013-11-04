
/*jslint vars: true, sloppy: true */

function userController() {
	
	var self=this;
    this.debugMode = debugMode;
    this.baseURL = baseURL;
    this.hostURL = hostURL;
    this.appLoaded=false;
    
	document.domain = 'ethz.ch';
	
	self.activeView=false;
	self.loggoutClicked=false;
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
	self.views.welcome= new WelcomeView(self);
	self.views.introduction = new IntroductionView(self);
	self.views.addDossier = new addDossierView(self);
	self.views.log= new LogView(self);
	self.views.user= new userProfileView(self);
	
	self.views.interaction = new interactionBox(self);
	self.views.notifications = new notificationView(self);
	
	
		
	self.models.user.checkActiveUser();
	
	if (this.oauth){
		$("#st_user").removeClass("pd_disable");
		$("#st_dossiers").removeClass("pd_disable");
		
	}

	$(document).bind('DossierListUpdate', function(){
		console.log("dossier list update in user controller");
		self.chooseView();
		self.colorizeInteractiveBox();
	});
    
	//we want to update the Log View once we have logged out
	//in order to display the Li in the interaction box
	 $(document).bind("LogoutSent", function(){
		 console.log("logout sent is binded");
					 
		//3. clear the url from hash
		 var loc = window.location.href;
		 index= loc.indexOf('#');
		 
		 if (index >0){
			 window.location = loc.substring(0,index);
		 }

				 
		 self.chooseView();
		 self.colorizeInteractiveBox();

		 
	 });
	
	 
	 $(window).bind( "hashchange",function(){
		 console.log("hash change event binded");
		 self.chooseView();
		 self.colorizeInteractiveBox();
	 });
	 
 // when we are coming from the index.html
 // the page during its loading should colorize the interaction box based on the hashed url
	 $(window).load(function(){
		 console.log("window load event binded");
		 //we use the loggoutClicked flag to prevent the automatic loading of the page
		 //when click on the <a> logView.
		 if (!self.loggoutClicked){
		 console.log("enter on window load");
		 self.colorizeInteractiveBox();
		 self.chooseView();
		 }
	 });
	
	
	
} //end of constructor


userController.prototype.getHash = function(){
	var hash= window.location.hash;
	var hashTag = hash.substring(1);
	return hashTag;	
};

userController.prototype.chooseView = function(){
	 var hashTag = this.getHash();
	 if (!this.oauth){
		 this.views.addDossier.close();
			this.views.log.close();
			this.views.welcome.close();
		this.views.login.open();
		this.views.introduction.open();
		
		
	}else { 
		switch (hashTag){
		case 'userProfile':
			this.views.welcome.close();
			this.views.introduction.close();
			this.views.login.close();
			this.views.addDossier.close();
			this.views.user.open();
			this.activeView=this.views.user;
			break;
		case 'notifications':
			this.views.notifications.open();
			this.activeView=this.views.notifications;
			break;
		case 'personalDossiers':
		default:
			this.views.introduction.close();
			this.views.login.close();
			this.views.user.close();
			this.views.welcome.open();	
			this.views.addDossier.open();
			this.activeView=this.views.welcome;
			break;
		}
	}
};

userController.prototype.colorizeInteractiveBox = function(){
	 var hash = this.getHash();
	console.log("enter colorize interactive box");

	switch (hash){
	case 'personalDossiers':
		setDossiersColorization();
		break;
	case 'userProfile':
		console.log("user profile colorization");
		setUserProfileColorization();
		break;
	case '':
		if (this.oauth){
			console.log("we are authenticated in colorize interactive box");
			setDossiersColorization();
		}else {
			console.log("we are NOT authenticated in colorize interactive box");
			setLoggedOutColorization();
		}
		break;
	}
};

userController.prototype.initOAuth = function() {
    console.log('initialize the oauth helper class');
    try {
	this.oauth = new OAuthHelper(this.baseURL());
	 $(document).trigger('oauthSet');
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

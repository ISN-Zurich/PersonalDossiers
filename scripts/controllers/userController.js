/*jslint vars: true, sloppy: true */

/*jslint vars: true, sloppy: true */

function userController() {
<<<<<<< HEAD
    var self=this;
    
    document.domain = 'ethz.ch';
    
    self.activeView;
        self.initOAuth();
=======
	var self=this;
	document.domain = 'ethz.ch';
	
	self.activeView=false;
    self.initOAuth();
>>>>>>> cc9a3a3a130e209fdb368d9c7f0e30b6ee8c9bed
      
    //initialization of models 
    self.models = {};

    self.models.authentication = new AuthenticationModel(self);
    self.models.dossierList= new DossierListModel(self);
    self.models.user= new UserModel(self);
    console.log("model is initialized");

    self.views = {};

<<<<<<< HEAD
    //initialization of views 
    self.views.login= new LoginView(self);
    self.views.welcome= new WelcomeView(self);
    self.views.dossierButton= new DossiersButtonView(self);
    self.views.logout= new LogoutView(self);
    
    
    self.models.user.checkActiveUser();
=======
	//initialization of views 
	self.views.login= new LoginView(self);
	self.views.welcome= new WelcomeView(self);
	self.views.dossierButton= new DossiersButtonView(self);
	self.views.dossier= new AddDossierView(self);
	self.views.logout= new LogoutView(self);
	
	
	self.models.user.checkActiveUser();
>>>>>>> cc9a3a3a130e209fdb368d9c7f0e30b6ee8c9bed
}

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

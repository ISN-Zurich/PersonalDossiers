
/*jslint vars: true, sloppy: true */

function BookmarkController() {
    
	var self=this;
    this.debugMode = debugMode;
    this.hostURL = hostURL;
    this.baseURL = baseURL;
    document.domain = 'ethz.ch';
    
    self.initOAuth();
           
    self.models={};

    self.models.authentication=new AuthenticationModel(self);
    self.models.user = new UserModel(self);
    self.models.dossierList= new DossierListModel(self);
    //self.models.bookmark = new BookmarkModel(self);	

    self.views={};
    self.views.bookmark = new bookmarkView(self);
    
    self.models.user.checkActiveUser();
    
    
    $(document).bind('UserProfileUpdate', function(){
		
		console.log("binded User profile update in user controller model");
		
		self.models.dossierList.getUserDossiers();
	});

}


BookmarkController.prototype.initOAuth = function() {
    console.log('initialize the oauth helper class');
    try {
	this.oauth = new OAuthHelper(this.baseURL);
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

var controller;
console.log("enter bookmark main js");
$(document).ready(function(){
    console.log("document ready in bookmark controller");
    controller = new BookmarkController();
});
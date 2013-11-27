
/*jslint vars: true, sloppy: true */

function BookmarkController() {
    
	var self=this;
    this.debugMode = debugMode;
    this.hostURL = hostURL;
    this.baseURL = baseURL;
    document.domain = 'ethz.ch';
    
    self.initOAuth();
           
    self.models={};

  
    self.models.user = new UserModel(self);
    self.models.dossierList= new DossierListModel(self);

    self.views={};
    self.views.bookmark = new bookmarkView(self);
    
    self.models.user.checkActiveUser();
    
    
    var search = window.location.search;

    var params = search.split("&");
    var i;
    for ( i = 0; i < params.length; i++) {
        var tmp = params[i].split('=');
        if ( tmp[0] === "id" || tmp[0] === "?id" ) {
            self.itemId = tmp[1];
        }
    }
    
    
    
    //window.addEventListener('message', addDossierItem, false);
    
    
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
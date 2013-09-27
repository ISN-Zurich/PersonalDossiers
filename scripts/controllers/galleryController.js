/**
 * This controller is responsible for the indx.html

 * (dossier banner view and dossier content view)
 * 
 * @returns
 */

/*jslint vars: true, sloppy: true */

function GalleryController() {
    var self = this;

    console.log('Gallery Controller starts');
    document.domain = 'ethz.ch';

    self.initOAuth();

    if (self.oauth) {
    //initialization of models 
    self.models = {};
    
    //self.models.authentication = new AuthenticationModel(this);
    self.models.user = new UserModel(self);
    
    self.models.dossierList = new DossierListModel(self);
    self.models.bookmark = new BookmarkModel(self);

    console.log("model is initialized");
    
    console.log("loaded from model is "+self.models.bookmark.loaded);
    self.views = {};

        self.initImageHandler();
    }
    else {
        // user is not logged in go to user.html
        window.location.href = 'user.html';
    }
}

GalleryController.prototype.initOAuth = function() {
    try {
        this.oauth = new OAuthHelper('http://yellowjacket.ethz.ch/tools/');
    }
    catch (e) {
        console.log( 'oauth error! ' + e.message);
        this.oauth = null;
    }
};

GalleryController.prototype.updateUserData = function() {
    if ( this.oauth ) {
        this.models.dossierList.getUserDossiers();
    } 
};


GalleryController.prototype.initImageHandler=function(){
    var self=this;
    console.log("runs in controller image handler");
    self.imageHandler= new ImageHandler(this);
    
};


GalleryController.prototype.getActiveDossier = function(){
    var activedossierId =  this.models.user.getActiveDossier();
    if (activedossierId){
<<<<<<< HEAD
    return activedossierId;
    }else{
    var dossierId = this.models.dossierList.getDefaultDossierId();
    return dossierId;
=======
	return activedossierId;
    }
    if(!activedossierId){
	var dossierId = this.models.dossierList.getDefaultDossierId();
	return dossierId;
>>>>>>> cc9a3a3a130e209fdb368d9c7f0e30b6ee8c9bed
    }
    return undefined;
};


GalleryController.prototype.transition = function(){
<<<<<<< HEAD
        
}
=======
		
};
>>>>>>> cc9a3a3a130e209fdb368d9c7f0e30b6ee8c9bed

GalleryController.prototype.logout = function() {
    this.models.user.logout();
};

var controller;
console.log("enter main js");
$(document).ready(function(){
    console.log("document ready");
    controller = new GalleryController();
});

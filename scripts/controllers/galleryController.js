/**
 * This controller is responsible for the indx.html
 * (dossier banner view and dossier content view)
 * 
 * @returns
 */

/*jslint vars: true, sloppy: true */

function GalleryController() {
    var self = this;
    this.initServiceHost();

    ISNLogger.log('Gallery Controller starts');
//    document.domain = 'ethz.ch';

    self.initOAuth();

    if (self.oauth) {
    //initialization of models 
    self.models = {};
    
    //self.models.authentication = new AuthenticationModel(this);
    self.models.user = new UserModel(self);
    
    self.models.dossierList = new DossierListModel(self);
    self.models.bookmark = new BookmarkModel(self);

    ISNLogger.log("model is initialized");
    
    ISNLogger.log("loaded from model is "+self.models.bookmark.loaded);
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
        this.oauth = new OAuthHelper(this.baseURL);
    }
    catch (e) {
        ISNLogger.log( 'oauth error! ' + e.message);
        this.oauth = null;
    }
};

GalleryController.prototype.initServiceHost = pdInitServiceHost;
GalleryController.prototype.getServiceHost = pdGetServiceHost;
GalleryController.prototype.isAuthenticated = pdIsAuthenticated;

GalleryController.prototype.updateUserData = function() {
    if ( this.oauth ) {
        this.models.dossierList.getUserDossiers();
    } 
};

GalleryController.prototype.initImageHandler=function(){
    var self=this;
    ISNLogger.log("runs in controller image handler");
    self.imageHandler= new ImageHandler(this);
    
};

// ************************* Old function ********************
//GalleryController.prototype.getActiveDossier = function() {
//	//return 1;
//	return this.models.dossierList.getActiveDossier();
//};

GalleryController.prototype.getActiveDossier = function(){
    var activedossierId =  this.models.user.getActiveDossier();
    if (activedossierId){
    return activedossierId;
    }else{
    var dossierId = this.models.dossierList.getDefaultDossierId();
    return dossierId;
    }
    return undefined;
};

GalleryController.prototype.transition = function(){
        
}

GalleryController.prototype.logout = function() {
    this.models.user.logout();
}

var controlerObject = GalleryController;
//
//var controller;
//ISNLogger.log("enter main js");
//$(document).ready(function(){
//    ISNLogger.log("document ready");
//    
//    ISNLogger.debugMode = false;
//    
//    controller = new GalleryController();
//});

/**
 * GalleryController Class
 * 
 * The gallery controller is responsible for the UI on the gallery.html.
 */

/*jslint vars: true, sloppy: true */

function GalleryController() {
    this.initServiceHost();
    this.findDossierId();
    
    ISNLogger.log('Gallery Controller starts');

    this.initOAuth();

    if (this.oauth) {
        
        this.models = {};
        this.views = {};
        
        //initialization of models
        
        //self.models.authentication = new AuthenticationModel(this);
        this.models.user        = new UserModel(this);
        this.models.dossierList = new DossierListModel(this);
        this.models.bookmark    = new BookmarkModel(this);
        this.models.gallery     = new GalleryModel(this);
            
        // initialize the views
        this.views.gallery      = new GalleryView(this);
        // this.initImageHandler();
    }
    else {
        // user is not logged in => go to user.html
        window.location.href = 'user.html';
    }

    var self = this;
    $(document).bind('dataSuccessfullySent', function() {
        ISNLogger.log("we are done. forward to the user back to the dossier details. new href: " + self.baseURL + 'index.html?id=' + self.dossierid);
        window.location.href = self.baseURL + 'index.html?id=' + self.dossierid;
    });
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
GalleryController.prototype.getServiceHost  = pdGetServiceHost;
GalleryController.prototype.isAuthenticated = pdIsAuthenticated;

/**
 * @method findDossierId()
 * 
 * finds the active dossier from the querystring
 */
GalleryController.prototype.findDossierId = function() {
    var url_ref = window.location.search;
    if (url_ref && url_ref.length) {
        var param = url_ref.slice(1).split('&');
        ISNLogger.log("show splitted url array is " + param);
        if (param && param.length > 0) {
            var i;
            for (i=0; i < param.length; i++) {
                ISNLogger.log("tools is " + param[i]);
                var split2 = param[i].split("=");
                // only the id parameter is accepted!
                if ( split2[0] && split2[0].length && split2[0] === 'id' ) {
                    var d_id = split2[1];
                    if (d_id && d_id.length > 0) {
                        
                        this.dossierid = d_id;
                        break; // stop right here ignore and all other ids
                    }
                }
            }
        }
    }
};

/**
 * @mehod storeDossierImage(imageurl)
 */
GalleryController.prototype.storeDossierImage = function(url) {
    this.models.bookmark.setDossierImageURL(url);
    //send to the server the new image url and update the database
    this.models.bookmark.sendDataToServer();
};

/**
 * @method int getActiveDossier()
 * 
 * returns the id that has been identified from the querysting
 */
GalleryController.prototype.getActiveDossier = function() {
    return this.dossierid;
};

var controllerObject = GalleryController;
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

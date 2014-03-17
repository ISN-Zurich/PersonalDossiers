ISNLogger.log("enter embed controller file");

/**
 * This controller is responsible for the indx.html

 * (dossier banner view and dossier content view)
 *
 * @returns
 */

/*jslint vars: true, sloppy: true */

function EmbedController() {
    var self=this;
    this.id="embedController";
    this.initServiceHost();
//
//    this.baseURL = baseURL;
//    this.hostURL = hostURL;
//
//    document.domain = 'ethz.ch';
    self.hashed=false;
    self.hashedUrl();

    // if we are logged in or if there is a hash on the url then show & open the authorized views
    // if there is a hash on the url don't show the logout button

    if (self.hashed){
        self.views = {};
        self.models = {};

        //initialize models
        self.models.dossierList = new DossierListModel(self);
        self.models.bookmark = new BookmarkModel(self);

        ISNLogger.log("model is initialized");

        //initialize views
        self.views.dossierBanner = new DossierBannerView(self);
        self.views.dossierContent= new DossierContentView(self);
        self.views.details       = new DetailEmbedView(self);

        $(document).bind("BookmarkModelLoaded", function() {
           ISNLogger.log("initialize views in controller");
           self.views.dossierBanner.open();
           self.views.dossierContent.open();
        });
    }
} //end of constructor

EmbedController.prototype.initServiceHost = pdInitServiceHost;
EmbedController.prototype.getServiceHost  = pdGetServiceHost;
EmbedController.prototype.isAuthenticated = pdIsAuthenticated;
EmbedController.prototype.keysRejected    = pdNOOP;

EmbedController.prototype.hashedUrl = function() {
    ISNLogger.log("enter hasehd url");

    url_ref=window.location.href;
    var splited=url_ref.split("?");
    ISNLogger.log("show splitted url array is "+splited);
    var split1=splited[1];
    if (split1 && split1.length>0){
        ISNLogger.log("tools is "+split1);
        var split2=split1.split("=");
        var d_id=split2[1];
        if (d_id && d_id.length>0){
            ISNLogger.log("there is id in the new url and it is "+d_id);
            this.pubid=d_id;
            this.hashed=true;
        }
    }
    else{
        this.hashed=false;
    }
};

EmbedController.prototype.getHashedURLId = function(){
    var dossierId=this.pubid;
    ISNLogger.log("dossier id after hash is "+dossierId);
    return dossierId;
};

EmbedController.prototype.getActiveDossier = function(){
    ISNLogger.log("in user controller to get active dossier");
    if (this.hashed){
        var activedosId = this.getHashedURLId();
        return activedosId;
    }
    if (!this.hashed){   //if there is no hash at the url
        var activedossierId =  this.models.user.getActiveDossier();
        if (activedossierId){
            return activedossierId;
        }
        if(!this.activedossierId){
            var dossierId = this.models.dossierList.getDefaultDossierId();
            return dossierId;
        }
    } //is not hashed
    return undefined;    //if something goes wrong for any reason
};

/**
 * @method openDetails()
 * 
 * Closes the overview page and opens the details view for the current item.
 */
EmbedController.prototype.openDetails = function() {
    this.views.dossierBanner.close();
    this.views.dossierContent.close();
    $("#content").hide();
    this.views.details.open();
};

/**
 * @method openDossier() 
 * 
 * Closes the details view and opens the dossier list again.
 */
EmbedController.prototype.openDossier = function() {
    this.views.details.close();
    $("#content").show();
    this.views.dossierBanner.open();
    this.views.dossierContent.open();
};

var controllerObject = EmbedController;

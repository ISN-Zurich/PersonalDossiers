/**
 * This controller is responsible for the indx.html
 * (dossier banner view and dossier content view)
 * 
 * @returns
 */
function dossierController() {
    var self=this;
    
    document.domain = 'ethz.ch';
    self.hashed=false;

    self.hashedUrl();
    self.initOAuth();

  // if we are logged in or if there is a hash on the url then show & open the authorized views
  // if there is a hash on the url don't show the logout button

  // x= self.hashedUrl();


   if (self.oauth || self.hashed){

	//initialization of models 
	self.models = {};
	
	//self.models.authentication = new AuthenticationModel(this);

    //user model is run only when we are authenticated
   if (self.oauth){
       self.models.user = new UserModel(self);
   }
	
	self.models.dossierList = new DossierListModel(self);
	self.models.bookmark = new BookmarkModel(self);
	
	
	console.log("model is initialized");
	
	self.views = {};

	//initialization of views 
        self.views.dossierBanner = new DossierBannerView(self);
	    self.views.dossierContent= new DossierContentView(self);

       //the following views run only when we are authenticated
       if (self.oauth){
       self.views.dossierList = new DossiersButtonView(self);
       self.views.logout      = new LogoutView(self);
       self.views.share      = new ShareButtonView(self);
       }

       if (self.hashed){
           console.log("design hash-specific views");
           $('#loginButton').removeClass("hidden");
           self.views.loginButton = new LoginButtonView(self);
        }

	$(document).bind("BookmarkModelLoaded", function() {
	    console.log("initialize views in controller");
	    self.views.dossierBanner.open();
        self.views.dossierContent.open();

	});
	
	
	//console.log("dossiersController is initialized"+this.models.bookmark.loaded);
    }
    else if (!self.oauth && !self.hashed) {
       console.log("the user is not loggedIn and there is no hash on the url");
        // user is not logged in go to user.html
        window.location.href = 'user.html';
    }
}

    dossierController.prototype.hashedUrl = function() {
               //var  url_path= window.location.pathname;
              // if (url_path.indexOf('#') != -1) {

                console.log(" enter hashedUrl");
                if (window.location.hash){
                    console.log("url has a hash");
                        this.hashed=true;
                      //  return true;
                 }
                 else{
                    console.log("url has not a hash");
                    this.hashed=false;
                     //   return false;
                    }
    };

    dossierController.prototype.getHashedURLId = function(){
                  var hashed_url= window.location.hash;
                  var dossierId= hashed_url.substring(1);
                  console.log("dossier id after hash is "+dossierId);
                  return dossierId;
    };

    dossierController.prototype.initOAuth = function() {
        try {
            this.oauth = new OAuthHelper('http://yellowjacket.ethz.ch/tools/');
        }
        catch (e) {
            this.oauth = null;
        }
    };

    dossierController.prototype.updateUserData = function() {
        if ( this.oauth ) {
            this.models.dossierList.getUserDossiers();
        }
    };


    dossierController.prototype.initImageHandler=function(){
        var self=this;
        console.log("runs in controller image handler");
        self.imageHandler= new ImageHandler(this);

    };

    dossierController.prototype.test = function(){
        console.log("after initializing image gallery");
    };

    // ************************* Old function ********************
    //dossierController.prototype.getActiveDossier = function() {
    //	//return 1;
    //	return this.models.dossierList.getActiveDossier();
    //};


    dossierController.prototype.getActiveDossier = function(){

        if (this.hashed){
        var activedosId = this.getHashedURLId();
            return activedosId;
        } else {   //if there is no hash at the url
        var activedossierId =  this.models.user.getActiveDossier();
        if (activedossierId){
        return activedossierId;
        }else{
        var dossierId = this.models.dossierList.getDefaultDossierId();
        return dossierId;
        }}
        return undefined;    //if something goes wrong for any reason
    };


    dossierController.prototype.transition = function(){

    }

    dossierController.prototype.logout = function() {
        this.models.user.logout();
    }

    var controller;
    console.log("enter main js");
    $(document).ready(function(){
        console.log("document ready");
        controller = new dossierController();
    });

/**
 * This controller is responsible for the indx.html

 * (dossier banner view and dossier content view)
 * 
 * @returns
 */

/*jslint vars: true, sloppy: true */

function dossierController() {
    var self=this;
    this.id="dossierController";
    this.debugMode = debugMode;
    this.baseURL = baseURL;
    this.hostURL = hostURL;
    
    document.domain = 'ethz.ch';
    self.hashed=false;
    self.hashedUrl();
    self.initOAuth();

  // if we are logged in or if there is a hash on the url then show & open the authorized views
  // if there is a hash on the url don't show the logout button

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
	    self.views.userlist = new DossierUsersView(self);
	    self.views.embed= new addEmbedButton(self);
	    self.views.share = new ShareButtonView(self);

     
       $(document).bind("BookmarkModelLoaded", function() {
    	   console.log("initialize views in controller");
    	   self.views.dossierBanner.open();
    	   self.views.dossierContent.open();
    	   self.views.userlist.open();
    	   self.views.embed.open();
       });
       
	
    }
    else if (!self.oauth && !self.hashed) {
       console.log("the user is not loggedIn and there is no hash on the url");
        // user is not logged in go to user.html
        window.location.href = 'user.html';
    }
   
   $(document).bind("LogoutSent", function(){
	   console.log("binded logout sent in constructor");
	  window.location.href = 'user.html';
   });
   
   $(window).bind( "hashchange",function(){
//		 console.log("hash change event binded");
//		 var hashTag = self.getHash();
//		 self.chooseView(hashTag);
//		 self.colorizeInteractiveBox(hashTag);
	 });
   

} //end of constructor

    dossierController.prototype.hashedUrl = function() {
    	
    	console.log("enter hasehd url"); 

    	url_ref=window.location.href;
    	var splited=url_ref.split("?");
    	console.log("show splitted url array is "+splited);
    	var split1=splited[1];
    	if (split1 && split1.length>0){
    	console.log("tools is "+split1);
    	var split2=split1.split("=");
    	var d_id=split2[1];
    	if (d_id && d_id.length>0){
    		console.log("there is id in the new url and it is "+d_id);
    		this.pubid=d_id;
    		this.hashed=true;
    	}} else{
    	
    	 this.hashed=false;
    	}
    	
    	              
    };

    dossierController.prototype.getHashedURLId = function(){
                 var dossierId=this.pubid;
                  console.log("dossier id after hash is "+dossierId);
                  return dossierId;
    };

    dossierController.prototype.initOAuth = function() {
        try {
            this.oauth = new OAuthHelper(this.baseURL);
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

      dossierController.prototype.getActiveDossier = function(){
    	  console.log("in user controller to get active dossier");
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
        }//is not hashed
        return undefined;    //if something goes wrong for any reason
    };


    dossierController.prototype.transition = function(){

    };

    dossierController.prototype.logout = function() {
      	console.log("enter logout in dossier controller");
    	authentication = new AuthenticationModel(this);
    	authentication.logout();
    };

     var controller;
    console.log("enter main js");
    $(document).ready(function(){
        console.log("document ready");
        controller = new dossierController();
    });

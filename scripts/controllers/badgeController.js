/**
 * This controller is responsible for the indx.html

 * (dossier banner view and dossier content view)
 * 
 * @returns
 */

/*jslint vars: true, sloppy: true */

function badgeController() {
    var self=this;
    this.id="badgeController";
    this.debugMode = debugMode;
    this.initServiceHost();

//    this.baseURL = baseURL;
//    this.hostURL = hostURL;
    
    document.domain = 'ethz.ch';
    self.hashed=false;
    self.hashedUrl();
  
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
	
	ISNLogger.log("model is initialized");
	
	self.views = {};

	//initialization of views 
	
	//  self.views.dossierBanner = new DossierBannerView(self);
	    self.views.badge= new badgeView(self);

       $(document).bind("BookmarkModelLoaded", function() {
    	   ISNLogger.log("initialize views in controller");
   	   self.views.badge.open();
       });
    }
} //end of constructor

badgeController.prototype.initServiceHost = pdInitServiceHost;
badgeController.prototype.getServiceHost = pdGetServiceHost;

badgeController.prototype.hashedUrl = function() {
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
		}} else{
			this.hashed=false;
		}              
};


badgeController.prototype.getHashedURLId = function(){
    	var dossierId=this.pubid;
    	ISNLogger.log("dossier id after hash is "+dossierId);
    	return dossierId;
};



badgeController.prototype.getActiveDossier = function(){
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
    	}//is not hashed
    	return undefined;    //if something goes wrong for any reason
};


var controller;
ISNLogger.log("enter main js");
$(document).ready(function(){
	ISNLogger.log("document ready");
	controller = new badgeController();
});

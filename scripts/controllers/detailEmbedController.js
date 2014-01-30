/**
 * @returns
 */

/*jslint vars: true, sloppy: true */

function detailEmbedController() {
    var self=this;
    this.id="detailembedController";
    this.initServiceHost();

//    this.baseURL = baseURL;
//    this.hostURL = hostURL;

//    document.domain = 'ethz.ch';
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
        self.views.detailEmbed = new detailEmbedView(self);
	 
  
       $(document).bind("BookmarkModelLoaded", function() {
    	   self.views.detailEmbed.open();
       }); 
    }
   

} //end of constructor

detailEmbedController.prototype.hashedUrl = function() {
    
	url=window.location.search;
	var split1=url.slice(1);
	ISNLogger.log("show splitted url array is "+split1);
	// var split1=splited; // dossier_id=123432&item_id=123123
	
	//TODO: to calculate both dossier_id and item_id
	//the new url string would be http://yellowjacket.ethz.ch/tools/embedDetailPage.html?dossier_id=123432&item_id=123123
	
	if (split1 && split1.length>0){
		ids_partition=split1.split("&");
		dossier_id_partition=ids_partition[0]; // dossier_id=123432
		item_id_partition=ids_partition[1]; // item_id=123123
		ISNLogger.log("dossier id parition is "+dossier_id_partition);
		ISNLogger.log("item id parition is "+item_id_partition);
	
		if (dossier_id_partition && dossier_id_partition.length > 0){
			dossier_id_sub_part=dossier_id_partition.split("=");
			dossier_id=dossier_id_sub_part[1];
			this.pubid=dossier_id;
			this.hashed=true;
			ISNLogger.log("dossier id is "+dossier_id);
		}
		 	

		if (item_id_partition && item_id_partition.length > 0){
			item_id_sub_partition=item_id_partition.split("=");
			item_id=item_id_sub_partition[1];
			this.item_id=item_id;
			this.hashed=true;
			ISNLogger.log("item id is "+item_id);
		}
		
		
	}
	
//	  	if (split1 && split1.length>0){
//     	var split2=split1.split("=");
//    	var d_id=split2[1];
//    	if (d_id && d_id.length>0){
//    		ISNLogger.log("there is id in the new url and it is "+d_id);
//    		this.pubid=d_id;
//    		this.hashed=true;
//    	}}
	else{
		this.hashed=false;
	}              
};

detailEmbedController.prototype.initServiceHost = pdInitServiceHost;
detailEmbedController.prototype.getServiceHost = pdGetServiceHost; 


    detailEmbedController.prototype.getHashedURLId = function(){
    	var dossierId=this.pubid;
    	ISNLogger.log("dossier id after hash is "+dossierId);
    	return dossierId;
    };


    detailEmbedController.prototype.getdossierItemId = function(){
    	var item_id=this.item_id;
    	ISNLogger.log("item id after hash is "+item_id);
    	return item_id;
    };

    detailEmbedController.prototype.getActiveDossier = function(){
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
        
        ISNLogger.debugMode = false;
        controller = new detailEmbedController();
    });

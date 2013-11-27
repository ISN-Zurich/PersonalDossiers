
/*jslint vars: true, sloppy: true */

function BookmarkController() {
    
	var self=this;
    this.debugMode = debugMode;
    this.hostURL = hostURL;
    this.baseURL = baseURL;
    var targetHost = 'http://www.isn.ethz.ch';
    document.domain = 'ethz.ch';
    
    self.initOAuth();
           
    self.models={};

    self.models.bookmark= new BookmarkModel(self);
    self.models.user = new UserModel(self);
    self.models.dossierList= new DossierListModel(self);
    

    self.views={};
    self.views.bookmark = new bookmarkView(self);
    
    self.models.user.checkActiveUser();
    
    self.library_item_id=null;
    self.getUrlId(); // assign a value to library_item_id
    //checkBookmark(library_item_id);
        
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



BookmarkController.prototype.getUrlId = function(){
	var url_ref=window.location.href;
	var splited=url_ref.split("?");
	console.log("show splitted url array is "+splited);
	var split1=splited[1];
	if (split1 && split1.length>0){
		console.log("tools is "+split1);
		var split2=split1.split("=");
		var d_id=split2[1];
		if (d_id && d_id.length>0){
			console.log("there is id in the new url and it is "+d_id);
			this.library_item_id=d_id;
			return this.library_item_id
		}
	}

	return false;
};

BookmarkController.prototype.checkBookmark=function(item_id){
	 if ( this.models.bookmark.hasItem(item_id) ){
		 console.log('bookmark found!');
         window.parent.postMessage(JSON.stringify({'bookmarkok': 1}), 
                                   this.targetHost);
	 }
};

var controller;
console.log("enter bookmark main js");
$(document).ready(function(){
    console.log("document ready in bookmark controller");
    controller = new BookmarkController();
});
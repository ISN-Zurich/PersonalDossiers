
/*jslint vars: true, sloppy: true */

function BookmarkController() {
    
	var self=this;
    this.debugMode = debugMode;
    this.hostURL = hostURL;
    this.baseURL = baseURL;
    this.targetHost = 'http://www.isn.ethz.ch';
    // document.domain = 'ethz.ch';
    this.allowedHosts = ['http://www.isn.ethz.ch', 'http://isn.ethz.ch', 'http://www.isn.ch', 'http://isn.ch']; 
    
    self.initOAuth();
    self.models={};

    self.models.user = new UserModel(self);
    self.models.dossierList= new DossierListModel(self);
    //self.models.bookmark= new BookmarkModel(self); for the first two steps we don't need it
    self.models.bookmarkDossier= new LibraryBookmarkModel(self);
  
    

    self.views={};
    self.views.bookmark = new bookmarkView(self);
    
    self.models.user.checkActiveUser();
    
    self.library_item_id=null;
    self.getUrlId(); // assign a value to library_item_id
     
    
    $(document).bind('UserProfileUpdate', function(){
		
		console.log("binded User profile update in user controller model");
		
		self.models.dossierList.getUserDossiers();
	});

} //end of constructor


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

BookmarkController.prototype.notifyNewHeight = function(height){
	console.log("enter notify new height");

		 var data={
					"resize": {
						"height":height
					}	
			};
		  
		
		var id, mdata= JSON.stringify(data);
		for (id = 0; id < this.allowedHosts.length; id++) {
			window.parent.postMessage(mdata, this.allowedHosts[id]);
		}
};

//it is deprecated and is not beeing used
BookmarkController.prototype.calculateHeight= function(m){
	
	var id = this.allowedHosts.indexOf(m.origin);
	console.log('origin is id: '+ id);
	if (id >= 0) {
		targetHost = this.allowedHosts[id];
		var data={
				"resize": {
					"height":height
				}	
		};
		window.parent.postMessage(JSON.stringify(data), targetHost);
	};
};

var controller;
console.log("enter bookmark main js");
$(document).ready(function(){
    console.log("document ready in bookmark controller");
    controller = new BookmarkController();
});


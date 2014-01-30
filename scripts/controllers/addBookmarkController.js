/*jslint vars: true, sloppy: true */

function addBookmarkController() {
    var self=this;

    this.debugMode = debugMode;
    this.initServiceHost();
//    this.hostURL = hostURL;
//    this.baseURL = baseURL;
    ISNLogger.log("debugMode is"+this.debugMode);
    ISNLogger.log("hostURL is"+this.hostURL);
    ISNLogger.log("baseURL is"+this.baseURL);
    
    document.domain = 'ethz.ch';
    self.login = false;

    ISNLogger.log("do not initialize");
    window.addEventListener('message', authorizationListener, false); //THIS WILL GO AWAY
    
    //  window.addEventListener('message', resizeListener, false);
    //the resize listener will check for the resize event and will get the NEW height of the iframe
    
    var search = window.location.search;

    var params = search.split("&");
    var i;
    for ( i = 0; i < params.length; i++) {
        var tmp = params[i].split('=');
        if ( tmp[0] === "id" || tmp[0] === "?id" ) {
            this.itemId = tmp[1];
        }
    }
    // create a hidden window
    $('<iframe/>', {'class': 'none', 
                    'id': 'isn_pd_authorize', 
                    'src': this.baseURL + 'authorize.html?id='+this.itemId }).appendTo('#isn_pd_widget').bind('load', function(){
                        if ( self.itemId ) {
                            self.checkItem();
                        } //we remove the bind, we dont checkItem()
                    });    

    function authorizationListener(m) {
    	ISNLogger.log("enter authorization listener");
    	ISNLogger.log("self.hostURL is "+self.hostURL);
    	ISNLogger.log("this.hostURL is "+self.hostURL);
        if (m.origin == self.hostURL) {
            var data = JSON.parse(m.data);
            ISNLogger.log('received a message: ' + m.data);
            // store the data into the local storage. 
            if ( data.userok ) {
                self.login = true;
                self.views ={};
                self.views.addBookmark = new DesignBookmarkView(self);
            
                ISNLogger.log("add bookmark controller is initialized");
            }
            if ( data.bookmarkok ) {
                ISNLogger.log('item is already bookmarked' ); 
                self.views.addBookmark.feedback('OK');
            }
        }
    }
};

addBookmarkController.prototype.initServiceHost = pdInitServiceHost;
addBookmarkController.prototype.getServiceHost = pdGetServiceHost;

// will go away
addBookmarkController.prototype.getActiveDossier = function() {
    var self=this;
    ISNLogger.log("dossierList models is "+self.models.dossierList);
    
    var adID = self.models.user.getActiveDossier();
    if ( !adID ) {
        adID = self.models.dossierList.getDefaultDossier();
    }
    return adID;
};


//will go away
addBookmarkController.prototype.initOAuth = function() {
    try {
        this.oauth = new OAuthHelper(this.baseURL);
    }
    catch (e) {
        this.oauth = undefined;
        ISNLogger.log("fail over");
    }
};

// THIS WILL GO TO authorize.helper (add bookmark helper)
addBookmarkController.prototype.addItem = function() {
    var data = {'operation': 'store', 'itemID': this.itemId};
    $('#isn_pd_authorize')[0].contentWindow.postMessage(JSON.stringify(data), 
                                                        this.hostURL);
};

//IT WILL COMPLETELY GO AWAY

addBookmarkController.prototype.checkItem = function() {
    var data = {'operation': 'check', 'itemID': this.itemId};
    var msg = JSON.stringify(data);
    ISNLogger.log( 'post message ' + msg);
    ISNLogger.log("hostURL is"+this.hostURL);
    $('#isn_pd_authorize')[0].contentWindow.postMessage(msg, 
                                                        this.hostURL);
};


//wil go away
addBookmarkController.prototype.isLoggedin = function() {
    return this.login;
};

var controller;
ISNLogger.log("enter addBookmark main js");
$(document).ready(function(){
    ISNLogger.log("document ready");
    controller = new addBookmarkController();
});


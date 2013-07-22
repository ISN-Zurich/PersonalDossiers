function addBookmarkController() {
    var self=this;

    document.domain = 'ethz.ch';
    self.login = false;

    console.log("do not initialize");
    window.addEventListener('message', authorizationListener, false);
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
                    'src': 'http://yellowjacket.ethz.ch/tools/authorize.html' }).appendTo('#isn_pd_widget').bind('load', function(){
                        if ( self.itemId ) {
                            self.checkItem();
                        }
                    });


    function authorizationListener(m) {
        if (m.origin == "http://yellowjacket.ethz.ch") {
            var data = JSON.parse(m.data);
            console.log('received a message: ' + m.data);
            // store the data into the local storage. 
            if ( data.userok ) {
                self.login = true;
	        self.views ={};
	        self.views.addBookmark = new DesignBookmarkView(self);
	        
	        console.log("add bookmark controller is initialized");
            }
            if ( data.bookmarkok ) {
                console.log('item is already bookmarked' ); 
                self.views.addBookmark.feedback('OK');
            }
        }
    }
};



addBookmarkController.prototype.getActiveDossier = function() {
    var self=this;
    console.log("dossierList models is "+self.models.dossierList);
    
    var adID = self.models.user.getActiveDossier();
    if ( !adID ) {
        adID = self.models.dossierList.getDefaultDossier();
    }
    return adID;
};

addBookmarkController.prototype.initOAuth = function() {
    try {
        this.oauth = new OAuthHelper('http://yellowjacket.ethz.ch/tools/');
    }
    catch (e) {
        this.oauth = undefined;
        console.log("fail over");
    }
};

addBookmarkController.prototype.addItem = function() {
    var data = {'operation': 'store', 'itemID': this.itemId};
    $('#isn_pd_authorize')[0].contentWindow.postMessage(JSON.stringify(data), 
                                                        'http://yellowjacket.ethz.ch');
};

addBookmarkController.prototype.checkItem = function() {
    var data = {'operation': 'check', 'itemID': this.itemId};
    var msg = JSON.stringify(data);
    console.log( 'post message ' + msg);
    $('#isn_pd_authorize')[0].contentWindow.postMessage(msg, 
                                                        'http://yellowjacket.ethz.ch');
};


addBookmarkController.prototype.isLoggedin = function() {
    return this.login;
};

var controller;
console.log("enter addBookmark main js");
$(document).ready(function(){
	console.log("document ready");
	controller = new addBookmarkController();
});


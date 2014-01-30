/**
 * This controller is responsible for handling the bookmark adding from within the digital library
 * 
 * @returns
 */

/*jslint vars: true, sloppy: true */

function AuthorizationController() {
	
	ISNLogger.log("enter authorize controller");
   
    var self = this;
    
    this.initServiceHost();

    var bookmarks = null;
    var  mUser = null, mDossiers = 0;
    // document.domain = 'ethz.ch';
    
    var targetHost = 'http://www.isn.ethz.ch';
    var allowedHosts = ['http://www.isn.ethz.ch', 'http://isn.ethz.ch', 'http://www.isn.ch', 'http://isn.ch'];

    try {
        self.oauth = new OAuthHelper(this.baseURL);
    }
    catch (e) {
        self.oauth = null;
    }

    self.getActiveDossier = function() {
        var did = mUser.getActiveDossier();
        if (!did) {
            did = mDossiers.getDefaultDossierId();
        }
        ISNLogger.log( 'active dossier is : ' + did);
        return did;
    };

    $(document).bind('BOOKMARKSTORED', function() {
        window.parent.postMessage(JSON.stringify({'bookmarkok': 1}), 
                                  targetHost);
    });

    if (self.oauth) {
        ISNLogger.log("we send the message event in authorize helper");
        // indeed we want to verify the tokens first
        window.addEventListener('message', handshake, false);    
        
        // now load the bookmark model 
        $(document).bind('BookmarkModelLoaded', checkBookmark);

        mUser = new UserModel(self);
        mDossiers = new DossierListModel(self);
        bookmarks = new BookmarkModel(self);
        
    }    

    function handshake(m) {
        ISNLogger.log( 'received a message from ' + m.origin);
        var id = allowedHosts.indexOf(m.origin);
        ISNLogger.log('origin is id: '+ id);
        if (id >= 0) {
            targetHost = allowedHosts[id];
            
            var data = JSON.stringify({'userok': 1});
            
            window.removeEventListener('message', handshake, false);
            window.addEventListener('message', addDossierItem, false);
            window.parent.postMessage(data, targetHost);
        }
    }
    
    function addDossierItem(m) {
        ISNLogger.log( 'received a message from ' + m.origin);
        var id = allowedHosts.indexOf(m.origin);
        ISNLogger.log('origin is id: '+ id);
        if (id >= 0) {
            targetHost = allowedHosts[id];
            
            ISNLogger.log( 'data is ' + m.data);
            var data = JSON.parse(m.data);
            // use only for our digital library
            ISNLogger.log( 'item id? ' + data.itemID);
            if ( data.itemID ) {
                ISNLogger.log('operation is ' + data.operation);
                switch (data.operation) {
                case 'store':
                    ISNLogger.log('add the bookmark');
                    bookmarks.addItem(data.itemID);                
                    break;
                case 'check':
                    ISNLogger.log( 'check bookmark');
                    self.activeItemID = data.itemID;
                    checkBookmark();
                    break;
                default: 
                    break;
                }
            }
        }
    }

    function checkBookmark() {
        ISNLogger.log('check bookmark! ' + self.activeItemID);
        if ( self.activeItemID && bookmarks.hasItem(self.activeItemID) ){
            ISNLogger.log('bookmark found!');
            window.parent.postMessage(JSON.stringify({'bookmarkok': 1}), 
                                      self.targetHost);
        }
    }
}

AuthorizationController.prototype.initServiceHost = pdInitServiceHost;
AuthorizationController.prototype.getServiceHost = pdGetServiceHost;

var controller;
ISNLogger.log("enter main js");
$(document).ready(function() {
    ISNLogger.log("document ready");
    
    ISNLogger.debugMode = false;
    controller = new AuthorizationController();
});

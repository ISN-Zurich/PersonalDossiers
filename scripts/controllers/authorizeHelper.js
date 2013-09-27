/**
 * This controller is responsible for the indx.html

 * (dossier banner view and dossier content view)
 * 
 * @returns
 */

/*jslint vars: true, sloppy: true */

function AuthorizationController() {
   
    var self=this;
    var bookmarks=null;
    var  mUser=null, mDossiers=0;
    document.domain = 'ethz.ch';

    try {
        self.oauth = new OAuthHelper('http://yellowjacket.ethz.ch/tools/');
    }
    catch (e) {
        self.oauth = null;
    }

    this.getActiveDossier = function() {
        var did = mUser.getActiveDossier();
        if (!did) {
            did = mDossiers.getDefaultDossierId();
        }
        console.log( 'active dossier is : ' + did);
        return did;
    };

    $(document).bind('BOOKMARKSTORED', function() {
        window.parent.postMessage(JSON.stringify({'bookmarkok': 1}), 
                                  'http://www.isn.ethz.ch');
    });

    if (self.oauth) {
        // indeed we want to verify the tokens first
        var data = JSON.stringify({'userok': 1});
        window.parent.postMessage(data, 'http://www.isn.ethz.ch');
        // now load the bookmark model 
        $(document).bind('BookmarkModelLoaded', checkBookmark);

        mUser = new UserModel(self);
        mDossiers = new DossierListModel(self);
        bookmarks = new BookmarkModel(self);

        window.addEventListener('message', addDossierItem, false);

    }    

    function addDossierItem(m) {
        console.log( 'received a message from ' + m.origin);
        if (m.origin === 'http://www.isn.ethz.ch') {

            console.log( 'data is ' + m.data);
            var data = JSON.parse(m.data);
            // use only for our digital library
            console.log( 'item id? ' + data.itemID);
            if ( data.itemID ) {
                console.log('operation is ' + data.operation);
                switch (data.operation) {
                case 'store':
                    console.log('add the bookmark');
                    bookmarks.addItem(data.itemID);                
                    break;
                case 'check':
                    console.log( 'check bookmark');
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
        console.log('check bookmark! ' + self.activeItemID);
        if ( self.activeItemID && bookmarks.hasItem(self.activeItemID) ){
            console.log('bookmark found!');
            window.parent.postMessage(JSON.stringify({'bookmarkok': 1}), 
                                      'http://www.isn.ethz.ch');
        }
    }
}

var controller;
console.log("enter main js");
$(document).ready(function(){
    console.log("document ready");
    controller = new AuthorizationController();
});

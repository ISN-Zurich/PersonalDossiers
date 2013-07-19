/**
 * This controller is responsible for the indx.html
 * (dossier banner view and dossier content view)
 * 
 * @returns
 */
function AuthorizationController() {
    var bookmarks, dossierId, self=this;
    var mUser, mDossiers;
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

    if (self.oauth) {
        // indeed we want to verify the tokens first
        var data = JSON.stringify({'userok': 1});
        window.parent.postMessage(data, 'http://www.isn.ethz.ch');
        // now load the bookmark model 
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
                console.log('dID:  ' + data.dossierID);
                if ( data.dossierID ) {
                    bookmarks.dossierId = data.dossierID;
                }
                console.log('iID:  '+ data.itemID);
                bookmarks.addItem(data.itemID);                
            }
        }
    }
}

var controller;
console.log("enter main js");
$(document).ready(function(){
	console.log("document ready");
	controller = new AuthorizationController();
});

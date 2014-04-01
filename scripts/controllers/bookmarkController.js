/*jslint vars: true, sloppy: true */
function BookmarkController() {

    var self = this;

    this.initServiceHost();
//    this.hostURL = hostURL;
//    this.baseURL = baseURL;

    this.targetHost = 'http://www.isn.ethz.ch';
    // document.domain = 'ethz.ch';
    this.allowedHosts = ['http://www.isn.ethz.ch', 'http://isn.ethz.ch', 'http://www.isn.ch', 'http://isn.ch'];

    self.initOAuth();
    self.models = {};

    self.models.user = new UserModel(self);
    self.models.dossierList = new DossierListModel(self);
    //self.models.bookmark= new BookmarkModel(self); for the first two steps we don't need it
    self.models.bookmarkDossier = new LibraryBookmarkModel(self);

    self.views = {};
    self.views.bookmark = new bookmarkView(self);

    self.models.user.checkActiveUser();

    self.library_item_id = null;
    self.getUrlId(); // assign a value to library_item_id


    $(document).bind('UserProfileUpdate', function(){

        ISNLogger.log("bound User profile update in user controller model");
        self.models.dossierList.getUserDossiers();
    });
} //end of constructor



BookmarkController.prototype.initServiceHost = pdInitServiceHost;
BookmarkController.prototype.getServiceHost = pdGetServiceHost;
BookmarkController.prototype.isAuthenticated = pdIsAuthenticated;
BookmarkController.prototype.keysRejected = pdNOOP;



BookmarkController.prototype.initOAuth = function(){

    ISNLogger.log('initialize the oauth helper class');
    try {

        this.oauth = new OAuthHelper( this.baseURL );
        $(document).trigger('oauthSet');
    } catch ( e ) {

        this.oauth = undefined;
    }

    if (this.oauth) {

        ISNLogger.log('oauth ok');
    } else {

        ISNLogger.log('oauth failed');
    }
};



BookmarkController.prototype.getUrlId = function(){

    var url_ref = window.location.href;
    var split_url = url_ref.split("?");
    ISNLogger.log( "split url array is " + split_url );
    var split1 = split_url[1];
    if ( split1 && split1.length > 0 ) {

        ISNLogger.log( "tools is " + split1 );
        var split2 = split1.split("=");
        var d_id = split2[1];
        if ( d_id && d_id.length > 0 ) {

            ISNLogger.log( "there is id in the new url and it is " + d_id );
            this.library_item_id = d_id;
            return this.library_item_id;
        }
    }
    return false;
};



BookmarkController.prototype.checkBookmark = function( item_id ) {

    if ( this.models.bookmark.hasItem( item_id ) ){

        ISNLogger.log( 'bookmark found!' );
        window.parent.postMessage( JSON.stringify({
            'bookmarkok': 1
        }) , this.targetHost );
    }
};



BookmarkController.prototype.notifyNewHeight = function( height ) {

    ISNLogger.log( 'enter notify new height' );
    var data = {
        "resize" : {
            "height" : height
        }
    };

    var mdata = JSON.stringify( data );

    //try, catch won't work in this case as multiple tabs / windows may have other domains
    //which will respond to the posted message, so let's strip the domain from the referrer

    //instantiate an anchor DOM object with the document referrer as it's href which allows us to do funky JS 'parsing'
    //use [0] to access the DOM of the jQuery object!
    var temp_parser = $('<a>', { href:document.referrer } )[0];
    ISNLogger.log( 'document.referrer : ' + document.referrer );

    //store our protocol://hostname in a temporary variable
    var message_target = temp_parser.protocol + '//' + temp_parser.hostname ;
    ISNLogger.log( 'temp_parser target : ' + message_target );

    //cross origin message target now stored in 'message_target'
    //attempt to post our message to the host
    window.parent.postMessage( mdata , message_target );
};



var controllerObject = BookmarkController;
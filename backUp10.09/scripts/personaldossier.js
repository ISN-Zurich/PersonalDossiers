/** ********************
common.js
******************** **/
/*jslint vars: true, sloppy: true */

/**opens a view
 * @function openView 
 * */ 

if ( !window.console ) {
    window.console = {'log': function(m){}};
} 

function openView() {
	console.log("first console log message");
	$("#" + this.tagID).show();
}

 

/**closes  a view
 * @function closeView  
 * */
function closeView() {
	$("#" + this.tagID).hide();
}


function showErrorResponses(request){
	console.log("ERROR status text: "+ request.statusText); 
	console.log("ERROR status code: "+ request.statusCode()); 
	console.log("ERROR status code is : " + request.status);
	console.log("ERROR responsetext: "+ request.responseText);
}

function base64_encode (data) {
	console.log("enter base 64 encode");
	  // http://kevin.vanzonneveld.net
	  // +   original by: Tyler Akins (http://rumkin.com)
	  // +   improved by: Bayron Guevara
	  // +   improved by: Thunder.m
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   bugfixed by: Pellentesque Malesuada
	  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // +   improved by: Rafał Kukawski (http://kukawski.pl)
	  // *     example 1: base64_encode('Kevin van Zonneveld');
	  // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	  // mozilla has this native
	  // - but breaks in 2.0.0.12!
	  //if (typeof this.window['btoa'] === 'function') {
	  //    return btoa(data);
	  //}
	  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	    ac = 0,
	    enc = "",
	    tmp_arr = [];

	  if (!data) {
	    return data;
	  }

	  do { // pack three octets into four hexets
	    o1 = data.charCodeAt(i++);
	    o2 = data.charCodeAt(i++);
	    o3 = data.charCodeAt(i++);

	    bits = o1 << 16 | o2 << 8 | o3;

	    h1 = bits >> 18 & 0x3f;
	    h2 = bits >> 12 & 0x3f;
	    h3 = bits >> 6 & 0x3f;
	    h4 = bits & 0x3f;

	    // use hexets to index into b64, and append result to encoded string
	    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	  } while (i < data.length);

	  enc = tmp_arr.join('');

	  var r = data.length % 3;

	  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

	}
/** ********************
views/addBookmarkView.js
******************** **/
/**
 * 
 * this script is executed on digital libary html which is hosted in 
 * the main ISN website. 
 *  
 * 
 */
function DesignBookmarkView(dcontroller) {
    console.log("enter design bookmark view");
    var self = this;
    
    self.controller=dcontroller;

    $('#isn_pd_widget').bind("click", function(e) { //add id dynamically
	if ( e.target.id === "addbmbutton" ) {
            self.addItemToDossier();
        }
    });	

    if ( this.controller.isLoggedin() ) {
	this.open();
    }
}


DesignBookmarkView.prototype.open = function() {
	console.log("open add bookmark view");
	this.update();
};


DesignBookmarkView.prototype.update = function(){
    console.log('update bookmark button');
	//design the bookmark button dynamically in the appropriate div
	
	var bookMarkbuttonContainer = $("<div/>", {
		"id":"bookmark" //add id dynamically
	}).appendTo("#isn_pd_widget");
	
	var bookmarkButton = $("<p/>", {
            "id": "addbmbutton",
		"class":"bold active",
		text:"add Bookmark"
	}).appendTo("#bookmark");
	
	
	
	// display it only when we are logged in
    if ( this.controller.isLoggedin() ) {
        $("#isn_pd_widget").removeClass("none");
    }	
};

DesignBookmarkView.prototype.feedback = function(type) {
    if ( type === 'OK' ) {
        // change from add bookmark to bookmarked
        $('#addbmbutton').text('bookmarked');
    }
};

DesignBookmarkView.prototype.addItemToDossier = function() {
    this.controller.addItem();
};




/** ********************
controllers/addBookmarkController.js
******************** **/
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


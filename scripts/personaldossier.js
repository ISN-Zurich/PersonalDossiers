/*jslint vars: true, sloppy: true */
/*jslint vars: true, sloppy: true */

/**opens a view
 * @function openView 
 * */ 

var debugMode = debugMode();
var hostURL = hostURL();
var baseURL = baseURL();

if ( !window.console ) {
    window.console = {'log': function(m){}};
} 

function debugMode() {
    var debugMode = true;
    return debugMode;
}

function hostURL() {
    var debugURL = "http://yellowjacket.ethz.ch";
    var liveURL = "http://lab.isn.ethz.ch";
    
    return debugMode ? debugURL : liveURL; 
}

function baseURL() {
    var debugPath = "/tools/";
    var livePath = "/";
    
    //return this.hostURL() + (this.debugMode() ? debugPath : livePath); 
    return this.hostURL + debugPath; 
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


function embedBookmarkController() {
    var self=this;

    this.debugMode = debugMode;
    this.hostURL = hostURL;
    this.baseURL = baseURL;
    
    document.domain = 'ethz.ch';
    self.login = false;
    
   window.addEventListener('message', resizeListener, false);
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
    
    $('<iframe/>', { 
        'id': 'isn_pd_authorize', 
        'src': this.baseURL + 'bookmark.html?id='+this.itemId,
        "scrolling":"no"}).appendTo('#isn_pd_widget');
    
    
    
    function resizeListener(m){
    	console.log("receive message");
    	if (m.origin === self.hostURL){

    		console.log("receive message from known host");
    		var data=JSON.parse(m.data);
    		if (data.resize && data.resize.height > 0) {
    			console.log("received resize message");
    			// add the new height to the iframe style
    			$("#isn_pd_authorize").height(data.resize.height);
    			if($("#isn_pd_widget").hasClass("none")){
    				$("#isn_pd_widget").removeClass("none");   
    			}
    		}
    		else if(!$("#isn_pd_widget").hasClass("none")){
    			$("#isn_pd_widget").addClass("none");   

    		}
    	}
    	
    }

}


embedBookmarkController.prototype.isLoggedin = function() {
    return this.login;
};

var controller;
console.log("enter embedBookmar main js");
$(document).ready(function(){
    console.log("document ready in embedBookmarkController");
    controller = new embedBookmarkController();
});
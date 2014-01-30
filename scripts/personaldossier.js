/*jslint vars: true, sloppy: true */
/*jslint vars: true, sloppy: true */

/**opens a view
 * @function openView 
 * */ 


// this will go away
function hostURL() {
    return ISNLogger.choose("http://yellowjacket.ethz.ch", "http://lab.isn.ethz.ch");
}

// this will go way
function baseURL() {
    return ISNLogger.choose("http://yellowjacket.ethz.ch/tools/", "http://lab.isn.ethz.ch/");
}

function openView() {
	ISNLogger.log("first console log message");
	$("#" + this.tagID).show();
}
 
/**closes  a view
 * @function closeView  
 * */
function closeView() {
	$("#" + this.tagID).hide();
}

function showErrorResponses(request){
	ISNLogger.log("ERROR status text: "+ request.statusText); 
	ISNLogger.log("ERROR status code: "+ request.statusCode()); 
	ISNLogger.log("ERROR status code is : " + request.status);
	ISNLogger.log("ERROR responsetext: "+ request.responseText);
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
        "style": "height:0px;",
        "scrolling":"no"}).appendTo('#isn_pd_widget');
    $("#isn_pd_widget").removeClass("none");   
    
    function resizeListener(m){
    	ISNLogger.log("receive message");
    	if (m.origin === self.hostURL){

    		ISNLogger.log("receive message from known host");
    		var data=JSON.parse(m.data);
    		ISNLogger.log("m.data is "+m.data);
    		if (data.resize && data.resize.height > 0) {
    			ISNLogger.log("received resize message");
    			// add the new height to the iframe style
    			$("#isn_pd_authorize").height(data.resize.height);
    			if($("#isn_pd_widget").hasClass("none")){
    				$("#isn_pd_widget").removeClass("none");   
    			}
    		}
    		else {
    			// if(!$("#isn_pd_widget").hasClass("none")){
    			ISNLogger.log("handle message else if");
    			$("#isn_pd_authorize").height(0);
    			
    			// $("#isn_pd_widget").addClass("none");   

    		}
//    		else{
//    			ISNLogger.log(" handle message else");
//    		}
    	}
    }
}

embedBookmarkController.prototype.isLoggedin = function() {
    return this.login;
};

var controller;
ISNLogger.log("enter embedBookmar main js");
$(document).ready(function(){
    ISNLogger.log("document ready in embedBookmarkController");
    ISNLogger.debugMode = false;
    controller = new embedBookmarkController();
});

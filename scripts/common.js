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

// this will go away
function hostURL() {
    var debugURL = "http://yellowjacket.ethz.ch";
    var liveURL = "http://lab.isn.ethz.ch";
    
    return this.debugMode ? debugURL : liveURL; 
}

// this will go way
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

function setDossiersColorization() {
	
	$("#span_dossiers").addClass("pd_selected");
	$("#st_dossiers").removeClass("disable");
	$("#st_dossiers").addClass("pd_sb_icon");
	
	$("#st_user").removeClass("disable");
	$("#st_user").removeClass("pd_sb_icon");
	$("#span_user").addClass("pd_active");
	
	$("#logView").removeClass("pd_sb_icon");
	$("#logView").removeClass("disable");
	$("#logView").addClass("pd_interactionItem");
	$("#logView").addClass("sb_icon");
	$("#logView").addClass("clickable");
	
};


/**
 * Colorization of the interaction box when we are logged out
 * */

function setLoggedOutColorization(){
	$("#logView").addClass("pd_sb_icon");
	$("#span_dossiers").removeClass("pd_selected");
	
	$("#span_user").removeClass("selected");
	$("#st_dossiers").addClass("disable");
	$("#st_user").addClass("disable");
	
};


function setUserProfileColorization(){
	
	$("#st_dossiers").removeClass("disable");
	$("#st_dossiers").removeClass("pd_sb_icon");
	$("#logView").removeClass("pd_sb_icon");
	$("#logView").addClass("sb_icon");
	$("#logView").addClass("clickable");
	$("#span_dossiers").addClass("pd_active");
	
	$("#st_user").removeClass("disable");
	$("#st_user").addClass("pd_sb_icon");
	$("#span_user").removeClass("pd_active");
	$("#span_user").addClass("pd_selected");

};

function pdInitServiceHost() {
    var h = window.location.host;
    var p = window.location.protocol;
    
    this.hostURL = p + '//' + h + '/';
    
    if (h === 'yellowjacket.ethz.ch') {
        h = h + '/tools';   
    }
    
    this.baseURL = p + '//' + h + '/'; // the trailing slash should be part of the service call.
}

function pdGetServiceHost() {
    return this.baseURL;   
}

// not used
function pdPrepareServiceURL(service) {
    return this.controller.serviceHost() + service;
}

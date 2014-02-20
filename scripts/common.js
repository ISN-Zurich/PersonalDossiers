/*jslint vars: true, sloppy: true */

/**opens a view
 * @function openView 
 * */ 

var controlerObject;

//var hostURL = ISNLogger.choose("http://yellowjacket.ethz.ch", "http://lab.isn.ethz.ch");
//var baseURL = ISNLogger.choose("http://yellowjacket.ethz.ch/tools/", "http://lab.isn.ethz.ch/");


// this will go away
function hostURL() {
    return ISNLogger.choose("http://lab.isn.ethz.ch", "http://yellowjacket.ethz.ch");
}

// this will go way
function baseURL() {
    return ISNLogger.choose("http://lab.isn.ethz.ch/", "http://yellowjacket.ethz.ch/tools/");
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
}


/**
 * Colorization of the interaction box when we are logged out
 * */

function setLoggedOutColorization(){
	$("#logView").addClass("pd_sb_icon");
	$("#span_dossiers").removeClass("pd_selected");
	
	$("#span_user").removeClass("selected");
	$("#st_dossiers").addClass("disable");
	$("#st_user").addClass("disable");
}


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
}

function pdInitServiceHost() {
    var h = window.location.host;
    var p = window.location.protocol;
    
    // this.hostURL = p + '//' + h + '/';    
    this.hostURL = hostURL()
    this.baseURL = baseURL(); // the trailing slash should be part of the service call.
}

function pdGetServiceHost() {
    return this.baseURL;   
}

function pdIsAuthenticated() {
    if (this.models.user && this.models.user.getUserId) {
        return this.models.user.getUserId() > 0 ? true : false;
    }
    return false;
}

function pdGetActiveDossierID() {
    this.controller.getActiveDossier();
}

// not used
function pdPrepareServiceURL(service) {
    return this.controller.serviceHost() + service;
}

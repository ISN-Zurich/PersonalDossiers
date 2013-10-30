/*jslint vars: true, sloppy: true */

/**opens a view
 * @function openView 
 * */ 

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
    
    return this.debugMode() ? debugURL : liveURL; 
}

function baseURL() {
    var debugPath = "/tools/";
    var livePath = "/";
    
    //return this.hostURL() + (this.debugMode() ? debugPath : livePath); 
    return this.hostURL() + debugPath; 
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
	//$("#span_dossiers").removeClass("pd_active");
	$("#span_dossiers").addClass("pd_selected");
	$("#st_dossiers").removeClass("disable");
	$("#st_dossiers").addClass("pd_a_selected");
	
	$("#st_user").removeClass("disable");
	$("#logView").removeClass("pd_a_selected");
	$("#logView").removeClass("disable");
	$("#st_user").removeClass("pd_a_selected");
	$("#span_user").addClass("pd_active");
	
	//$("#span_dossiers").addClass("pd_selected");
	
	$("#modifiedListHeader").removeClass("hide");
	 $("#followingListHeader").removeClass("hide");
	 $("#addDossierBtn").removeClass("hide");
	 $("#profileViewContainer").addClass("hide");
	 $("#userProfile").addClass("hide");
};


/**
 * Colorization of the interaction box when we are logged out
 * */

function setLoggedOutColorization(){
	$("#profileViewContainer").addClass("hide");
	$("#logView").addClass("pd_a_selected");
	$("#span_dossiers").removeClass("pd_selected");
	//$("#span_dossiers").addClass("pd_disable");
	$("#span_user").removeClass("selected");
	//$("#span_user").addClass("pd_disable");
	$("#st_dossiers").addClass("disable");
	$("#st_user").addClass("disable");
	
};


function setUserProfileColorization(){
	
	
	$("#st_dossiers").removeClass("disable");
	$("#st_dossiers").removeClass("pd_a_selected");
	$("#logView").removeClass("pd_a_selected");
	$("#span_dossiers").addClass("pd_active");
	
	$("#st_user").removeClass("disable");
	$("#st_user").addClass("pd_a_selected");
	$("#span_user").removeClass("pd_active");
	$("#span_user").addClass("pd_selected");
	
	$("#addDossierBtn").addClass("hide");
	$("#profileViewContainer").removeClass("hide");
	$("#userProfile").removeClass("hide")
	controller.views.user.open();
	("#welcome").addClass("hidden");

	
	
	
};


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

function UserModel(userController){
    console.log("runs user model");
    var self=this;
    self.controller=userController;	
    self.userProfile;
    // self.checkActiveUser();
    self.loadData();
    $(document).bind("ActiveDossierChanged", function() {
        self.sendUserProfileToServer();
    });  
}

UserModel.prototype.loadData = function() {

    var profileObj=localStorage.getItem("userProfile");

    if (profileObj){
	profileObj= JSON.parse(profileObj);
    }
    this.userProfile=profileObj;

};

UserModel.prototype.getActiveDossier = function(){
    console.log("enter getActiveDossierFromUserProfile");
    var activeDossierId = undefined;
    if ( this.activeDossierId ) {
        return this.activeDossierId;
    }
    var profObj= localStorage.getItem("userProfile");
    if (profObj){
	profObj=JSON.parse(profObj);
	activeDossierId = profObj.activeDossierId;
	if (activeDossierId) {
            this.activeDossierId = activeDossierId;
            $(document).trigger("ActiveDossierReady");
	}
	console.log("active dossier Id from the storage is "+activeDossierId);
	
    } //end of if profObj	
    return activeDossierId;
};


UserModel.prototype.getUserId = function(){
    return this.userProfile.user_id;
};


UserModel.prototype.getUserProfile=function(){
    var self = this;
    var url= 'http://yellowjacket.ethz.ch/tools/service/authentication.php';
    var method = 'GET';
    
    $.ajax({
	url:  url,
	type : method,
	dataType : 'json',
	success : success,
	error : function(request) {
	    //self.controller.transition("login");
	    console.log("Error while getting the user profile");
	    showErrorResponses(request); 

            // this means that the user is not logged in.
            if ( self.controller.models.authentication ) {
                self.controller.models.authentication.clearAccessToken();
                self.controller.initOAuth();
                self.controller.models.authentication.getRequestToken();
            }
            else {
                // forward to a page that has the authentication 
                console.log('userModel: forward to user.html');
                
                window.location.href = '/tools/user.html';
            }
	},
	beforeSend : setHeader
    });

    
    
    function success(data){
	self.userProfile=data;
	console.log("user profile data are: "+JSON.stringify(self.userProfile));
	console.log("open the welcome view");
	var stringProfile=JSON.stringify(self.userProfile);
	localStorage.setItem("userProfile",stringProfile);
	console.log("user profile item from local storage is "+localStorage.getItem("userProfile"));
	$(document).trigger('UserProfileUpdate'); 
	self.controller.transition("welcome");
	
	//self.getUserDossiers();
	//self.controller.models['dossierList'].getUserDossiers();
    }
    
    function setHeader(xhr){
	if ( self.controller.oauth ){
	    var header_request=self.controller.oauth.oauthHeader(method, url);
	    xhr.setRequestHeader('Authorization', header_request);
        }
    }
};


UserModel.prototype.setActiveDossier = function(dossierId){
    if( this.controller.models.dossierList.dossierList && this.controller.models.dossierList.dossierList.length > 0) {
	this.activeDossier=dossierId;
	//store in the local storage
        if (!this.userProfile) {
            this.userProfile = {};
        }
	this.userProfile.activeDossierId=dossierId;
	var profileString = JSON.stringify(this.userProfile);
	localStorage.setItem("userProfile", profileString);
	$(document).trigger("ActiveDossierChanged");
	console.log("local storage after store of active dossier id "+ localStorage.getItem("userProfile"));
    }
};

UserModel.prototype.checkActiveUser = function(){
    if(this.controller.oauth) {
	console.log("get user profile");
	this.getUserProfile();
    }
    else if (this.controller.models.authentication) {
        // we are on the login page so we can play some magic.
        this.controller.models.authentication.getRequestToken();
    }
    else {
        // send the user to the login page
        window.location.href = '/tools/user.html';
	//console.log("get request token in checkactiveUser");
	
    }
};

/**
 * Send the user profile data to the server containing
 * - user info i.e. name, email
 * - active ID
 * This function is mainly called whenever we click on a dossier, which 
 * means we change the active dossier, so the user profile needs to be udpated
 * */

UserModel.prototype.sendUserProfileToServer = function(){
    var self=this;
    var url='http://yellowjacket.ethz.ch/tools/service/authentication.php';
    var method = 'POST';
    //	var data = {
    //			"user_id":self.userProfile.user_id,
    //			"name": self.userProfile.name,
    //			"email": self.userProfile.email,
    //			"activedDossier":self.userProfile.activeDossierId
    //	};
    var data=JSON.stringify(self.userProfile);
    
    $.ajax({
	url:  url,
	type : method,
	data: data,
	dataType : 'json',
	success : success,
	error : function(request) {
	    console.log("Error while sending the user profile data to the server");
	    showErrorResponses(request); 
	},
	beforeSend : setHeader
    });
    
    function success(data){
	console.log("success in sending the user profile data to the server");
    }
    
    function setHeader(xhr){
	var header_request=self.controller.oauth.oauthHeader(method,url);
	xhr.setRequestHeader('Authorization', header_request);
    }
};

UserModel.prototype.logout =function(){
    var self=this;
    var url= "http://yellowjacket.ethz.ch/tools/service/authentication.php/access_token";
    $.ajax({
	url: url,
	type : 'DELETE',
	dataType : 'json',
	success : success,
	error : function(request) {
	    
	    showErrorResponses(request); 
	    //display a message to the user that the logout was not successful
	    if (request.status == 401){
		console.log("success in logging out from the server");
		var authentication={
		    consumerSecret:"6a33d1d90067c005de32f5f6aafe082ae8375a6f",
		    consumerKey :"ch.isn.personal-dossier",
		    "accessToken":"",
		    "access_secret":""
		}

		localStorage.setItem('authentication', JSON.stringify(authentication));
                self.controller.initOAuth();
		self.checkActiveUser();
		//self.setInitParameters();
		//self.controller.transition("login");
	    }else{
		console.log("Error while invalidating access token");
	    }
	},
	beforeSend : setHeader
    });
    
    
    function success(){
	//delete from localstorage the access token and access secret 
	//or maybe move it outside the function right below
    }
    
    function setHeader(xhr){
	var header_request= self.controller.oauth.oauthHeader(url, "DELETE");
	xhr.setRequestHeader('Authorization', header_request);	
    }
    
};


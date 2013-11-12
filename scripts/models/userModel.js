/*jslint vars: true, sloppy: true */

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
    
    if (!self.controller.oauth){
    	console.log("we are not logged in we reset the user profile");
    	this.resetUserProfile();
    }
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
       //     $(document).trigger("ActiveDossierReady");
	}
	console.log("active dossier Id from the storage is "+activeDossierId);
	
    } //end of if profObj	
    return activeDossierId;
};


UserModel.prototype.getUserId = function(){
    return this.userProfile.user_id;
};


UserModel.prototype.getName = function(){
	if (this.userProfile){
    return this.userProfile.name;
	}
	return false;
};
UserModel.prototype.setName = function(name){
	if (!this.userProfile){
		this.userProfile={};
	}
	this.userProfile.name=name;
};


UserModel.prototype.getPassword = function(){
	if (this.userProfile){
		return this.userProfile.password;
	}
	return false;
};

UserModel.prototype.getEmail = function(){
	console.log("enter get email");
    if (this.userProfile){
	return this.userProfile.email;
    }
    return false;
};
UserModel.prototype.setUserEmail = function(email){
	console.log("enter set user mail");
	if (!this.userProfile){
		this.userProfile={};
	}
	this.userProfile.email=email;
	console.log("email after set is "+this.userProfile.email);
	
};



UserModel.prototype.getTitle = function(){
	if (this.userProfile){
    return this.userProfile.title;
	}
	return false;
};

UserModel.prototype.setUserTitle = function(title){
	if (!this.userProfile){
		this.userProfile= {};
	}
	this.userProfile.title=title;
};

UserModel.prototype.validatePasswordConfirmation=function(){
	
};

UserModel.prototype.getUserProfile=function(){
    var self = this;
    var url= this.controller.baseURL +'service/authentication.php';
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
	//self.controller.transition("welcome"); the opening of the view will be bound in controler, when dossier list will be updated
										// the dossier list  model will be loaded when the user profile update will be bound in dossier list model
	
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
	console.log("enter send user profile to server");
    var self=this;
    var url=this.controller.baseURL +'service/authentication.php';
    console.log("url is "+url);
    var method = 'POST';
    var dataObject = {
    		"user_id":self.userProfile.user_id,
    		"title":self.userProfile.title,
    		"name": self.userProfile.name,
    		"username": self.userProfile.username,
    		"email": self.userProfile.email,
    		"activedDossier": this.userProfile.activeDossierId
    };
   
 var data=JSON.stringify(dataObject);
  
  
// var data=JSON.stringify(self.userProfile);
    
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
    var url= this.controller.baseURL +"service/authentication.php/access_token";
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

UserModel.prototype.sendUserPasswordToServer = function(password,mail){
	var self=this;
	//self.email = self.getEmail();

	var hash1= hex_sha1(mail+password);
	console.log(" hash1 in send password to server "+hash1);

	 var url= this.controller.baseURL +'service/authentication.php/password';
	 var method = 'POST';
	 
	 var dataObject= { 
			 "user_id":self.userProfile.user_id,
			 "password":hash1
		};
	 
	 var data=JSON.stringify(dataObject);
	    
	 $.ajax({
		url:  url,
		type : method,
		data: data,
		dataType : 'json',
		success : success,
		error : function(request) {
		    console.log("Error while sending the password to the server");
		    showErrorResponses(request); 
		},
		beforeSend : setHeader
	    });
	    
	    function success(data){
		console.log("success in sending the password to the server");
	    }
	    
	    function setHeader(xhr){
	    	if (self.controller.oauth)   {
		var header_request=self.controller.oauth.oauthHeader(method,url);
		xhr.setRequestHeader('Authorization', header_request);
	    }else{
        	var non_authenticationFlag=true;
       	 xhr.setRequestHeader('NonAuth', non_authenticationFlag);	
       }}
};

/**
 * 
 * we pass as an argument the password becasuse for security reasons
 * we don't want to store it in the model, like we did with the rest 
 * user profile information i.e. name, title, mail.
 *  * 
 * */

UserModel.prototype.register = function(password){
	console.log("enter register in user model");
	var self=this;
	var mail=self.getEmail();
	console.log("mail is "+mail);
	console.log("password is "+password);
	var hash1= hex_sha1(mail+password); 
	console.log("hash1 is "+hash1);
	
	var url= self.controller.baseURL +'service/authentication.php/register';
	var method = 'POST';
	console.log("url is "+url);
	
	 var dataObject= { 
			  "title": self.getTitle(),
			  "name": self.getName(),
			  "email": mail,
			  "password":hash1
		};
	 
	 var data=JSON.stringify(dataObject);
	 
	 console.log("before ajax request");
	 $.ajax({
		url:  url,
		type : method,
		data: data,
		dataType : 'json',
		success : success,
		error : function(request) {
			if (request.status === 403){
		    console.log("Error while registering the user to the server: 403");
		    $("#pd_registration_email_label").css('background-color', 'red');
			$("#pd_registration_email_label").css('color', '#fff'); 
			
			  var span=$("<span/>", {
			    	"id":"registration_mail",
			    	"class":"pd_warning", 
			    	text:"email already taken"
			        }).appendTo("#emailRegistrationInput");
			
		    showErrorResponses(request); 
			}
			
			if (request.status === 405){
			    console.log("Error while registering the user to the server:405");
			    $("#pd_registration_email_label").css('background-color', 'red');
				$("#pd_registration_email_label").css('color', '#fff'); 
				
//				  var span=$("<span/>", {
//				    	"id":"registration_mail",
//				    	"class":"pd_warning", 
//				    	text:"you should type an email"
//				        }).appendTo("#emailRegistrationInput");
				
			    showErrorResponses(request); 
			}
			
		},
		beforeSend : setHeader
	    });
	 
	    console.log("after ajax request");
	    function success(data){
		console.log("success in registering the user to the server");
	    }
	    function setHeader(xhr){
	    	if (self.controller.oauth)   {
		var header_request=self.controller.oauth.oauthHeader(method,url);
		xhr.setRequestHeader('Authorization', header_request);
	    }else{
        	var non_authenticationFlag=true;
       	 xhr.setRequestHeader('NonAuth', non_authenticationFlag);	
       }}
};


/**
 * empty from the local storage the userprofile
 * 
 **/
UserModel.prototype.resetUserProfile = function(){
	console.log("enter reset user profile");
	//empty the local storage
	localStorage.removeItem("userProfile");
	//empty the local variabl
	this.userProfile=null;
};
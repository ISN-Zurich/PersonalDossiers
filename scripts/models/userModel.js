/*jslint vars: true, sloppy: true */

function UserModel(userController){
    console.log("runs user model");
    var self=this;
    self.controller=userController;	
    self.userProfile;
    self.validation_array={
    		"name": 0,
    		"email": 0,
    		"password":0, 
    		"confirmPassword":0
    	};
    
    self.emailValidated=false;
    self.emailEmpty=false;
    
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
	console.log("enter setName");
	if (!this.userProfile){
		this.userProfile={};
	}
	this.userProfile.name=name;
	
	//check emptiness of name
	if (name.length===0){
		$(document).trigger('NameEmpty');
		this.setValidationField("name", 0);
	}
 
	this.setValidationField("name", 1);
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
	
	//check emptiness of email field
	
	if(email.length === 0){
		//this.emailEmpty=true;
		$(document).trigger('EmailEmpty');
		 this.setValidationField("email", 0);
	} 
	// validate email here !
	if (email){
	this.checkEmailValidation(email);
	}
	
};




UserModel.prototype.setPassword = function(pwd_hash,pwd_length){
	
	if (!this.userProfile){
		this.userProfile={};
	}
	this.userProfile.password=pwd_hash;

	//check password emptiness
	if(!pwd_hash){
		$(document).trigger('PasswortEmpty');
		this.setValidationField("password", 0);
	} 
	
	//check password validity
	if (pwd_hash){
	this.checkPasswordValidity(pwd_length);
	}
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


UserModel.prototype.setConfirmPassword = function(confirm_password,password){
	
	//check emptiness of confirmation password
	if (!confirm_password){
		$(document).trigger('PasswortConfirmEmpty');
		this.setValidationField("confirmPassword", 0);
	}
	
	//check matching of confirmation password with password
	if(confirm_password){
		this.checkPasswordConfirmation(password,confirm_password);
	}
};

UserModel.prototype.checkPasswordConfirmation=function(password, confirm_password){
	if (password != confirm_password){
		 this.setValidationField("confirmPassword", 0);
	} 
	 this.setValidationField("confirmPassword", 1);
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
	var email=self.getEmail();
	var hash1= hex_sha1(email+password); 
	console.log("hash1 is "+hash1);
	
	var url= self.controller.baseURL +'service/authentication.php/register';
	var method = 'POST';
	console.log("url is "+url);
	
	 var dataObject= { 
			  "title": self.getTitle(),
			  "name": self.getName(),
			  "email": email,
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
		    console.log("Error while registering the user to the server, email taken : 403");
		    $(document).trigger('EmailAlreadyTaken'); 
		}
			
		
		//backend validation that checks the emptiness of the email field
			
			if (request.status === 405){
			    console.log("Error while registering the user to the server: email empty :405");
			    
			    $(document).trigger('EmailEmpty'); 						
			    showErrorResponses(request); 
			}
			
		},
		beforeSend : setHeader
	    });
	 
	    console.log("after ajax request");
	    function success(data){
		console.log("success in registering the user to the server and mail is"+self.getEmail());
		console.log("the password in success is "+password);
		$(document).trigger('RegistrationDone', [self.getEmail(), password]); 
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


/**
 * Return true if
 *  - all the manadatoy fields have been set (first 3 elements of array)
 *  - the password matches the confirmed password (the 4th elemet of the array)
 * Other wise return false
 */
UserModel.prototype.checkRegistrationValidation= function(){
	var self=this;
	console.log("enter check registation validation");
	var sum=0, i; 
	sum= self.validation_array["name"]+self.validation_array["email"] + self.validation_array["password"] +self.validation_array["confirmPassword"];
	console.log("sumvalue is "+sum);
	if (sum === 4){
		$(document).trigger('RegistrationValidated');
		return;
	}
	$(document).trigger('RegistrationNotValidated');
};


UserModel.prototype.getHashPassword = function(password){
	var self=this;
	console.log("enter hash password");
	var email=self.getEmail();
	if (password){
	var hash= hex_sha1(email+password); 
	return hash;
	}
	return false;
};

//avoid transferring the actual password, and pass its length
UserModel.prototype.checkPasswordValidity = function(passwordlength){
	if (passwordlength <6){
		$(document).trigger('PasswortNotValidated');
		this.setValidationField("password", 0);
	}
	
	this.setValidationField("password", 1);
};


UserModel.prototype.setValidationField = function(fieldString, value){
	this.validation_array[fieldString] = value;
	this.checkRegistrationValidation();
};


UserModel.prototype.checkEmailValidation = function(email){
	console.log("enter check email validation");

	var reqExp=new RegExp("^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$");
	result= reqExp.exec(email);
	console.log("result of execution of regular expression is "+result);
	if (!result){
		$(document).trigger('EmailNotValidated');
		this.validation_array["email"]=0;
		this.checkRegistrationValidation();
	}
	
	this.setValidationField("email", 1);
};


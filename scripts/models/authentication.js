
function AuthenticationModel(controller){
    console.log("enter authentication model");
    var self=this;
    self.controller=controller;

    //store the consumer key, secret and the access token and secret
    this.authentication={};

    this.consumerSecret;
    this.consumerKey;
    this.loadData();

    this.requestToken_header;
    this.obtain_authorize_header;
    this.request_token;
    this.token_secret;
    this.oauth_callback;
    this.verificationCode;
    this.userProfile;
    this.dossierList =[];

    // create an eventlistener for the case when the user profile changes.
    
    //after a successful registation the user should automatically log into the dossier list area
    
    $(document).bind("RegistrationDone", function(e, mail, pswd){
    	console.log("registration done is bound in authentication model");
    	console.log("mail in bound is "+mail);
    	console.log("password in bound is "+pswd);
    	self.authenticateUser(mail, pswd);
    });
    
    
}


AuthenticationModel.prototype.storeData = function(){
    var authString;
    try{
        authString = JSON.stringify(this.authentication);
    }
    catch(err){
        authString="";
        console.log("error log while storing authentication data");
    }
    localStorage.setItem("authentication",authString);
    console.log("Authentication storage after store Data "+localStorage.getItem("authentication"));
};


AuthenticationModel.prototype.loadData=function(){
    var authObject;
    //if there is an item in the local storage with the name "authentication"
    //then get it by parsing the string and convert it into a json object
    try {
        authObject = JSON.parse(localStorage.getItem("authentication"));
    }
    catch (err) {
        console.log("error! while loading");
    }

    console.log("authenticationObject: " + JSON.stringify(authObject));


    if (!authObject) {
        console.log("initialize the local storage");
        authObject = {
            consumerSecret:"6a33d1d90067c005de32f5f6aafe082ae8375a6f",
            consumerKey :"ch.isn.personal-dossier"
        };

        localStorage.setItem("authentication",authObject);
    }

    this.authentication = authObject;
};


AuthenticationModel.prototype.setInitParameters=function(){
    var self=this;
    var accessor={
        consumerKey:     self.authentication.consumerKey,
        consumerSecret : self.authentication.consumerSecret,
        tokenSecret: ""
    };
    var message={
        method:"GET",
        action: self.controller.baseURL +"service/authentication.php/request_token",
        parameters: [
            ["oauth_signature_method","HMAC-SHA1"],
            ["oauth_version","1.0"]
        ]
    };

    OAuth.completeRequest(message, accessor);

    var parameters=message.parameters;
    var header_request= OAuth.getAuthorizationHeader(self.controller.baseURL, parameters);
    console.log("request header is "+header_request);
    self.requestToken_header=header_request;
};

/**
 * send the consumerToken and the consumerHash to the server
 * and receive the requestToken and the requestSecret
 * to get the request token out of this request
 **/


AuthenticationModel.prototype.getRequestToken=function(){
    var self=this;
    $.ajax({
        url:  self.controller.baseURL +'service/authentication.php/request_token',
        type : 'GET',
        dataType : 'json',
        success : getAuthenticationInitData,
        error : function(request) {
            console.log("Error while getting request token");
            showErrorResponses(request);
            // REMINDER: tell the user that he/she it cannot get a request token
            // we must not show the login view
        },
        beforeSend : setHeaderR
    });

    function getAuthenticationInitData(data){
        console.log("success in initializing authentication and data are "+JSON.stringify(data));

        self.request_token=data.oauth_token;
        self.token_secret=data.oauth_token_secret;
        console.log("request token is "+self.request_token);
        console.log("request token secret "+self.token_secret);

        //try to get a verification code
        self.obtainAuthorization();
    }

    function setHeaderR(xhr) {
        self.setInitParameters();
        xhr.setRequestHeader('Authorization', self.requestToken_header);
    }
};


AuthenticationModel.prototype.obtainAuthorization = function(){
    var self=this;
    var url= self.controller.baseURL + 'service/authentication.php/authorize';
    var method="GET";
    $.ajax({
        url: url,
        type : method,
        //optionally i can send in the body of the request as data the request_token
        dataType : 'json',
        success : getVerificationCode,
        error : function(request) {
            console.log("Error while getting verification code");
            showErrorResponses(request);

            self.controller.transition("login");
        },
        beforeSend : setHeaderO
    });

    function getVerificationCode(data){
        console.log("get successfully verification code");
        self.verificationCode_code=data.verification_code;
        //since we got a verification code, we request as next step the access token
        self.requestAccessToken();
    }

    function setHeaderO(xhr,S){
        var accessor={
            consumerKey: self.authentication.consumerKey,
            consumerSecret : self.authentication.consumerSecret,
            tokenSecret: self.token_secret,
            token:self.request_token
        };
        var message={
            'method':method,
            'action': url,
            'parameters': [
                ["oauth_signature_method","HMAC-SHA1"],
                ["oauth_version","1.0"], ["oauth_token",self.request_token]
            ]
        };

        OAuth.completeRequest(message, accessor);
        var parameters=message.parameters;
        var header_request= OAuth.getAuthorizationHeader(self.controller.baseURL, parameters);

        console.log('set obtainAccessToken authorization header ' + header_request);
        //create the new header the will contain also the request token
        xhr.setRequestHeader('Authorization', header_request);

        console.log('obtain header set!');
    }
};



AuthenticationModel.prototype.authenticateUser = function(email, password){
    var self=this;
    console.log("email is"+email);
    console.log("password is"+password);
    var hash1= hex_sha1(email+password);
    console.log(" hash1 "+hash1);


    var string=self.token_secret +self.authentication.consumerSecret + hash1;
    var hash_pswd=hex_sha1(string);
    console.log("credentials: " + hash_pswd);
    var data= {
        "email":email,
        "credentials":hash_pswd
    };

    var url=self.controller.baseURL +'service/authentication.php/authorize';
    console.log("url in authenticate user is "+url);
    var method="POST";

    $.ajax({
        url:  url,
        type : method,
        data:data,
        dataType : 'json',
        success : success,
        error : function(request) {
            console.log("Error while authenticating user");
            showErrorResponses(request);
            self.controller.transition("login");
        },
        beforeSend : setHeader
    });

    function setHeader(xhr){

        console.log("what token do we insert? " + self.request_token);
        var accessor={
            consumerKey: self.authentication.consumerKey,
            consumerSecret : self.authentication.consumerSecret,
            tokenSecret: self.token_secret,
            token: self.request_token
        };
        console.log("consumer Secret issssss "+self.authentication.consumerSecret);
        console.log("token Secret issssss "+self.token_secret);

        var message={
            method:method,
            action: url,
            parameters: [
                ["oauth_signature_method","HMAC-SHA1"],
                ["email", email],
                ["credentials",hash_pswd ]
            ]
        };

        OAuth.completeRequest(message, accessor);
        console.log(OAuth.SignatureMethod.getBaseString(message));
        var parameters=message.parameters;
        var header_request= OAuth.getAuthorizationHeader(self.controller.baseURL, parameters);

        //use the Authorization header that contains also the request token and token secret
        console.log( 'set authorization header ' + header_request);
        xhr.setRequestHeader('Authorization', header_request);
    }

    function success(data){
        //get the verification code
        self.verificationCode=data.oauth_verifier;
        console.log("verificaiton code is   "+self.verificationCode);
        //grant accessToken
        self.requestAccessToken();
    }
};


AuthenticationModel.prototype.requestAccessToken = function() {
    console.log("enter request access token");
    var self=this;

    var accessor={
        consumerKey: self.authentication.consumerKey,
        consumerSecret : self.authentication.consumerSecret,
        tokenSecret: self.token_secret,
        token: self.request_token
    };

    var message={
        method:"GET",
        action: self.controller.baseURL + "service/authentication.php/access_token",
        parameters: [
            ["oauth_signature_method","HMAC-SHA1"],
            ["oauth_verifier", self.verificationCode]
        ]
    };

    OAuth.completeRequest(message, accessor);

//	OAuth.setTimestampAndNonce(message);
//	console.log("set timestamp and nonce");
//	OAuth.SignatureMethod.sign(message, accessor);
    var parameters=message.parameters;
    var header_request= OAuth.getAuthorizationHeader(self.controller.baseURL, parameters);

    $.ajax({
        url:  self.controller.baseURL +'service/authentication.php/access_token',
        type : 'GET',
        dataType : 'json',
        success : success,
        error : function(request) {
            self.controller.transition("login");
            console.log("Error while getting access token");
            showErrorResponses(request);
        },
        beforeSend : setHeader
    });

    function success(data){
        //get back from request the access_token and access_secret
        console.log("success in granting access token");
        console.log("access_token is "+self.accesstoken);
        self.authentication.accessToken=data.oauth_token;
        self.authentication.accessSecret=data.oauth_token_secret;
        self.storeData();
        self.controller.initOAuth();
        self.controller.models['user'].getUserProfile();
       // self.controller.updateUserData(); we will load id after the user profile will be bound in dossier list model
    }

    function setHeader(xhr){
        xhr.setRequestHeader('Authorization', header_request);
    }
};

AuthenticationModel.prototype.checkActiveUser = function(){
    console.log("access token in checkActiveUser is  "+this.authentication.accessToken);
    if(this.authentication.accessToken && this.authentication.accessToken.length>0){
        console.log("get user profile");
        this.controller.models['user'].getUserProfile();
    }
    else{
        console.log("get request token in checkactiveUser");
        this.getRequestToken();
    }
};

AuthenticationModel.prototype.clearAccessToken=function(){
    this.authentication.accessToken = "";
    this.authentication.accessSecret = "";
    // overwrite the data in the local storage
    this.storeData();
};




AuthenticationModel.prototype.logout =function(){
    var self=this;
    var url= self.controller.baseURL +"service/authentication.php/access_token";
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
                self.authentication={
                    consumerSecret:"6a33d1d90067c005de32f5f6aafe082ae8375a6f",
                    consumerKey :"ch.isn.personal-dossier",
                    "accessToken":"",
                    "access_secret":""
                };
                self.storeData();
                self.controller.initOAuth();
                self.checkActiveUser();
                //self.setInitParameters();
                //self.controller.transition("login");
                $(document).trigger("LogoutSent");
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



AuthenticationModel.prototype.isLoggedIn = function(){
    return this.authentication.accessToken && this.accessSecret ? true : false;
};


//AuthenticationModel.prototype.getConsumerKey = function(){
//	authO
//	return this.authentication.consumerKey;
//};
//
//AuthenticationModel.prototype.getConsumerSecret = function(){
//	return this.authentication.consumerSecret;
//};


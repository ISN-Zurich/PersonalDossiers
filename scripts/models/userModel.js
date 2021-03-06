/*jslint vars: true, sloppy: true */
function UserModel( userController ) {

    ISNLogger.log( 'runs user model' );
    var self = this;
    self.controller = userController;
    self.userProfile;
    self.validation_array = {
        "name": 0,
        "email": 0,
        "password":0,
        "confirmPassword":0
    };
    self.emailValidated = false;
    self.emailEmpty = false;

    // self.checkActiveUser();
    self.loadData();
    $(document).bind( 'ActiveDossierChanged' , function(){

        self.sendUserProfileToServer();
    });
    if ( !self.controller.oauth ) {

        ISNLogger.log( 'we are not logged in we reset the user profile' );
        this.resetUserProfile();
    }
}



UserModel.prototype.loadData = function(){

    var profileObj = localStorage.getItem( 'userProfile' );
    if ( profileObj ) {

        profileObj = JSON.parse( profileObj );
    }
    this.userProfile = profileObj;
};



UserModel.prototype.getActiveDossier = function(){

    ISNLogger.log( 'enter getActiveDossierFromUserProfile' );
    var activeDossierId = undefined;
    if ( this.activeDossierId ) {

        return this.activeDossierId;
    }
    var profObj = localStorage.getItem( 'userProfile' );
    if ( profObj ) {

        profObj = JSON.parse( profObj );
        activeDossierId = profObj.activeDossierId;
        if ( activeDossierId ) {

            this.activeDossierId = activeDossierId;
            //     $(document).trigger("ActiveDossierReady");
        }
        ISNLogger.log( 'active dossier Id from the storage is ' + activeDossierId );
    }
    return activeDossierId;
};



UserModel.prototype.getUserId = function(){

    return this.userProfile ? this.userProfile.user_id : undefined ;
};



UserModel.prototype.getName = function(){

    return this.userProfile ? this.userProfile.name : false ;
};



UserModel.prototype.setName = function( name ) {

    ISNLogger.log( 'enter setName' );
    if ( !this.userProfile ) {

        this.userProfile = {};
    }
    this.userProfile.name = name;

    //check emptiness of name
    if ( name.length === 0 ) {

        $(document).trigger( 'NameEmpty' );
        this.setValidationField( 'name' , 0 );
    }
    this.setValidationField( 'name' , 1 );
};



UserModel.prototype.getPassword = function(){

    return this.userProfile ? this.userProfile.password : false ;
};



UserModel.prototype.getEmail = function(){

    ISNLogger.log( 'enter get email' );
    return this.userProfile ? this.userProfile.email : false ;
};



UserModel.prototype.setUserEmail = function( email ) {

    ISNLogger.log("enter set user mail");
    if ( !this.userProfile ) {

        this.userProfile = {};
    }
    this.userProfile.email = email;

    //check emptiness of email field
    if( email.length === 0 ) {

        //this.emailEmpty=true;
        $(document).trigger('EmailEmpty');
        this.setValidationField("email", 0);
    }

    // validate email here !
    if ( email ) {

        this.checkEmailValidation(email);
    }
};



UserModel.prototype.setPassword = function( pwd_hash , pwd_length ) {

    if ( !this.userProfile ) {

        this.userProfile = {};
    }
    this.userProfile.password = pwd_hash;

    //check password emptiness
    if( !pwd_hash ) {

        $(document).trigger('PasswortEmpty');
        this.setValidationField("password", 0);
    }

    //check password validity
    if ( pwd_hash ) {

        this.checkPasswordValidity( pwd_length ) ;
    }
};



UserModel.prototype.getTitle = function(){

    return this.userProfile ? this.userProfile.title : false ;
};



UserModel.prototype.setUserTitle = function( title ) {

    if ( !this.userProfile ) {

        this.userProfile = {};
    }
    this.userProfile.title = title;
};



UserModel.prototype.setConfirmPassword = function( confirm_password , password ) {

    //check emptiness of confirmation password
    if ( !confirm_password ) {

        $(document).trigger('PasswortConfirmEmpty');
        this.setValidationField("confirmPassword", 0);
    }

    //check matching of confirmation password with password
    if ( confirm_password ) {

        this.checkPasswordConfirmation( password , confirm_password );
    }
};



UserModel.prototype.checkPasswordConfirmation = function( password, confirm_password ) {

    if ( password != confirm_password ) {

        this.setValidationField( "confirmPassword", 0 );
    }
    this.setValidationField( "confirmPassword", 1 );
};



UserModel.prototype.getUserProfile = function(){

    var self = this;
    var url= baseURL() + 'service/authentication.php';
    var method = 'GET';

    $.ajax({
        url:  url,
        type : method,
        dataType : 'json',
        success : success,
        error : function( request ) {

            //self.controller.transition("login");
            ISNLogger.log( 'Error while getting the user profile' );
            showErrorResponses( request );

            // this means that the user is not logged in.
            if ( self.controller.models.authentication ) {

                self.controller.models.authentication.clearAccessToken();
                self.controller.initOAuth();
                self.controller.models.authentication.getRequestToken();
            } else {
                // forward to a page that has the authentication
                ISNLogger.log( 'userModel: forward to user.html' );
                
                // FIXME: only forward to user.html if we are stand alone. 
                // AKA not part of an embed or bookmark page)
                self.transitionToLogin();
                
            }
        },
        beforeSend : setHeader
    });


    function success( data ) {

        //handle our successful data return, json encode the return and...
        self.userProfile = data;
        var stringProfile = JSON.stringify( self.userProfile );
        ISNLogger.log( 'user profile data are: ' + stringProfile );

        //place it in localStorage item userProfile, log the value that's stored to check consistency
        localStorage.setItem( 'userProfile' , stringProfile );
        ISNLogger.log( 'user profile item from local storage is ' + localStorage.getItem( 'userProfile' ) );

        //trigger user profile update event
        $(document).trigger( 'UserProfileUpdate' );
        ISNLogger.log( 'open the welcome view ');
        //self.controller.transition("welcome"); the opening of the view will be bound in controler, when dossier list will be updated
        // the dossier list  model will be loaded when the user profile update will be bound in dossier list model
    }


    function setHeader(xhr){

        if ( self.controller.oauth ){

            var header_request = self.controller.oauth.oauthHeader( method, url );
            xhr.setRequestHeader( 'Authorization', header_request );
        }
    }
};



UserModel.prototype.setActiveDossier = function( dossierId ) {

    ISNLogger.log( 'enter set Active Dossier in user model' );
    if ( this.controller.models.dossierList.dossierList && this.controller.models.dossierList.dossierList.length > 0 ) {

        this.activeDossier = dossierId;
        //store in the local storage
        if ( !this.userProfile ) {

            this.userProfile = {};
        }
        this.userProfile.activeDossierId = dossierId;
        var profileString = JSON.stringify( this.userProfile );
        localStorage.setItem( 'userProfile' , profileString );
        $(document).trigger( 'ActiveDossierChanged' );
        ISNLogger.log( 'local storage after store of active dossier id ' + localStorage.getItem( 'userProfile' ) );
    }
};



UserModel.prototype.checkActiveUser = function(){

    if ( this.controller.oauth ) {

        ISNLogger.log( 'get user profile' );
        this.getUserProfile();
    } else if ( this.controller.models.authentication ) {

        // we are on the login page so we can play some magic.
        this.controller.models.authentication.getRequestToken();
    } else {
        //don't forward nomal users to the login screen when they visit the homepage.
        this.transitionToLogin();
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

    ISNLogger.log( 'enter send user profile to server' );

    var self = this;
    var url = baseURL() + 'service/authentication.php';
    var method = 'POST';
    var dataObject = {
        "user_id":self.userProfile.user_id,
        "title":self.userProfile.title,
        "name": self.userProfile.name,
        "username": self.userProfile.username,
        "email": self.userProfile.email,
        "activeDossierId": this.userProfile.activeDossierId
    };

    ISNLogger.log( 'url is ' + url );

    var data = JSON.stringify( dataObject );
    // var data=JSON.stringify(self.userProfile);

    $.ajax({
        url:  url,
        type : method,
        data: data,
        dataType : 'json',
        success : success,
        error : function( request ) {

            ISNLogger.log( 'Error while sending the user profile data to the server' );
            showErrorResponses(request);
        },
        beforeSend : setHeader
    });


    function success( data ) {

        ISNLogger.log( 'success in sending the user profile data to the server' );
        //TODO: we can add here the transition to index.html instead in the welcome view, after set of active dossier
        // we will be sure in this way that the profile will be sent to the server.
    }


    function setHeader( xhr ) {

        var header_request = self.controller.oauth.oauthHeader( method , url );
        xhr.setRequestHeader( 'Authorization' , header_request );
    }
};



UserModel.prototype.logout = function(){

    var self = this;
    var url = baseURL() + "service/authentication.php/access_token";
    $.ajax({
        url: url,
        type : 'DELETE',
        dataType : 'json',
        success : success,
        error : function( request ) {

            showErrorResponses(request);
            //display a message to the user that the logout was not successful
            if ( request.status == 401 ) {

                ISNLogger.log( 'success in logging out from the server' );
                var authentication = {
                    consumerSecret:"6a33d1d90067c005de32f5f6aafe082ae8375a6f",
                    consumerKey :"ch.isn.personal-dossier",
                    "accessToken":"",
                    "access_secret":""
                };

                localStorage.setItem( 'authentication' , JSON.stringify( authentication ) );
                self.controller.initOAuth();
                //self.checkActiveUser();
                //self.setInitParameters();
                //self.controller.transition("login");
            } else {

                ISNLogger.log( 'Error while invalidating access token' );
            }
        },
        beforeSend : setHeader
    });


    function success(){
        //delete from localstorage the access token and access secret
        //or maybe move it outside the function right below
    }


    function setHeader( xhr ) {
        var header_request = self.controller.oauth.oauthHeader( url , "DELETE" );
        xhr.setRequestHeader( 'Authorization' , header_request );
    }
};



UserModel.prototype.sendUserPasswordToServer = function( password , mail ) {

    var self = this;
    var hash1 = hex_sha1( mail + password );

    ISNLogger.log( 'hash1 in send password to server ' + hash1 );

    var url = baseURL() + 'service/authentication.php/password';
    var method = 'POST';
    var dataObject = {
        "user_id":self.userProfile.user_id,
        "password":hash1
    };

    var data = JSON.stringify( dataObject );

    $.ajax({
        url : url,
        type : method,
        data : data,
        dataType : 'json',
        success : success,
        error : function( request ) {

            ISNLogger.log( 'Error while sending the password to the server' );
            showErrorResponses( request );
        },
        beforeSend : setHeader
    });


    function success( data ) {

        ISNLogger.log( 'success in sending the password to the server' );
    }


    function setHeader( xhr ) {

        if ( self.controller.oauth ) {

            var header_request = self.controller.oauth.oauthHeader( method , url );
            xhr.setRequestHeader( 'Authorization' , header_request );
        } else {

            var non_authenticationFlag = true;
            xhr.setRequestHeader( 'NonAuth' , non_authenticationFlag );
        }
    }
};



/**
 *
 * we pass as an argument the password becasuse for security reasons
 * we don't want to store it in the model, like we did with the rest
 * user profile information i.e. name, title, mail.
 *  *
 * */
UserModel.prototype.register = function( password ) {

    ISNLogger.log( 'enter register in user model' );

    var self = this;
    var email = self.getEmail();
    var hash1 = hex_sha1( email + password );
    ISNLogger.log( 'hash1 is ' + hash1 );

    var recaptcha_response_field = $("#recaptcha_response_field").val();
    var recaptcha_challenge_field = $("#recaptcha_challenge_field").val();
    ISNLogger.log( 'recaptcha_response_field is ' + recaptcha_response_field );

    var url = baseURL() + 'service/authentication.php/register';
    var method = 'POST';
    ISNLogger.log( 'url is ' + url );

    var dataObject= {
        "title":self.getTitle(),
        "name":self.getName(),
        "email":email,
        "password":hash1,
        "recaptcha_challenge_field":recaptcha_challenge_field,
        "recaptcha_response_field":recaptcha_response_field
    };

     var data = JSON.stringify( dataObject );

     ISNLogger.log( 'before ajax request' );
     $.ajax({
        url : url,
        type : method,
        data : data,
        dataType : 'json',
        success : success,
        error : function( request ) {

            //backend validation checks whether the email address is already registered
            if ( request.status === 403 ) {

                ISNLogger.log( 'Error while registering the user to the server, email taken : 403' );
                $(document).trigger( 'EmailAlreadyTaken' );
            }

            //backend validation that checks the emptiness of the email field
            if ( request.status === 405 ) {

                ISNLogger.log( 'Error while registering the user to the server: email empty : 405' );
                $(document).trigger( 'EmailEmpty' );
                showErrorResponses( request );
            }

            //backend validation that checks the CAPTCHA entry of the user
            if ( request.status === 400 ) {
                ISNLogger.log( 'Error while registering the user to the server: CAPTCHA response incorret : 400' );
                Recaptcha.reload();
                $(document).trigger( 'CaptchaError' );
                showErrorResponses( request );
            }
        },
        beforeSend : setHeader
    });
    ISNLogger.log( 'after ajax request' );


    function success( data ) {

        ISNLogger.log( 'success in registering the user to the server and mail is ' + self.getEmail() );
        ISNLogger.log( 'the password in success is ' + password );
        $(document).trigger( 'RegistrationDone' , [self.getEmail() , password] );
    }


    function setHeader( xhr ) {

        if ( self.controller.oauth ) {

            var header_request = self.controller.oauth.oauthHeader( method , url , data );
            xhr.setRequestHeader( 'Authorization' , header_request );
        } else {

            var non_authenticationFlag = true;
            xhr.setRequestHeader( 'NonAuth' , non_authenticationFlag );
        }
    }
};



//UserModel.prototype.validateCapcha = function(){
//  //calculate captcha field values
//  var recaptcha_response_field=$("#recaptcha_response_field").val();
//  var recaptcha_challenge_field=$("#recaptcha_challenge_field").val();
//  ISNLogger.log("recaptcha_response_field is "+recaptcha_response_field);
//};



/**
 * empty from the local storage the userprofile
 *
 **/
UserModel.prototype.resetUserProfile = function(){

    ISNLogger.log( 'enter reset user profile' );

    //empty the local storage
    localStorage.removeItem( 'userProfile' );

    //empty the local variable
    this.userProfile = null;
};



/**
 * Return true if
 *  - all the manadatoy fields have been set (first 3 elements of array)
 *  - the password matches the confirmed password (the 4th elemet of the array)
 * Other wise return false
 */
UserModel.prototype.checkRegistrationValidation = function(){

    var self = this;
    ISNLogger.log( 'enter check registation validation' );
    var sum = 0, i;
    sum = self.validation_array["name"] + self.validation_array["email"] + self.validation_array["password"] + self.validation_array["confirmPassword"];
    ISNLogger.log( 'sumvalue is ' + sum );
    if ( sum === 4 ) {

        //(all) 4 parts validated succesfully, so trigger valid registration event and return out
        $(document).trigger( 'RegistrationValidated' );
        return;
    }
    //for any and all other cases, trigger invalid registration event
    $(document).trigger( 'RegistrationNotValidated' );
};



UserModel.prototype.getHashPassword = function( password ) {

    var self = this;
    var email = self.getEmail();
    ISNLogger.log( 'entered password hashing function... email to hash with is ' + email );

    return password ? hex_sha1( email + password ) : false ;

};



//avoid transferring the actual password, and pass its length
UserModel.prototype.checkPasswordValidity = function( passwordlength ) {

    if ( passwordlength < 6 ) {

        $(document).trigger( 'PasswortNotValidated' );
        this.setValidationField( 'password' , 0 );
    }

    this.setValidationField( 'password' , 1 );
};



UserModel.prototype.setValidationField = function( fieldString , value ) {

    this.validation_array[fieldString] = value;
    this.checkRegistrationValidation();
};

/**
 * @method transitionToLogin()
 * 
 * forward the user to the login page unless the page is embedded.
 */
UserModel.prototype.transitionToLogin = function() {
    if(this.controller.id !== 'BookmarkController' || 
       this.controller.id !== 'embedController' || 
       this.controller.id !== 'badgeController'
      ) {
        // from all other pages, send the user to the login page
        window.location.href = ISNLogger.choose('user.html', '/tools/user.html');
    }
};

UserModel.prototype.checkEmailValidation = function( email ) {

    ISNLogger.log( 'enter check email validation' );
    var reqExp = new RegExp( "^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$" );
    result = reqExp.exec( email );

    ISNLogger.log( 'result of execution of regular expression is ' + result );
    if ( !result ) {

        $(document).trigger( 'EmailNotValidated' );
        this.validation_array["email"] = 0;
        this.checkRegistrationValidation();
    }
    this.setValidationField( 'email' , 1 );
};


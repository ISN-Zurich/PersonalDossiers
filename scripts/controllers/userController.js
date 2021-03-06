
/*jslint vars: true, sloppy: true */

function userController(){

    var self=this;

    this.appLoaded = false;
    this.initServiceHost();

    self.activeView = false;
    self.loggoutClicked = false;
    self.initOAuth();

    //initialization of models
    self.models = {};
    self.models.authentication = new AuthenticationModel( self );
    self.models.dossierList = new DossierListModel( self );
    self.models.user = new UserModel( self );
    ISNLogger.log( 'model is initialized' );

    //initialization of views
    self.views = {};
    self.views.login = new LoginView( self );
    self.views.welcome = new WelcomeView( self );
    self.views.introduction = new IntroductionView( self );
    self.views.log = new LogView( self );
    self.views.addDossier = new addDossierView( self );
    self.views.user = new userProfileView( self );
    self.views.registration = new RegistrationView( self );
    self.views.interaction = new interactionBox( self );
    self.views.notifications = new notificationView( self );

    self.models.user.checkActiveUser();

    //if authenticated
    if ( this.oauth ) {

        // No editing profile as per #147
        // $("#st_user").removeClass("pd_disable");
        $("#st_dossiers").removeClass("pd_disable");
    }

    $(document).bind( 'UserProfileUpdate' , function(){

        ISNLogger.log( 'binded User profile update in user controller model' );
        self.models.dossierList.getUserDossiers();
    });

    $(document).bind( 'DossierListUpdate' , function(){

        ISNLogger.log( 'dossier list update in user controller' );
        self.chooseView();
        self.colorizeInteractiveBox();
    });

    //we want to update the Log View once we have logged out
    //in order to display the Li in the interaction box
    $(document).bind( 'LogoutSent' , function(){

        ISNLogger.log( 'logout sent is bound' );

        //3. remove the hash from the url
        var loc = window.location.href;
        index = loc.indexOf( '#' );
        if ( index > 0 ) {

            window.location = loc.substring( 0 , index );
        }

        self.models.authentication.request_token = "";
        ISNLogger.log( 'request token after logout is ' + self.models.authentication.request_token );
        self.models.authentication.getRequestToken();
        self.chooseView();
        self.colorizeInteractiveBox();
    });


    $(window).bind( 'hashchange' , function(){

        ISNLogger.log( 'hash change event bound' );
        self.chooseView();
        self.colorizeInteractiveBox();
    });

    // when we are coming from the index.html
    // the page during its loading should colorize the interaction box based on the hashed url
    // $(window).load(function(){
    //     ISNLogger.log("window load event binded");
    //     //we use the loggoutClicked flag to prevent the automatic loading of the page
    //     //when click on the <a> logView.
    //     if (!self.loggoutClicked){
    //         ISNLogger.log("enter on window load");
    //         self.colorizeInteractiveBox();
    //         self.chooseView();
    //     }
    // });
}



userController.prototype.initServiceHost = pdInitServiceHost;
userController.prototype.getServiceHost = pdGetServiceHost;
userController.prototype.isAuthenticated = pdIsAuthenticated;



userController.prototype.getHash = function(){

    var hash = window.location.hash;
    var hashTag = hash.substring( 1 );
    return hashTag;
};



userController.prototype.chooseView = function(){

    var hashTag = this.getHash();
    if ( !this.oauth ) {

        this.views.addDossier.close();
        this.views.log.close();
        this.views.welcome.close();
        this.views.login.open();
        this.views.introduction.open();
    } else {

        switch ( hashTag ) {

// No editing user profile as per #147
/*
            case 'userProfile':
                this.views.welcome.close();
                this.views.introduction.close();
                this.views.login.close();
                this.views.addDossier.close();
                this.views.user.open();
                this.activeView = this.views.user;
                break;
*/

            case 'notifications':
                this.views.notifications.open();
                this.activeView = this.views.notifications;
                break;

            case 'personalDossiers':
            default:
                this.views.introduction.close();
                this.views.registration.close();
                this.views.login.close();
                this.views.user.close();
                this.views.welcome.open();
                this.views.addDossier.open();
                this.activeView = this.views.welcome;
                break;
        }
    }
};



userController.prototype.colorizeInteractiveBox = function(){

    var hash = this.getHash();
    ISNLogger.log( 'enter colorize interactive box' );

    switch ( hash ) {

        case 'personalDossiers':
            setDossiersColorization();
            break;

        case 'userProfile':
            //GET US OUT OF HERE
            break;
            // ISNLogger.log( 'user profile colorization' );
            // setUserProfileColorization();
            // break;

        case '':
            if ( this.oauth ) {

                ISNLogger.log( 'we are authenticated in colorize interactive box' );
                setDossiersColorization();
            } else {

                ISNLogger.log( 'we are NOT authenticated in colorize interactive box' );
                setLoggedOutColorization();
            }
            break;
    }
};



userController.prototype.initOAuth = function() {

    ISNLogger.log( 'initialize the oauth helper class' );
    try {

        this.oauth = new OAuthHelper( this.baseURL );
        $(document).trigger( 'oauthSet' );
    } catch ( e ) {

        this.oauth = undefined;
    }

    //log auth result
    if ( this.oauth ) {

        ISNLogger.log( 'oauth ok' );
    } else {

        ISNLogger.log( 'oauth failed' );
    }
};



userController.prototype.keysRejected = function() {

    if ( this.oauth ) {

        this.oauth.reset();
        $(document).trigger( 'LogoutSent' );
    }
};



userController.prototype.updateUserData = function() {

    if ( this.oauth ) {

        this.models.dossierList.getUserDossiers();
    }
};



userController.prototype.transition = function( targetView ) {

    if ( !this.activeView || this.activeView !== this.views[targetView] ) {

        ISNLogger.log( 'do transition to ' + targetView );
        if ( this.activeView ) {

            this.activeView.close();
        }
        ISNLogger.log( 'setting active view in controller ');
        this.activeView = this.views[targetView];
        ISNLogger.log( 'just set active view' );
        this.activeView.open();
        ISNLogger.log( 'opened active view in controller' );
    }
};



userController.prototype.getActiveDossier = function() {

    var activedossierId = this.models.user.getActiveDossier();
    if ( !activedossierId ) {
        var dossierId = this.models.dossierList.getDefaultDossierId();
        return dossierId;
    }
    return activedossierId;
};



userController.prototype.logout = function() {

    this.models.authentication.logout();
};



userController.prototype.transitionToRegistration = function(){

    ISNLogger.log( 'enter transition to registation' );
    this.views.introduction.close();
    this.views.login.close();
    this.views.registration.open();
};

userController.prototype.transitionToIntroduction = function(){

    ISNLogger.log( 'enter transition to introduction' );
    this.views.registration.close();
    this.views.introduction.open();
    this.views.login.open();
};

var controllerObject = userController;
//var controller;
//$(document).ready(function(){
//  ISNLogger.log("document ready");
//
//    ISNLogger.debugMode = false;
//  controller = new userController();
//});

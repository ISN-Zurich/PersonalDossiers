/*jslint vars: true, sloppy: true */

/**
 * @class AdminController()
 * 
 * 
 */
function AdminController() {
    this.initServiceHost();
    
    ISNLogger.debugMode = false;
    
    ISNLogger.log('Admin Controller starts');

    this.initOAuth();

    if (this.oauth) {
        this.models = {};
        this.views = {};
        
        this.models['dossiers'] = new AdminDossierModel(this);
        
        this.views['dossiers'] = new AdminDossierView(this);
        
        this.views.dossiers.update();
    }
    else {
        this.redirectToHome();
    }
}

AdminController.prototype.redirectToHome = function() {
    window.location.href = 'user.html';
};

AdminController.prototype.initServiceHost = pdInitServiceHost;
AdminController.prototype.getServiceHost = pdGetServiceHost;
AdminController.prototype.isAuthenticated = pdIsAuthenticated;
AdminController.prototype.keysRejected = pdNOOP;

AdminController.prototype.initOAuth = function(){

    ISNLogger.log('initialize the oauth helper class');
    try {

        this.oauth = new OAuthHelper( this.baseURL );
        $(document).trigger('oauthSet');
    } catch ( e ) {

        this.oauth = undefined;
    }

    if (this.oauth) {

        ISNLogger.log('oauth ok');
    } else {

        ISNLogger.log('oauth failed');
    }
};

var controllerObject = AdminController;

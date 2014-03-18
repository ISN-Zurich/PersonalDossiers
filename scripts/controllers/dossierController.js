/**
 * This controller is responsible for the indx.html

 * (dossier banner view and dossier content view)
 *
 * @returns
 */

/*jslint vars: true, sloppy: true */

function dossierController() {
	var self=this;
	this.id="dossierController";
    this.initServiceHost();
    ISNLogger.log("hostURL is"+this.hostURL);
    ISNLogger.log("baseURL is"+this.baseURL);
//	this.baseURL = baseURL;
//	this.hostURL = hostURL;

//	document.domain = 'ethz.ch';
	self.hashed=false;

	self.hashedUrl();
	self.initOAuth();

	// if we are logged in or if there is a hash on the url then show & open the authorized views
	// if there is a hash on the url don't show the logout button

	if (self.oauth || self.hashed){

		//initialization of models
		self.models = {};

		//self.models.authentication = new AuthenticationModel(this);

		//user model is run only when we are authenticated
		if (self.oauth){
			self.models.user = new UserModel(self);
		}

		self.models.dossierList = new DossierListModel(self);
		self.models.bookmark = new BookmarkModel(self);

		ISNLogger.log("model is initialized");

		self.views = {};

		//initialization of views
		self.views.dossierBanner = new DossierBannerView(self);
		self.views.dossierContent= new DossierContentView(self);
		self.views.userlist = new DossierUsersView(self);
		self.views.embed = new AddEmbedButton(self);
		self.views.invitation = new InvitationView(self);
		self.views.share = new ShareButtonView(self);


		//the following views run only when we are authenticated
		if (self.oauth){
			self.views.log = new LogView(self);
			self.views.share = new ShareButtonView(self);
		};

		$(document).bind("BookmarkModelLoaded", function() {
			ISNLogger.log("initialize views in controller");
			self.views.dossierBanner.open();
			self.views.dossierContent.open();
			self.views.userlist.open();
			self.views.embed.open();
		});
	}
	else {
		ISNLogger.log("the user is not loggedIn and there is no hash on the url");
		// user is not logged in go to user.html
		window.location.href = 'user.html';
	}

	$(document).bind("LogoutSent", function(){
		ISNLogger.log("binded logout sent in constructor");
		window.location.href = 'user.html';
	});

	$(window).bind( "hashchange",function(){});

	//we get the user type in order to decide which views to open

} //end of constructor

dossierController.prototype.initServiceHost = pdInitServiceHost;
// dossierController.prototype.getServiceHost = pdGetServiceHost;
dossierController.prototype.isAuthenticated = pdIsAuthenticated;

dossierController.prototype.getUserType = function(){
	ISNLogger.log("enter getUser Type in dossier Controller");
	return this.models.dossierList.getUserType();
};

dossierController.prototype.hashedUrl = function() {
    ISNLogger.log("enter hasehd url");
    this.hashed = false;

    var url_ref = window.location.search;
    if (url_ref && url_ref.length) {
        var splited = url_ref.slice(1).split('&');
        ISNLogger.log("show splitted url array is " + splited);
        if (splited && splited.length > 0) {
            var i;
            for (i=0; i < splited.length; i++) {
                ISNLogger.log("tools is " + splited[i]);
                var split2 = splited[i].split("=");
                // only the id parameter is accepted!
                if ( split2[0] && split2[0].length && split2[0] === 'id' ) {
                    var d_id = split2[1];
                    if (d_id && d_id.length > 0) {
                        ISNLogger.log("there is id in the new url and it is " + d_id);
                        this.pubid = d_id;
                        this.hashed = true;
                        break;
                    }
                }
            }
        }
    }
};

dossierController.prototype.getHashedURLId = function(){
	var dossierId=this.pubid;
	ISNLogger.log("dossier id after hash is "+dossierId);
	return dossierId;
};

dossierController.prototype.initOAuth = function() {
	try {
		this.oauth = new OAuthHelper(this.baseURL);
	}
	catch (e) {
		this.oauth = null;
	}
};

dossierController.prototype.keysRejected = function() {
    if (this.oauth) {
        this.oauth.reset();
        $(document).trigger("LogoutSent");
    }
};

dossierController.prototype.updateUserData = function() {
	if ( this.oauth ) {
		this.models.dossierList.getUserDossiers();
	}
};

dossierController.prototype.initImageHandler=function(){
	var self=this;
	ISNLogger.log("runs in controller image handler");
	self.imageHandler= new ImageHandler(this);

};

dossierController.prototype.test = function(){
	ISNLogger.log("after initializing image gallery");
};

dossierController.prototype.getActiveDossier = function(){
	ISNLogger.log("in user controller to get active dossier");
	if (this.hashed){
        ISNLogger.log('return query id ' + this.pubid);
		return this.pubid;
	}
	if (!this.hashed){   //if there is no hash at the url
		var activedossierId =  this.models.user.getActiveDossier();
		if (activedossierId){
			return activedossierId;
		}
		if(!this.activedossierId){
			var dossierId = this.models.dossierList.getDefaultDossierId();
			return dossierId;
		}
	}//is not hashed
	return undefined;    //if something goes wrong for any reason
};

dossierController.prototype.transition = function(){};

dossierController.prototype.logout = function() {
	ISNLogger.log("enter logout in dossier controller");
	authentication = new AuthenticationModel(this);
	authentication.logout();
};

var controllerObject = dossierController;

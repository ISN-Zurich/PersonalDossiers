/**
 * OAuthPageHelper is unused!
 */

/*jslint vars: true, sloppy: true */

function OAuthPageHelper(controller) {
    this.controller = controller;

    this.accessor = {
        consumerKey :"ch.isn.website",
        consumerSecret: "",
        tokenSecret: ""
    };

    this.serviceurl = this.controller.baseURL() +'service/authentication.php';
    this.authorizationurl = this.controller.baseURL() +'authorize.html';
}

OAuthPageHelper.prototype.getRequestToken = function() {
    // use the request token so we can forward the user
};

OAuthPageHelper.prototype.obtainAuthorization = function() {
    // forwards the user to the authorization URL
    var auIL = $('<iframe>', {
        'id': 'isn_pd_authorize',
        'class': 'hidden',
        'src': this.authrizationurl + '#' + this.requesttoken 
    }).appendTo('isn_pd_widget');
};

OAuthPageHelper.prototype.getVerificationCode = function() {
    // helper function to read the verfication code in a callback
};


OAuthPageHelper.prototype.getAccessToken = function() {
    // use the verification code to get and store the access token
};

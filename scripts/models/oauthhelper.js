function OAuthHelper(realm) {
    var data;
    var tmp = localStorage.getItem("authentication");    
//    if(tmp){
    	data = JSON.parse(tmp);   
//    }
    if ( !data ) {
        ISNLogger.log( 'no data cannot be loaded' );
    throw new Error('No OAuth Data Stored');
        return;
    }

    if ( !data.accessToken) {
        ISNLogger.log('lost my accesstoken');
        localStorage.setItem("authentication", "");
        throw new Error( 'no token');
        return;
    }

    ISNLogger.log('oauth helper ok');

    this.realm = realm;

    this.accessor = { 
        'consumerKey':    data.consumerKey,
        'consumerSecret': data.consumerSecret,
        'tokenSecret':    data.accessSecret,
        'token':          data.accessToken
    };

    ISNLogger.log('accessor ' + JSON.stringify(this.accessor));

    this.oauthHeader = function (method, url, data) {
        var message = {
            'method': method,
            'action': url,
            'parameters': [
                ["oauth_signature_method", "HMAC-SHA1"]
            ]
        };
        ISNLogger.log("method: "+method+" url "+url);
        if (data){
            ISNLogger.log("data found");
            for ( var key in data ) {
                ISNLogger.log("key: "+key);
                message.parameters.push([key, data[key]]);
            }
        }
        
        OAuth.completeRequest(message, this.accessor);
        ISNLogger.log("passed completion");
        return OAuth.getAuthorizationHeader(this.realm, message.parameters);
    };
    
    this.setConsumer = function (key, secret) {
        this.accessor.consumerKey = key;
        this.accessor.consumerSecret = secret;
        this.storeTokens();
    };
    
    this.setAccess = function (key, secret) {
        this.accessor.tokenKey = key;
        this.accessor.tokenSecret = secret;
        this.storeTokens();
    };
    
    this.reset = function () {
        this.accessor.token = "";
        this.accessor.tokenSecret = "";
        this.storeTokens();
    };
    
    this.storeTokens = function (){
        var data = JSON.stringify({
            'consumerKey': this.accessor.consumerKey, 
            'consumerSecret': this.accessor.consumerSecret,
            'accessSecret': this.accessor.tokenSecret,
            'accessToken': this.accessor.token
                                  });
        localStorage.setItem("authentication", data);
    };
}




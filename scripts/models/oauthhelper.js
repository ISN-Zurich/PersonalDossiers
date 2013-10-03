/*jslint vars: true, sloppy: true */

function OAuthHelper(realm) {
    var data;
    var tmp = localStorage.getItem("authentication");    
    data = JSON.parse(tmp);   


    if ( !data ) {
        console.log( 'no data cannot be loaded' );
    throw new Error('No OAuth Data Stored');
        return;
    }

    if ( !data.accessToken) {
        console.log('lost my accesstoken');
        localStorage.setItem("authentication", "");
        throw new Error( 'no token');
        return;
    }

    console.log('oauth helper ok');

    this.realm = realm;

    this.accessor = { 
        'consumerKey':    data.consumerKey,
        'consumerSecret': data.consumerSecret,
        'tokenSecret':    data.accessSecret,
        'token':          data.accessToken
    };

    console.log('accessor ' + JSON.stringify(this.accessor));

    this.oauthHeader = function (method, url, data) {
        var message = {
            'method': method,
            'action': url,
            'parameters': [
                ["oauth_signature_method", "HMAC-SHA1"]
            ]
        };
        console.log("method: "+method+" url "+url);
        if (data){
            console.log("data found");
            for ( var key in data ) {
                console.log("key: "+key);
                message.parameters.push([key, data[key]]);
            }
        }
        
        OAuth.completeRequest(message, this.accessor);
        console.log("passed completion");
        return OAuth.getAuthorizationHeader(this.realm, message.parameters);
    };
}




/**
 * CORN-P protocol implementation
 *
 * TODO check MessageChannels, does not affect the protocol layer
 */

/*jslint vars: true, sloppy: true */

(function __CORN_P(){
    function CORN_P() {
        var corn = this;
        
        var cpErrorCallbacks = [];
        
        var cpInterface = {};
        var cpCallbacks = {};
        
        var cpTargets   = {};
        
        // informs the message handler which origins are allowed.
        var allowedHosts= [];
        
        var acceptAnyHost = false;
        window.addEventListener('message', messageHandler, false);

        // public function
        this.allowAnonymousHosts = function() { allowAnyHost = true; };
        this.forbidAnonymousHosts= function() { allowAnyHost = false; };
        this.accept              = acceptHost;
        this.connect             = connectHost;
        this.send                = sendCommand;
        this.addCommand          = addCommand;
        this.removeCommand       = removeCommand;
        this.addErrorListener    = addErrorListener;
        this.removeErrorListener = removeErrorListener;

        // IMPLEMENTATION

        function messageHandler(m) { 
            console.log( 'messagehandler at ' + window.location.href + ' from ' + m.origin);
            if ( acceptAnyHost || allowedHosts.indexOf(m.origin) >= 0 ){
                if ( typeof m.data === 'string' ) {
                    console.log( window.location.href + ' m.data : "' + m.data + '"');
                    var aMsg = m.data.split(' ');
                    console.log( aMsg.length);
                    if ( aMsg.length ) {
                        console.log(aMsg[0]);
                        switch(aMsg[0]) {
                        case 'OPTIONS':
                            reportError('Warning: host tries to connect ', m.origin); 

                            // remember the target 
                            if ( !cpTargets[m.origin]) {        
                                cpTargets[m.origin] = {'source':m.source, 'commands': {}, 'connect': false};
                            }
                            // I need to respond my Interface for the host

                            sendInterface(cpTargets[m.origin].source, m.origin);
                            
                            break;
                        case 'INTERFACE':
                            console.log( 'interface');
                            reportError('Warning: host sends interface to ', m.origin ); 
                            // store target interface
                            if (!cpTargets[m.origin]) {                                    
                                cpTargets[m.origin] = {'source': m.source, 'commands': {}, 'connect': false};
                            }

                            var did = aMsg.length - 1;
                            if ( aMsg[did] && aMsg[did].length ) {
                                cpTargets[m.origin].commands = JSON.parse(decodeURIComponent(aMsg[did]));
                            }
                            else {
                                cpTargets[m.origin].commands = {};
                            }
                            break;
                        default:
                            callOperation(aMsg[0], aMsg[did], m.orign);
                            break;
                        }
                    }
                    else {
                        reportError('INVALID_MESSAGE', m.origin);
                        // inform about invalid message
                    }
                }
                else {
                    // inform about invalid message type
                    reportError('INVALID_MESSAGE_TYPE', m.origin);
                }
            }
            else {
                // inform about invalid connection from origin
                reportError('INVALID_ORIGIN', m.origin);
            }
        }
        
        function checkHandler(cmd, origin) {
            if (cpCallbacks[origin] && cpCallbacks[origin][cmd]) {
                return cpCallbacks[origin][cmd]['data'];
            }
            if (cpCallbacks['*'] && cpCallbacks['*'][cmd]) {
                return cpCallbacks['*'][cmd]['data'];
            }
            return undefined;
        }
        
        function mergeInterface(tHost) {
            tHost = fixHost(tHost);
            var c, retval = {};
            if ( cpCallbacks['*'] ) {
                for ( c in cpCallbacks['*'] ) {
                    if (cpCallbacks['*'][c]) {
                        retval[c]= cpCallbacks['*'][c]['data'];
                    }
                }
            }
            // override any specialized host interfaces
            if ( cpCallbacks[tHost] ) {
                for ( c in cpCallbacks[tHost] ) {
                    if (cpCallbacks[tHost][c]) {
                        retval[c]= cpCallbacks[tHost][c]['data'];
                    }
                }
            }
            return retval;
        }
        
        function callOperation(cmd, mdata, oHost) {
            // first check oHost callbacks
            // if op is not part of oHost interfaces call 'all' callbacks
            var dType = checkHandler(cmd, m.origin);
            var data;
            switch( dType ) {
            case 'none': 
                break;
            case 'literal':
                data = mdata;
                break;
            case 'form-encoded':
                data = parseFormData(mdata);
                break;
            case 'object':
                data = JSON.parse(decodeURIComponent(mdata));
                break;
            default: 
                break;
            }

            if (dType) {
                if ( cpCallbacks[oHost][cmd] && cpCallbacks[oHost][cmd]['ops'].length ) {
                    // run the host callbacks
                    operate(data, oHost, cpCallbacks[oHost][cmd]['ops']);
                }
                else if ( cpCallbacks['*'][cmd]['ops'] &&  cpCallbacks['*'][cmd]['ops'].length ) {
                    // run the any callbacks ONLY if no host callbacks exist
                    operate(data, oHost, cpCallbacks['*'][cmd]['ops']);
                }
                else { 
                    // inform about missing callbacks
                    reportError('MISSING_CALLBACK', oHost);
                }
            }
            else {
                // inform about bad interface
                reportError('BAD_INTERFACE', oHost);
            }
        }

        function parseFormData(sData) {
            var e, retval, aData = sData.split('&');
            if ( aData && aData.length ) {
                retval = {};
                for ( e in aData ) {
                    if ( e.indexOf( '=') > 0 ) {
                        var tmp = e.split('=');
                        retval[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
                    }
                }
            }                
            return retval;
        }
        
        function reportError(err, errHost) {
            var i, func;
            if ( cpErrorCallbacks && cpErrorCallbacks.length ) {
                for ( i=0; i < cpErrorCallbacks.length; i++ ) {
                    // better func.call(thisObj, err, errHost);
                    func = cpErrorCallbacks[i];
                    func(err, errHost);
                }
            }
            else {
                console.log(window.location.href + ':X ' + err + ' from ' + errHost);
            }
        }

        function operate(data, dHost, cblist) {
            var func;
            for ( func in cblist ){
                // better func.call(thisObj, data, dHost);
                func(data, dHost);
            }
        }
        
        /* public functions */
        function addErrorListener(cbFunc) {
            if (!(cbFunc && typeof cbFunc === 'function')) {
                throw new Error('CORNP_NOT_A_FUNCTION');
            }
            else {
                cpErrorCallbacks.push(cbFunc);
            }
        }
        
        function removeErrorListener(cbFunc) {
            var cb=0, i=0;
            
            if (!(cbFunc && typeof cbFunc === 'function')) {
                throw new Error('CORNP_NOT_A_FUNCTION');
            }
            
            for (i = 0; i < cpErrorCallbacks.length; i++) {
                if ( cbFunc === cpErrorCallbacks[i] ) {
                    // call back found
                    cb++;
                    cpErrorCallbacks.splice(i, 1);
                }
            }
            if (cb>0) {
                throw new Error('CORNP_CALLBACK_NOT_FOUND');
            }
        }
        
        function fixHost(host) {
            host = host || '*';
            if (host === '/') {
                if ( window.location.protocol === 'file' ) {
                    return '*';
                }
                return window.location.protocol + '//' + window.location.hostname;
            }
            return host;
        }
        
        /**
         * function void addCommand(command, callback, datatype, host)
         * command: string  the CORN-P command
         * callback: function the command function to be triggered
         * datatype: string (none|literal|form-encoded|object)
         * host: string
         */
        function addCommand(command, cbFunc, tData, tHost) {
            var cbHost = fixHost(tHost);
            tData = tData || 'string';
            
            if (!(command && command.length)) {
                throw new Error('CORNP_COMMAND_MISSING'); 
            }
            
            command = command.toUpperCase();

            if (!(cbFunc && typeof cbFunc === 'function')) {
                throw new Error('CORNP_NOT_A_FUNCTION');
            }

            switch(tData) {
            case 'none':
            case 'literal':
            case 'form-encoded':
            case 'object':
                break;
            default:
                throw new Error('CORNP_INVALID_DATATYPE');
                break;
            }
            
            if (!cpCallbacks[cbHost]) {
                acceptHost(cbHost);
            }
            if (!cpCallbacks[cbHost][command]) {
                cpCallbacks[cbHost][command] = {'data': tData, 'ops': [] };
            }
            else if (cpCallbacks[cbHost][command]['data'] !== tData) {
                throw new Error('CORNP_INCOMPATIBLE_DATATYPE_DEFINITION'); 
            }
                        
            cpCallbacks[cbHost][command]['ops'].push(cbFunc);
        }
        
        function removeCommand(command, cbFunc, tHost) {
            var cb=0, i=0, cbHost = fixHost(tHost);

            if (!(command && command.length)) {
                throw new Error('CORNP_COMMAND_MISSING'); 
            }

            command = command.toUpperCase();

            if (!(cbFunc && typeof cbFunc === 'function')) {
                throw new Error('CORNP_NOT_A_FUNCTION');
            }
            
            if (!(cpCallbacks[cbHost][command] && cpCallbacks[cbHost][command].length)) {
                throw new Error('CORNP_COMMAND_MISSING'); 
            }
            
            for (i = 0; i < cpCallbacks[cbHost][command].length; i++) {
                if ( cbFunc === cpCallbacks[cbHost][command][i] ) {
                    // call back found
                    cb++;
                    cpCallbacks[cbHost][command].splice(i, 1);
                }
            }

            if (cb > 0) {
                throw new Error('CORNP_CALLBACK_NOT_FOUND');
            }
            if ( !cpCallbacks[cbHost][command].length ) {
                // delete the interface
                delete cpInterface[cbHost][command];
            }
        }

        function sendCommand(tHost, command, mData) {
            console.log('send command');
            tHost = fixHost(tHost);
            
            if (!cpTargets[tHost]) {
                throw new Error('CORNP_INVALID_TARGET_HOST');
            }

            if (!cpTargets[tHost].source) {
                // we won't simply use the global broadcasting
                throw new Error('CORNP_UNKNOWN_TARGET_HOST');
            }
            
            command = command.toUpperCase();

            console.log( 'send command ' + command + ' to '+ tHost);

            var k, mstring = command, tData = cpTargets[tHost].commands[command];
            
            if (!tData) {
                throw new Error('CORNP_INVALID_COMMAND');
                console.log( 'error thrown we should stop here');
            }
            console.log('data present ' + tData);

            // add the data
            switch (tData) {
            case 'none':
                break;
            case 'literal':
                if (typeof mData === 'string' || typeof mData === 'number' || typeof mData === 'boolean' ) {
                    mstring = mstring + " " + mData;
                }
                else {
                    throw new Error('CORNP_INVALID_DATA');
                }
                break;
            case 'form-encoded':
                if (typeof mData === 'string' || typeof mData === 'number' || typeof mData === 'boolean' ) {
                    mData = { 'data': mData };
                }

                if (typeof mData === 'object') {
                    tStr = '';
                    for ( k in mData ) {
                        if (tStr.length) {
                            tStr = tStr + '&';
                        }
                        tStr = tStr + encodeURIComponent(k) + '=';
                        if (typeof mData[k] === 'string' || typeof mData[k] === 'number' || typeof mData[k] === 'boolean' ) {
                            tStr = tStr + encodeURIComponent(mData[k]);
                        }
                        else {
                            throw new Error('CORNP_INVALID_DATA');
                        }
                    }
                    mstring = ' ' + tStr;
                }
                else {
                    throw new Error('CORNP_INVALID_DATA');
                }
                break;
            case 'object':
                if (typeof mData === 'string' || typeof mData === 'number' || typeof mData === 'boolean' ) {
                    mData = { 'data': mData };
                }

                if (typeof mData === 'object') {
                    mData = mData + ' ' + encodeURIComponent(JSON.stringify(mData)); 
                }
                else {
                    throw new Error('CORNP_INVALID_DATA');
                }
                break;
            default: 
                throw new Error('CORNP_INVALID_TARGET_TYPE');
                break;
            }

            cpTargets[tHost].source.postMessage(mstring, tHost);
        }

        function connectHost(tWindow, tHost) {
            if (!tWindow) {
                throw new Error('CORNP_INVALID_WINDOW');
            }
            
            if ( tWindow.nodeName && tWindow.contentWindow ) {
                tWindow = tWindow.contentWindow;
            }

            if ( !tWindow.postMessage ) {
                throw new Error('CORNP_POST_MESSAGE_UNSUPPORTED');
            }

            // bind the load event to the tWindow's container element
            tHost = fixHost(tHost);
            console.log(tHost);
            acceptHost(tHost);
            if ( !cpTargets[tHost] ) {
                cpTargets[tHost] = {'source': tWindow, 'commands': {}, 'connect': true};
            }
            else {
                cpTargets[tHost].source = tWindow;
            }

            console.log( 'initiate connect ');
            tWindow.postMessage('OPTIONS', tHost);
        }

        function sendInterface(tWindow, tHost) {
            console.log('merged interface for '+ tHost+' '+JSON.stringify(mergeInterface(tHost)));
            tWindow.postMessage('INTERFACE ' + encodeURIComponent(JSON.stringify(mergeInterface(tHost))), 
                                 tHost);
        }

        function acceptHost( host ) {
            var h;
            if ( typeof host === 'string' && allowedHosts.indexOf(host) < 0) {
                allowedHosts.push(host);
                cpCallbacks[host] = {};
            }
            if (typeof host === 'object') {
                for ( h in host ) {
                    if (typeof h === 'string' && allowedHosts.indexOf(h) < 0) {
                        allowedHosts.push(h);
                        cpCallbacks[h] = {};
                    }
                }
            }
        }

        
    }
    
    if ( !window.CORNP ) {
        window.CORNP = new CORN_P();
    } 
}());

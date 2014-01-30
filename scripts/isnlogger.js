var ISNLogger;

if (typeof ISNLogger === 'undefined') {
    ISNLogger = {
        debugMode: false
        ,
        
        log: function(message) {
            if ( !window.console ) {
                window.console = {'log': function(){}};
            } 
             
            if (this.debugMode) {
                console.log(message);
            }
        }
        ,
        
        /**
         * @function grep(@configurationArray)
         * 
         * return value: filtered configuration array
         * 
         * This function takes an array with configuration objects. Each object relates to 
         * a configuration array that might present in production mode or in debug mode. 
         * If debugging is deactivated this function filters all configuration variables that 
         * should be present only in debug mode. 
         * 
         * This function expects that each object has a debug property to be present in the object.
         * If the ISNLogger is not in debug mode, only those objects will be returned that either 
         * do not have a debug property set or where this property is 0.
         */
        grep: function(config) {
            var rV = config;
            if (!this.debugMode) {
                rV = [];
                function filterDebug(i,o) {
                    if (typeof o === 'object' && (!o.debug || o.debug === "0") ) {
                        rV.push(o);
                    }
                }
                $.each(config, filterDebug);
            }
            return rv;
        }
        ,
        
        /**
         * @function choose(debugOption, productionOption)
         * 
         * this function chooses between the debug and the production option depending 
         * on the debug mode.
         */
        choose: function(productionOption, debugOption) {
            return this.debugMode ? debugOption : productionOption;
        }
    };
}

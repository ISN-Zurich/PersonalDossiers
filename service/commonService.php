<?php
require_once 'MDB2.php';

/**
 * CoreService
 *
 * Basic functions for logging
 */
class PDCommonClass {
    protected $debugMode = true;
    
    /**
     * setDebugMode($mode)
     *
     * Sets the internal debug mode gor logging messages and stuff.
     *
     * @param $mode boolean value to switch logging on or off.
     */
    public function setDebugMode($mode) {
        $this->debugMode = $mode;
    }
    
    /**
     * @method void fatal($message)
     *
     * @param string $message the error message to send
     *
     * This helper function works pretty much like log() but it ignores the debug flag.
     * This means that any fatal message will appear in the server's error log regardless
     * of the debug flag.
     *
     * This is useful to send important error messages if we run into a non-recoverable
     * error.
     */
    public function fatal($message) {
        $t = debug_backtrace();
        // need to shift twice
        array_shift($t); // ignore self 
        $c = array_shift($t);
        
        // because mark() uses this function
        if (__CLASS__ === $c['class']) { 
            $c = array_shift($t);   
        }
        
        if (!empty($c['class'])) {
            error_log($c['class'] . "::".  $c['function'] . " " . $message);
        }
        else {
            error_log($c['function']. " " . $message);
        }       
    }
    
    /**
     * @method void log($message)
     *
     * @param string $message takes the logging message.
     * 
     * This helper method eases the debugging of the service. It expands the message with the
     * current class name, so it can be easily identified. 
     */
    public function log($message) {
        $t = debug_backtrace();
        // need to shift twice
        array_shift($t); // ignore self 
        $c = array_shift($t);
        
        // because mark() uses this function
        if (__CLASS__ === $c['class']) { 
            $c = array_shift($t);   
        }
        
        if ( $this->debugMode ) {
            if (!empty($c['class'])) {
                error_log($c['class'] . "::".  $c['function'] . " " . $message);
            }
            else {
                error_log($c['function']. " " . $message);
            }
        }
    }
    
    /**
     * @method void mark([$extra]);
     *
     * @param $extra (optional) extra label for the marker
     *
     * This method sets a marker to the caller function so one can easily track down important parts in the code.
     * In the error_log file the classname and the function name will appear next with the lable 'MARK'.
     */
    public function mark($extra = "") {
        if ( $this->debugMode ) {
            // we want to report on the caller function not on this function
            $t = debug_backtrace();
            // need to shift twice
            array_shift($t);
            $c = array_shift($t);
                  
            if (!(isset($extra) && strlen($extra)))
                $extra = "";
                         
            $this->log(" MARK " . $extra);
        }
    }

    
    /**
     * @method void logtest($bTest, $message)
     *
     * @param bool $bTest test this boolean
     * @param string $message the log message
     *
     * This helper function logs only of the $bTest parameter is TRUE. 
     */
    public function logtest($bTest, $message) {
        if ($bTest) {
            $this->log($message);
        }
    }
    
}

/**
 * @class: RESTServiceCommon
 *
 * This is a basic service class for REST services. This class provides the basic logic for all our Web-services.
 *
 * Instances are called as following:
 * 
 *    $service = new MyServiceClass();
 *    // do some additional initialization if needed
 *    $service->run();
 *
 * An implementation of this class requires to implement a handler function for each method that is supported
 * of the service of the following format:
 *
 *    protected function handler_METHOD(){}
 *
 * In practice this means that if your service supports a GET and a PUT request you need to implement the
 * following functions:
 *
 *    protected function handler_GET(){}
 *    protected function handler_PUT(){}
 *
 * Furthermore this class implements some basic response codes. 
 */
class RESTServiceCommon extends PDCommonClass {
    /**
     * @property $data: Internal Service Data Stash.
     *
     * This is used to generate the service response.
     *
     * You can set this property directly or by using either of the setData() or setDataStash() functions.
     *
     * This property can hold arbitary data and the response_*() function will choose how to send it to the
     * client.
     */
    protected $servicepath;
    protected $data;
    protected $uri;
    protected $bURIOK = true; // helper variable for identifying valid service calls
    protected $path_info;
    
    protected $config; // this holds the application configuration

    protected function loadConfiguration() {
        $this->config = parse_ini_file( 'config.ini', true );   
    }
    
    public function __construct() {
        $this->loadConfiguration();
        $this->setDebugMode($this->config['service']['debug'] ? true : false);
                            
        $this->mark( "********** NEW SERVICE REQUEST ***********");
        $this->setServiceURI();
        $this->checkServiceURI($_SERVER['REQUEST_URI']);        
    }
    
    public function setServiceURI() {
        $path = $this->servicepath;
        if ( !empty($this->config['service']['pathprefix']) ) {
            $this->uri = $this->config['service']['pathprefix'] . $path;
        }
        else {
            $this->uri = $path;
        }
    }
    
    /**
        * Desctructor()
        *
        * Sets the end marker after the service is completed. It serves only debugging purposes.
        */
    public function __destruct() {
        $this->mark( "********** END SERVICE REQUEST ************");
    }
    
     /**
        * run()
        *
        * The main power horse of the service. This function decides which handler methods should be
        * called for the different HTTP request methods.
        * 
        * For unsupported HTTP request methods the service responds with a 405 Not Allowed code.
        */
    public function run() {
        if ($this->bURIOK) {
            $meth = $_SERVER['REQUEST_METHOD'];
               $this->log('REQUEST METHOD IS ' . $meth);
            $cmeth = "handle_" . $meth;
            // check if a method is supported by the service class
            if ( method_exists($this, $cmeth) ) {
                // force IE to obey!
		        header('X-UA-Compatible: IE=edge');
                
                // TODO: generalize the Access control!        
                // the access control origin should be defined in the config and only if the domain
                // matches the allowed domains, it should respond appropriately.
                $origin = $_SERVER['HTTP_ORIGIN'];
                
                if ( !empty($origin) && in_array($origin, array('http://www.isn.ethz.ch', 'http://yellowjacket.ethz.ch', 'http://lab.isn.ethz.ch')) ){
                    header('Access-Control-Allow-Origin: ' . $origin);
                    header('Access-Control-Allow-Methods: POST, PUT, GET');
                    header('Access-Control-Allow-Headers: Authorization');
                    header('Cache-Control: no-cache');
                }
                if ($this->prepareOperation($meth)) {
                    

                    call_user_func(array($this, $cmeth));
                }
            }
            else {
                $this->log('method does not exist! ' . $cmeth);
                $this->not_allowed();
            }
        }
        else {
            $this->log('URI is not ok! (' . $this->uri . ')');
            $this->not_allowed();
        }
    }

    protected function handle_OPTIONS() {
        $this->respond_text_message("OK");
    } 
    
    /**
     * @method prepareOperation($method)
     *
     * @param $method: The request method to be handled
     *
     * This function is used to prepare the call of the actual method handler of the service.
     * If this function returns FALSE, then the method handler will not be called and no output will
     * get generated by default.
     *
     * If the function returns TRUE the service is allowed to run the request handler. This is useful
     * for injecting user authorization code.
     */
    protected function prepareOperation($meth) {
        return false; // by default we always allow the service handlers to be run.
    }
    
    /**
     * @method service_uri($uri)
     *
     * @param $uri: the local portion of the Base URI of the service.
     *
     * This function is a helper function to override the base URI from an external configuration.
     *
     * This function should be used with EXTREME caution! It implies that the entire service initialization
     * has to be re-done. 
     */
    // expects the service path on the HOST
    public function service_uri($uri) {
        $this->uri = $uri;
        // rerun the servive initialization.
        $this->checkServiceURI($_SERVER['REQUEST_URI']);
    }
    
    /**
     * @method setData($data)
     *
     * @param $data: data object to be returned as a response of the request
     *
     * This function is a convenience function to setting the response data of the service.
     *
     * The normal way to do this is to set the dataobject directly.
     */
    protected function setData($data) {
        $this->data = $data;
    }
    
    
    /**
     * @method setDataStash($data)
     *
     * @param $data: data object to be returned as a response of the request
     *
     * This function is a convenience function to setting the response data of the service.
     *
     * The normal way to do this is to set the dataobject directly.
     */
    protected function setDataStash($data) {
        $this->setData($data);
    }
    
    /**
     * COMMON HTTP RESPONSES
     **/
    
       
    /**
     * @method respond_json_data()
     *
     * returns the service internal data stash in JSON format. This method sets the Content-type header to "application/json".
     */
    protected function respond_json_data() {
        //$this->log('respond JSON data');
        header('content-type: application/json; charset=utf-8');
        if ( !empty($this->data)) {
            if (is_array($this->data) || is_object($this->data)) {
                 $this->log('json encode data');
                echo(json_encode($this->data));
            }
            else {
            //$this->log('just echo data');
            echo($this->data);
            }
        }
        else {
            $this->log('no content');
            $this->no_content();
        }
    }
    
    /**
     * @method respond_form_encoded()
     *
     * responds the service internal data stash in the form encoded format.
     *
     * NOTE: the data property needs to contain either a urlencoded string or an object.
     * Only object properties with scalar values (strings, booleans, and numbers) are included
     * into the response.
     */
    protected function respond_form_encoded() {
        $this->log('respond FORM encoded data');
        header('content-type: application/x-www-form-urlencoded; charset=utf-8');
        $retval = "";
        if (!empty($this->data)) {
            if (is_object($this->data)) {
                foreach ($this->data as $k => $v) {
                    if (is_scalar($v)) {
                        if (!empty($retval)) {
                            $retval .= "&";
                        }
                        $retval .= urlencode($k) . '=' . urlencode($v);
                    }
                }
            }
            elseif (is_scalar($this->data)) {
                $retval = $this->data;
            }
            
        }
        if (empty($retval)) {
            $this->no_content();
        }
        else {
            echo($retval);
        }
    }

    protected function respond_text_message($message) {
        header('content-type: text/plain; charset=utf-8');
        echo($message);
    } 
    
    /**
     * @method no_content()
     *
     * sends the 204 No Content response to the client on successfull operations that do not include data. 
     */
    protected function no_content() {
           $this->log("204 OK but No Content ");
          // newer PHP version would use
          // http_response_code(204);
          // our old server requires
          header("HTTP/1.1 204 No Content");
    }
     
    /**
     * @method bad_request($message)
     *
     * @param misc $message (optional) extra message to be send to the client
     *
     * returns the 400 Bad Request error for all call errors (e.g. if a bad item id has been passed).
     */
    protected function bad_request($message="") {
        $this->log("bad request");
        // newer PHP version would use
        // http_response_code(400);
        // our old server requires
        header("HTTP/1.1 400 Bad Request");
        $this->respond_with_message($message);
    }
    /**
     * @method authentication_required($message)
     *
     * @param misc $message (optional) extra message to be send to the client
     *
     * responds a 401 Authentication Required to show the login screen
     */
    protected function authentication_required($message="") {
           $this->log("401 Authentication required ");
          // newer PHP version would use
          // http_response_code(204);
          // our old server requires
          header("HTTP/1.1 401 Unauthorized");
          $this->respond_with_message($message);
    }
    
    /**
     * @method forbidden($message)
     *
     * @param misc $message (optional) extra message to be send to the client
     *
     * returns 403 errors. This should be used if the user is not allowed to access
     * a function or resource
     */
    protected function forbidden($message="") {
           $this->log("forbidden");
           header('HTTP/1.1 403 Forbidden');
           $this->respond_with_message($message);
    }
    
    /**
     * @method not_found($message)
     *
     * @param misc $message (optional) extra message to be send to the client
     *
     * Responds the 404 Not Found code to the client. Used to indicate that one or more requested
     * resources are not available to the system.
     */
    protected function not_found($message="") {
           $this->log("Item not found");
           header("HTTP/1.1 404 Not Found");
           $this->respond_with_message($message);
    }
    
     /**
     * @method not_allowed($message)
     *
     * @param misc $message (optional) extra message to be send to the client
     *
     * This method generates the 405 Not Allowed HTTP code. This method is used
     * to indicate that the service has been called with a forbidden HTTP method by the
     * run() method.
     */
    protected function not_allowed($message="") {
           $this->log("not allowed");
          // newer PHP version would use
          // http_response_code(405);
          // our old server requires
          header("HTTP/1.1 405 Method Not Allowed");
          $this->respond_with_message($message);
    }
      
    /**
     * @method gone($message)
     *
     * @param misc $message (optional) extra message to be send to the client
     *
     * returns the 410 Gone response. Used to indicate successfull DELETE operations.
     */
    protected function gone($message="") {
           $this->log("requested object is gone!");
          // newer PHP version would use
          // http_response_code(410);
          // our old server requires
          header("HTTP/1.1 410 Gone");
          $this->respond_with_message($message);
    }
    
    /**
     * PRIVATE HELPER METHODS
     **/
    
    /**
     * @method respond_with_message($message)
     *
     * @param misc $message: the response message object
     *
     * Helper method for the error responses. It allows to pass a string or a complex datastructure
     * to inform the caller about the problem that caused the message.
     *
     * This method will automatically change the content-type of the message depending on the
     * complexity of the data structure. For scalars (strings, numbers etc.) It will use text/plain.
     *
     * For arrays or objects this method will respond a application/json typed object. This allows
     * to respond complex and machine readable information to the client. 
     */
    private function respond_with_message($message) {
        if (!empty($message)) {
        	$this->log("message is not empty");
            if (is_scalar($message)) {
                header('content-type: text/plain; charset=utf-8');
                echo($message);
            }
            elseif (is_array($message) || is_object($message)) {
                header('content-type: application/json; charset=utf-8');
                echo(json_encode($message));
            }
        }
    }
    
    /**
     * @method void checkServiceURI($uri)
     *
     * @param string $uri This request URI path
     *
     * This pmehtod extracts the path_info part of the request path for further processing.
     *
     * This function is slightly more reliable due to strange behaviour of the official CGI path info
     * in PHP.
     */
    private function checkServiceURI($uri){
        // decides whether or not to run the service
        if (!empty($this->uri) && strncmp($uri, $this->uri, strlen($this->uri)) !== 0) {
            // we test the URI only if the service has the URI set
	        $this->log('invalid URI');
            $this->bURIOK = false;
            return $this->bURIOK;
        }
        $this->log('strip the uri');
        // now strip the pathinfo (if the URI is set)
        if (!empty($this->uri)) {
            $this->log('valid URI');
            $ruri = substr($uri, strlen($this->uri));
            // remove any leading or trailing slashes
            $ruri = preg_replace('/^\/*|\/*$/', '', $ruri);
            $ruri = preg_replace('/\?.*$/', '', $ruri);
            $this->path_info = $ruri;
        }
        return $this->bURIOK;
    }
}


/**
 * @class OAUTHRESTService
 *
 * This class clusters some generic functions that are common for all services that manage
 * access only information. 
 */
class OAUTHRESTService extends RESTServiceCommon {
    /**
     * @property $dbh: The global database handler (protected)
     */
    protected $dbh;
    
    /**
     * @property $session: The OAuth session management class.
     */
    protected $session;
    
    /**
     * @property $OAuthOmitCheck: boolean flag wheter or not the OAuth Access verification should
     * be performed.
     */
    protected $OAuthOmitCheck = false;
    
    /**
     * @method __construct($dbh)
     *
     * @param $dbh: An active database handler
     *
     * Initializes the OAuth session management of the service.
     */
    public function __construct() {
        parent::__construct();
        $this->initDatabase();
        // instantiate the session manamgenet
        $this->session = new SessionManagement($this->dbh);
    }
    
    public function __destruct() {
        $this->dbh->disconnect();
        parent::__destruct();   
    }
    
    private function initDatabase() {
        $cfg = $this->config['database'];
        $dsn = array(
            'phptype'  => $cfg['phptype'],
            'username' => $cfg['username'],
            'password' => $cfg['password'],
            'hostspec' => $cfg['hostspec'],
            'database' => $cfg['database']
        );
        
        $options = array(
            'debug'       => $cfg['debug'],
            'portability' => MDB2_PORTABILITY_ALL,
        );
        
        $this->dbh =& MDB2::connect($dsn, $options);
        if (PEAR::isError($this->dbh)) {
            die($this->dbh->getMessage());
        } else {
            //echo 'Connected Successufly';
            $this->dbh->setCharset($cfg['charset']);
        }
    }
    
    
    /**
     * @method prepareOperation($meth)
     *
     * This runs the OAuth Access Token verification before the Service method is called.
     * If the OAuthOmitCheck is TRUE, then NO check is performed and the service proceeds with
     * calling the method handler.
     *
     * If the OAuth Token cannot get verified the service should not call the method handler.
     * In this case this function returns FALSE, which means that the user is not authenticated.
     */
    protected function prepareOperation($meth) {
        $this->mark();        
    
        // this is needed for CORS Requests.
        if ($meth === 'OPTIONS') {
            return true;
        }

        // OAuthOmitCheck should be always false.
        if ($this->OAuthOmitCheck) {
            $this->log("omit built in oauth check");
            return true;
        }

        $myheaders = getallheaders();
    	if (!array_key_exists("NonAuth",$myheaders)){ 
    		$this->log("will check the validation for access token since no NonAuth available");
       	$this->session->validateAccessToken();
          }
    
        if ( $this->session->accessVerified() ){
            $this->log('Access Token Verified');
            return true;
        }
       
        // $this->log('Access was not verified');
        // $this->authentication_required();
        return false;
    }
}

?>

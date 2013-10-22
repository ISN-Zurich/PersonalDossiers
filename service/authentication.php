<?php

require_once 'MDB2.php';
include 'dbConnect.php';
include_once 'commonService.php';

include 'session.php';

/**
 * @class AuthenticationService
 *
 * @extends OAUTHRESTService
 *
 * The AuthenticationService is responsible for the user authentification and the basic user-profile
 * management.
 *
 * It implements all OAuth steps as well as the invalidtion of accesstokens and the management of
 * a persistent user profile.
 *
 * The user profile of this service is a simple key value pair data structure. It acts as a
 * scratch pad for an application and is not compliant with any user profile standard. Therefore,
 * it should be only used for application specific data. 
 *
 * This service (and all other consumer services) expects the OAuth information in
 * the Authorization Header of the Request
 */
 
class AuthenticationService extends OAUTHRESTService {
    protected $uri = '/tools/service/authentication.php';
    
    protected $dbh;
    protected $session;
    protected $mode;
    
    public function __construct($dbh) {
        parent::__construct($dbh);
        
        $this->mark();
       
        $this->mode = $this->path_info;
        $this->log("mode: " . $this->mode);
    }
    
    /**
     * @method bool prepareOperation($HTTPmethod)
     *
     * @param string $HTTPmethod the HTTP method that is used to call the service
     *
     * This function determines whether the default OAuth AccessToken check should be
     * performed. 
     */
    protected function prepareOperation($meth) {
        if ($meth !== 'DELETE' && !empty($this->mode)) {
            // if the OAuth functions before the actual user authorization perform their specific
            // token validation. Therefore, the default access-token validation must be omitted.
            
            $this->log('what is the mode? ' . $this->mode);
            $this->OAuthOmitCheck = true;
        }

        $this->logtest(  $meth === 'DELETE',                                        'user wants to DELETE');
        $this->logtest(( $meth === 'DELETE' ) && ( $this->mode === 'access_token'), 'user wants to log out');
        
        return parent::prepareOperation($meth);
    }
    
    protected function handle_GET() {
        $this->log("handle_GET");
        switch($this->mode) {
            case "request_token":
                $this->grant_requestToken();
                break;
            case 'authorize':
                $this->obtain_authorization();
                break;
            case 'access_token':
                $this->log('enter grant_accessToken');
                $this->grant_accessToken();
                break;
            default:
                // bad request
                $this->get_userprofile();
                break;
        }
    }
    
    protected function handle_POST() {
        $this->log("handle post");
        
        switch ($this->mode) {
            case 'authorize':
                $this->authenticate_user();
                break;
            default:
                $this->update_userprofile();
                break;
        }
    }
    
    protected function handle_DELETE() {
        $this->mark();
        
        switch($this->mode) {
            case 'access_token':
                $this->invalidate_accessToken();
                break;
            default:
                $this->bad_request();
                break;
        }
    }
    
    protected function grant_requestToken() {
        // GET BASE_URI/request-token
        $this->log("grant request token");
        $this->session->validateConsumerToken();
        if ( $this->session->getOAuthState() === OAUTH_OK) {
            $this->session->generateRequestToken();
            $this->log("send the request token to the client");
            $this->data = $this->session->getRequestToken();
            $this->log(json_encode($this->data));
            $this->respond_json_data();       
        }
        else {
            $this->bad_request();
        }
    }
    
    protected function obtain_authorization() {
        // GET BASE_URI/authorize
        $this->mark();
        
        $this->session->validateRequestToken();
        if ( $this->session->requestVerified()) {
            // return verification code to the user
            // this happens in the case the user is already authenticated
            // should not happen with us
            $this->session->generateVerificationCode();
            $this->data = $this->session->getVerificationCode();
            $this->respond_json_data();
        }
        else {
            // if we reach this point the user is not authenticated
            // so we need to ask for authentication
            $this->authentication_required();
        }
    }
    
    protected function authenticate_user() {
        // POST BASE_URI/authorize
        $this->mark();
        
        $this->session->validateRequestToken(array('email'=>$_POST['email'], 'credentials'=> $_POST['credentials']));
        
        if ($this->session->getOAuthState() === OAUTH_OK) {
            $this->session->verifyUser($_POST['email'], $_POST['credentials']);
            if ( $this->session->requestVerified()) {
                // if the user credentials were ok we can send the verification code to the frontend
                // it should then proceed and get the access token
                $this->session->generateVerificationCode();
                $this->data = $this->session->getVerificationCode();
                $this->respond_json_data();
            }
            else {
                // wrong user name or password
                $this->authentication_required();
            }
        }
        else {
            // the system must request a new request token and start the process over.
            $this->not_allowed();
        }
    }
    
    protected function grant_accessToken() {
        // GET BASE_URI/access_token
        $this->mark();
        $this->session->verifyRequestToken();
        if ($this->session->requestVerified()) {
            $this->session->invalidateRequestToken();
            $this->session->generateAccessToken();
            $this->data = $this->session->getAccessToken();
            $this->respond_json_data();
        }
        else {
            // we should be more precise what went wrong.
            $this->authenticate_user();
        }
    }
    
    protected function get_userprofile() {
        // GET BASE_URI
        $this->mark();
        // fetch the profile from the database
        $sth = $this->dbh->prepare('SELECT profile_data FROM userprofile WHERE user_id = ?');
        $this->log('load profile for '. $this->session->getUserID());
        $res = $sth->execute($this->session->getUserID());
        if (PEAR::isError($res)) {
            
            $this->log('DB Error: ' . $res->getMessage());
            $this->bad_request();
            return;
        }
        
            if ($res->numRows() > 0) {
                $row = $res->fetchRow();
                $sth->free();
                
                try {
                    $this->data = json_decode($row[0], true);
                }
                catch(Exception $e) {
                    $this->bad_request();
                    return;
                }
                
                $this->data['user_id'] = $this->session->getUserID();
            }
            else {
                $this->log('init the user profile');
                $this->data = array('user_id'=> $this->session->getUserID());
            }
            
            $sth = $this->dbh->prepare("SELECT title, name, email FROM users WHERE id = ?");
            $res = $sth->execute($this->data['user_id']);
            if (PEAR::isError($res)) {
                $this->log('DB Error: '.$res->getMessage());
                $sth->free();
                $this->bad_request();
                return;
            }
            
            if ($res->numRows() > 0) {
                $row = $res->fetchRow();
                $this->data['title']  = $row[0];
                $this->data['name']  = $row[1];
                $this->data['email'] = $row[2];
            }
            else {
                $this->log("lost the user's account information");
                // gone is probably the best thing to report
                // maybe 404 not found, but this feels inappropriate on this URL.
                $this->gone();
                return;
            }
            
            $sth->free();
            
            $this->log('user profile is: '. json_encode($this->data));
            
            $this->respond_json_data();
    }
    
    protected function update_userprofile() {
        // POST BASE_URI
    	$this->log('update user profile');
    	
        $data = file_get_contents("php://input");
        $this->log('data found are: '. $data);
        try {
             $tmp = json_decode($data, true);
             $this->log('encoded user data succesfully');
        }
        catch (Exception $e) {
        	$this->log(' did NOT encod user data');
            $this->bad_request();
            return;
        }
         
        if (!isset($tmp)) {
        	$this->log(' did not get any user data');
            $this->bad_request();
            return;
        }
         
        $uid = $this->session->getUserID();
        
        // strip the user id, email and username from the profile
        unset($tmp['user_id']);
        unset($tmp['title']);
        unset($tmp['name']);
        unset($tmp['email']);
    
        $data = json_encode($tmp);
    
        // update or insert?
        $sth = $this->dbh->prepare("SELECT user_id FROM userprofile WHERE USER_ID = ?");
        $res = $sth->execute($uid);
        if (!PEAR::isError($res)) {
            if ($res->numRows() > 0) {
                // update
                $sqlstring = "UPDATE  userprofile SET profile_data = ? WHERE user_id = ?";
                
            }
            else {
                // insert
                $sqlstring = "INSERT INTO userprofile (profile_data, user_id) VALUES (?,?)";
            }
             
            $sth->free();
            $sth = $this->dbh->prepare($sqlstring);
            $sth->execute(array($data, $uid));
            $sth->free();
            $this->no_content();
        }
    }
    
    /**
     * @method void invalidateAccessToken()
     *
     * This method removes the current access token from the database.
     * De facto this means the end of the user session.
     *
     * This function always returns an error code. 
     */
    protected function invalidate_accessToken() {
        // DELETE BASE_URI/access_token
        $this->mark();
        $this->session->invalidateAccessToken();
        $this->authentication_required();  
    }
}


$service = new AuthenticationService($mdb2);
$service->run();

$mdb2->disconnect();

?>
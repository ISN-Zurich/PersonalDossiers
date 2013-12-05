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
            case 'register':
            	$this->register_user();
            	break;
            case 'password':
            	$this->update_password();
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
        		$this->data = json_decode($row[0], true); //true means the returned object will be converted into an associative array
        		
        	}
        	catch(Exception $e) {
        		$this->bad_request();
        		return;
        	}
        	$this->log('data so far in user profile'.json_encode($this->data));
        	$this->data['user_id'] = $this->session->getUserID();
        }
        else {
        	$this->log('init the user profile');
        	$this->data = array('user_id'=> $this->session->getUserID());
        }

        $sth = $this->dbh->prepare("SELECT title, name, password, email FROM users WHERE id = ?");
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
        	$this->data['password']  = $row[2];
        	$this->data['email'] = $row[3];
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
    	$this->mark();
    	$this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
    	$mdb2 = $this->dbh;
    	
        // POST BASE_URI
    	$this->log('update user profile');
    	
        $data = file_get_contents("php://input");
        $this->log('data found are: '. $data);
        
        /******OLD COMMENT********************/
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
        $this->log('user id in update profile is'.$uid);
        
        // strip the user id, email and username from the profile
        //*** VERY OLD COMMENT *****/
        //unset($tmp['user_id']);
        //unset($tmp['title']);
        //unset($tmp['name']);
        //unset($tmp['email']);
    
     	$data = json_encode($tmp);
        
        $types = array();
        array_push($types, "text");
        
        // update or insert?
        $sth = $this->dbh->prepare("SELECT user_id FROM userprofile WHERE USER_ID = ?");
        $res = $sth->execute($uid);
        
        if (!PEAR::isError($res)) {
        	//$mdb2->loadModule('Extended');
            if ($res->numRows() > 0) {
            	$this->log(' before the update user profile query');
            	$this->log(' data to be inserted are '.$data);
                // update the user profile table
                $sqlstring1 = "UPDATE  userprofile SET profile_data = ? WHERE user_id = ?";
                $sth->free();
                $sth = $this->dbh->prepare($sqlstring1);
                $sth->execute(array($data, $uid));
                $sth->free();
            	
            }
            else {
                //  if for the specific user the active dossier is not set yet, then insert it into profile_data in userprofile table 
                $sth2 = $mdb2->prepare("INSERT INTO userprofile (profile_data, user_id) VALUES (?,?)");
                $res2 = $sth2->execute(array($data, $uid));
                if (PEAR::isError($res2)) {
                	$this->log("pear error " . $res2->getMessage());
                	$this->bad_request();
                	return;
                }
            }
            
           //Update the user table
            
            $sth2 = $this->dbh->prepare("SELECT id FROM users WHERE id = ?");
            $res2 = $sth2->execute($uid);
            if (!PEAR::isError($res2)) {
            	$this->log(' before the update of users table');
            	$this->log(' data to be inserted are '.$tmp['title']);
            	$sqlstring2 = "UPDATE users SET title = ?, name = ?,  email = ?  WHERE id = ?";
            	$sth2->free();
            	$sth2 = $this->dbh->prepare($sqlstring2);
            	$sth2->execute(array($tmp['title'],$tmp['name'], $tmp['email'], $uid));
            	$sth2->free();
            }
            else {
            	//insert user data : This part of the user registration
            	
            	     	
            	
            }
            
             
           
            $this->no_content();
        }
    }
    
    
    protected function register_user(){
    	$this->mark();
    	$this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
    	$mdb2 = $this->dbh;
    	
    	$this->log('register user');
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
    	
    	$ttl = $tmp['title'];
    	$name =$tmp['name'];
    	$email = $tmp['email'];
    	$pswd = $tmp['password'];
    	
    	//to check if the email already exists in the database
    	$sthCheck = $this->dbh->prepare("SELECT id FROM users WHERE email = ?");
    	$resCheck = $sthCheck->execute($email);
    	
  		$empty_fields= array();
		// population of array with empty fields
  		if (empty($name)){
  			array_push($empty_fields,"name");
  		}
  		
  		if (empty($email)){
  			array_push($empty_fields,"email");
  		}
  		
  		if (empty($pswd)){
  			array_push($empty_fields,"password");
  		}
			
    	// check the lenght of this array
    	
  		if (count($empty_fields)>0){
  			$this->log("the empty array has elements");
  				
  			$jsonErrorObject=array(
  					"empty"=>$empty_fields
  			);
  			//otherwise we must return 405
  			$this->not_allowed($jsonErrorObject);
  			return;
  		}
  		 
    	
    	
    	//check if there is any error in the query
    	if (PEAR::isError($resCheck)) {
    		$this->log("pear error " . $resCheck->getMessage());
    		$this->bad_request();
    		return;
    	}
    	
    	//if the email existis already in the database
    	if ($resCheck->numRows() == 1) {
    		$this->log("the email exists already in the database");
    		$this->forbidden();
    		return;
    	}
    	else { 
    		$this->log("will try insert register data to the database");
    		$sth = $mdb2->prepare("insert into users (title,name,email,password) values (?, ?, ?, ?)");
    		$res1 = $sth->execute(array($ttl,$name,$email,$pswd));
    		if (PEAR::isError($res1)) {
    			$this->log("couldnt inser the registered data");
    			$this->log("pear error " . $res1->getMessage());
    			$this->bad_request();
    		}
    	}
    	
    }
    
    /**
     * TODO: to write comments
     * 
     * 
     */
    protected function update_password() {
    	$this->mark();
    	$this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
    	$mdb2 = $this->dbh;
    	 
    	// POST BASE_URI
    	$this->log('update password');
    	
    	$data = file_get_contents("php://input");
    	$this->log('data found in update password: '. $data);
    	try {
    		$tmp = json_decode($data, true);
    		$this->log('encoded password data succesfully');
    	}
    	catch (Exception $e) {
    		$this->log(' did NOT encod password data');
    		$this->bad_request();
    		return;
    	}
    	 
    	if (!isset($tmp)) {
    		$this->log(' did not get any password data');
    		$this->bad_request();
    		return;
    	}
    	 
    	
    	
    	//$uid = $this->session->getUserID();
    	
    	$uid=$tmp['user_id'];
    	$this->log(' user id in update password is'.$uid);
    	$data = json_encode($tmp);
    	$uid2=$data['user_id'];
    	$this->log(' user id 2 in update password is'.$uid);
    	
    	$sth = $this->dbh->prepare("SELECT id FROM users WHERE id = ?");
    	$res = $sth->execute($uid);
    	
    	if (!PEAR::isError($res)) {
    		$this->log('there are no errors');
    		if ($res->numRows() > 0) {
    			$this->log(' before the update password query');
    			$this->log(' data to be inserted are '.$tmp['password']);
    			// update the user profile table
    			$sqlstring1 = "UPDATE  users SET password = ? WHERE id = ?";
    			$sth->free();
    			$sth = $this->dbh->prepare($sqlstring1);
    			$sth->execute(array($tmp['password'], $uid));
    			$sth->free(); 
    		}
    		else {
    			// insert
    			$sqlstring = "INSERT INTO userprofile (profile_data, user_id) VALUES (?,?)";
    	
    	
    		}
    	
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
<?php 

require_once 'HTTP/Request.php';
include_once 'commonService.php';

include 'session.php';
include 'user.php';

/**
 * @class DossierACLService
 * @extends OAUTHRESTService
 */

class DossierACLService extends OAUTHRESTService {
protected $servicepath = '/service/dossieracl.php';
	 
	protected $dossier_id;
	protected $item_id;

/**
	 * Constructor($dbh)
	 *
	 * @param $dbh expects a database handler.
	 *
	 * The service constructor initializes all important parameters of the class.
	 * The database handler is required for storing the values into the database.
	 */
	public function __construct() {
		parent::__construct();

        
		$this->mark();
		 
		if ( !empty($this->path_info) ) {
			$parts = explode('/', $this->path_info);
		} else {
			$parts = array();
		}
		if ( count($parts)>1) {
			$this->user_id = $parts[1];
		}
		if ( count($parts) > 0) {
			$this->dossier_id = $parts[0];
		}
		        
		$this->data = array();
	}


/**
* handle_get()
*/
protected function handle_GET() {
		$this->mark();
		$this->log('enter handle_GET');
		
		if ($this->dossier_id > 0 ) {
			$this->log('dossier id >0 in handle_GET');
			$this->read_dossier_users();
		}else if($this->user_id > 0 ){
		     $this->log('user id >0 in handle_GET');
		     $this->read_user_priviledges();
       }
       else{
           $this->bad_request();
	   }
}

/**
* handle_put()
*/
protected function handle_PUT() {
$this->mark();
$this->log('enter handle_PUT');
// make sure that the post parameters are read
		$content = file_get_contents("php://input");
		$this->log($content);
		$data = json_decode($content, true);
		if (!$data) {
			parse_str($content, $_POST);
		}
	if ($this->dossier_id > 0 ) {
			$this->log('dossier id >0 in handle_PUT');
			$this->add_user_to_dossier($data);
		} else{
           $this->bad_request();
	}
}


/**
* handle_post()
*/
protected function handle_POST(){
$this->mark();
$this->log('enter handle_Post');
if ($this->user_id > 0 ) {
 $this->log('user id >0 in handle_POST');
 $this->update_user_priviliges();
  }else { 
 $this->bad_request();
	}
}

/**
* handle_delete()
*/

protected function handle_DELETE(){
$this->mark();
$this->log('enter handle_Delete');
if ($this->user_id > 0 ) {
 $this->log('user id >0 in handle_Delete');
 $this->remove_user_priviliges();
  }else { 
 $this->bad_request();
	}
}

protected function read_dossier_users();
protected function read_user_priviledges();
protected function add_user_to_dossier();
protected function update_user_priviliges();
protected function remove_user_priviliges();

}

$service = new DossierACLService();
$service->run();

?>
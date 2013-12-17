<?php 

require_once 'HTTP/Request.php';
include_once 'commonService.php';

include 'session.php';
include 'user.php';

/**
 * @class NotificationsService
 * @extends OAUTHRESTService
 */

class NotificationsService extends OAUTHRESTService {
protected $servicepath = '/service/notifications.php';
	 
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
			$this->item_id = $parts[1];
		}
		if ( count($parts) > 0) {
			$this->dossier_id = $parts[0];
		}
		        
		$this->data = array();
	}


/**
* handle_get()
*/
protected function handle_GET() {}

/**
* handle_put()
*/
protected function handle_PUT() {}
/**
* handle_post()
*/
protected function handle_POST()

/**
* handle_delete()
*/

protected function handle_DELETE()
}
$service = new NotificationsService();
$service->run();

?>
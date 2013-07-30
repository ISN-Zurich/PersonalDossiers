<?php

require_once 'MDB2.php';
require_once 'HTTP/Request.php';
include 'dbConnect.php';
include_once 'commonService.php';

/**
* UserService Interface Class
*
* This class handles the user management.
*
* The service expects calls of the following style:
* BASE_URI [+ "/" + Dossier_ID]
* 
* It is not a service, its a data management class similar with Session Management.
*
*/

class UserManagement extends PDCommonClass {
   protected $uri = "/tools/service/user.php";

   protected $dbh;
   protected $user_role;
   protected $dossier_type;
   protected $dossierId;
   protected $item_id;

   public function __construct($dbh) {
   parent::__construct($dbh);

   $this->mark();

   // The following code is used in the constructor of authentication service
   //$this->mode = $this->path_info;
   //$this->log("mode: " . $this->mode);

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
   	      // init the database connection
   	      $this->dbh = $dbh;
   	      $this->data = array();
	}//end of constructor

/**
  * getDossierUsers()
  * 
  * gets the list of users of a specific dossier
  * 
 */

	public function getDossierUsers() {

		$this->mark();
		$dbh = $this->dbh;
		$dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
		$dossierId = $this->dossier_id;

		$sth = $dbh->prepare("SELECT u.name, du.user_type, du.user_id FROM users u, dossier_users du WHERE u.user_id = du.user_id AND du.dossier_id = ?");
		$res = $sth->execute($dossierId);
		if ($res->numRows() === 0) {
			if (PEAR::isError($res)) {
				$this->log("pear error " . $res->getMessage());
				$this->bad_request();
				$sth->free();
				return;
			}
		} else { //if the query retrieves back results

			while ($row = $res->fetchRow() ){
				$this->log('row: ' . json_encode($row));
				array_push($retval,array(
				'user_id'=> $row['user_id'],
				'username'=> $row['name'],
				'user_type'=> $row['user_type']));
			}

			$this->data = $retval;
			$this->log("User List of the ".$dossierId." dossier is " .json_encode($this->data));
			$this->respond_json_data();

		} //end of else
	}


public function getUserRole() {

// owner, editor, user

}


public function getDossierType($userId) {
// a dossier can be private or public

}



public function getUsername(){


//return user_name;
}


public function dossierIsPublic(){

// getDossierType;
// if dossierType == public
//return true
//otherwise return false

}

public function isUser($userId){

// getUserRole
// if  user_type =="user", return true otherwise false

}


public function isEditor($userId){

//  getUserRole
//  if user_type == "editor" return true, otherwise false

}

public function isOwner($userId){

//  getUserRole
//  if user_type == "owner" return true, otherwise false

}


}//end of class
?>
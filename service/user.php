<?php

require_once 'MDB2.php';
require_once 'HTTP/Request.php';
include 'dbConnect.php';
include_once 'commonService.php';

include 'session.php';

/**
* UserService Interface Class
*
* This class handles the user management.
*
* The service expects calls of the following style:
* BASE_URI [+ "/" + Dossier_ID]
*
*
*
*
*/

class User extends PDCommonClass {
   protected $uri = "/tools/service/user.php";

   protected $dbh;
   protected $user_role;
   protected $dossier_type;
   protected $dossier;

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
}



// DEFINE  FUNCTIONS

public function getDossierUsers() {

   $this->mark();
   $dbh = $this->dbh;
   $dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
   $dossierId = $this->session->getUserID();

   $sth = $dbh->prepare("SELECT u.name, du.user_type FROM users u, dossier_users du WHERE u.user_id = du.user_id AND du.dossier_id = ?");
   $res = $sth->execute($dossierId);

}


public function getUserRole() {

// owner, editor, user

}


public function getDossierType(userId) {
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

public function isUser(userId){

// getUserRole
// if  user_type =="user", return true otherwise false

}


public function isEditor(userId){

//  getUserRole
//  if user_type == "editor" return true, otherwise false

}

public function isOwner(userId){

//  getUserRole
//  if user_type == "owner" return true, otherwise false

}

$service = new UserService($mdb2);
// check if the active user is allowed to run the service with the given parameter

// if everything is OK run the actual service
$service->run();
$mdb2->disconnect();

?>
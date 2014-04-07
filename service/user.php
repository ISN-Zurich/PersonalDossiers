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
       // parent::__construct($dbh);
       $this->setDebugMode(true);
       $this->mark();
       $this->dbh = $dbh;
       $this->log(" dbh in user constructor is ".$dbh);
	}//end of constructor


    /**
     * @depreciated @method handle_GET 
     * 
     * should be unused as this is no service
     */
	public function handle_GET() {
		$this->mark();
		$this->log('enter handle_GET');
		if ( $this->dossier_id > 0 ) {
			$this->log('dossier id >0 in handle_GET');
			$this->getDossierUsers();
		}
	}

    /**
     * 
     * getDossierUsers()
     * 
     * gets the list of users of a specific dossier
     */

	public function getDossierUsers() {

		$this->mark();
		$dbh = $this->dbh;
		$dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
		$dossierId = $this->dossier_id;

		$sth = $dbh->prepare("SELECT u.name, du.user_type, du.user_id FROM users u, dossier_users du WHERE u.user_id = du.user_id AND du.dossier_id = ?");
		$res = $sth->execute(array($dossierId));
		if ($res->numRows() === 0) {
			if (PEAR::isError($res)) {
				$this->log("pear error " . $res->getMessage());
				$this->bad_request();
				$sth->free();
				return;
			}
		} 
        else { //if the query retrieves back results

			while ($row = $res->fetchRow() ){
				$this->log('row: ' . json_encode($row));
				array_push($retval, array(
				'user_id'=> $row['user_id'],
				'username'=> $row['name'],
				'user_type'=> $row['user_type']));
			}

			$this->data = $retval;
			$this->log("User List of the ".$dossierId." dossier is " .json_encode($this->data));
			$this->respond_json_data();

		} //end of else
	}

    /** 
     * @public @method string getUserRole(userid, dossierid)
     * 
     * Determines the role of a user for a selected dossier. The method has 4 return values:
     * 
     * - 'none': the user has no role for the provided dossier
     * - 'user': the user has viewing rights for the provided dossier
     * - 'editor': the user can add, remove, and arrange items in a dossier
     * - 'owner':  the user owns the dossier and can do whatever he/she wants.
     */
    public function getUserRole($userId, $dossierId) {

        $user_role = "none";
        $this->log("enter hasViewing Priviledges");
        $this->mark();
        if (!isset($this->dbh)){
            $this->log("dbh has not been set");
        }
        else {
            // select private_flag from dossiers table
            $this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
            $mdb2 = $this->dbh;
            $sth = $mdb2->prepare('SELECT user_type FROM dossier_users WHERE user_id=? AND dossier_id=?');
            $res = $sth->execute(array($userId, $dossierId));

            if (PEAR::isError($res)) {
                $this->log("pear error " . $res->getMessage());
                $this->bad_request();
                $sth->free();
            }
            else if ($res->numRows() == 1) {
                $row=$res->fetchRow();
                $user_role = $row['user_type'];

                $sth->free();
            }
        }

        $this->log("user role is ".$user_role);
        return $user_role;
    }

    public function hasUserPriviledges($userId, $dossierId){

        if (!is_numeric($dossierId)){
            return true;
        }

        $user_role=$this->getUserRole($userId, $dossierId);

        if ($user_role == "owner" || $user_role == "editor" || $user_role == "user"){
            $this->log("the user has user priviledges");
            return true;
        }else {
            $this->log("the user has not user priviledges");
            return false;
        }
    }


    public function hasEditorPriviledges($userId, $dossierId){
        $user_role=$this->getUserRole($userId, $dossierId);

        if ($user_role == "owner" || $user_role == "editor"){
            $this->log("the user has editor priviledges");
            return true;
        }else {
            $this->log("the user has not editor priviledges");
            return false;
        }
    }



    public function isOwner($userId, $dossierId){

        $user_role = $this->getUserRole($userId, $dossierId);

        if ($user_role == "owner"){
            $this->log("the user has owner priviledges");
            return true;
        }else {
            $this->log("the user has not owner priviledges");
            return false;
        }
    }


}//end of class


?>
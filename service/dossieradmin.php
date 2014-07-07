<?php

require_once 'HTTP/Request.php';
include_once 'commonService.php';

include 'session.php';
include 'user.php';

/**
 * @class DossierService
 * @extends OAUTHRESTService
 *
 * This class handles the system wide dossier management.
 * 
 * Only admin users and dossier managers have access to this service.
 */ 
class DossierAdminService extends OAUTHRESTService {

    protected $servicepath = '/service/dossieradmin.php';
    
    protected $feature;         // either 'list' or 'dossier'
    protected $page_or_dossier; // depending on the feature this property has different meaning. 
    protected $pagelimit;
    
    public function __construct() {
        parent::__construct();
        // $this->setDebugMode(true);
        
        $this->mark();
        if ( !empty($this->path_info) ) {
            $parts = explode('/', $this->path_info);
        } 
        else {
            $parts = array();
        }
        
        $this->page = 0;
        $this->pagelimit = 50;
        $this->feature = 'list'; 
        
        if ( count($parts) > 0) {
            $this->feature = $parts[0];
        }
        
        if ( count($parts) > 1) {
            if ($this->feature == 'list') {
                $this->page_or_dossier = $parts[1] - 1;
            }
            else {
                $this->page_or_dossier = $parts[1];
            }
        }
        
        if (isset($_GET['limit']) && !empty($_GET['limit']) && $_GET['limit'] > 0) {
            $this->pagelimit = $_GET['limit'];
        }

        $this->data = array();
    }
    
    protected function prepareOperation($meth) {
        $retval = parent::prepareOperation($meth);
        if ($this->feature == 'list' ||
            $this->feature == 'dossier') {
            
            if ($retval && 
                $this->session && 
                $this->session->getUserID()) {
                
                $this->user = new UserManagement($this->dbh);
                $role = $this->user->getAdminRole($this->session->getUserID());
                if (!($role == 'admin' || 
                      $role == 'dossier')) {
                    
                    $this->forbidden();
                    $retval = false;
                } 
                else {
                    
                    switch($meth) {
                        case 'GET':
                            break;
                        case 'POST':
                            if ($this->feature != 'dossier') {
                                $this->bad_request();
                                $retval = false;
                            }
                            break;
                        case 'DELETE': 
                        default:
                            $this->bad_request();
                            $retval = false;
                            break;
                    }
                }
            }
        }
        else {
            $retval = false;
        }
        return $retval;
    }
    
    protected function handle_GET() {
        $this->mark();
        if ($this->feature == 'dossier' &&
            $this->page_or_dossier > 0 ) {
            
            $this->log('dossier id >0 in handle_GET');
            $this->read_dossier();
        }
        else {
            $this->log('read_user dossiers in handle_GET');
            $this->read_dossier_list();
        }
    }

    protected function handle_POST() {
        $this->mark();
        
        if ( $this->feature == 'dossier') {
            $content = file_get_contents("php://input");
            $this->log($content);
            $data = json_decode($content, true);
            
            if ( isset($data) ) {
                $this->update_dossier($data); // make private, feature or stuff
            }
            else {
                $this->bad_request();
            }
        }
    }
    
    protected function read_dossier_list() {
        $this->mark();
        $this->dbh->setFetchMode( MDB2_FETCHMODE_ASSOC );
        
        $offset = $this->page_or_dossier * $this->pagelimit;
        $sqldossiers = "SELECT * FROM dossiers ORDER BY id DESC LIMIT ?, ?";
        $sqldossierids = "SELECT id FROM dossiers ORDER BY id DESC LIMIT ?, ?"; 
 
        $dossiers = array();
        $users    = array();

        // get all dossiers
        $sth = $this->dbh->prepare($sqldossiers);
        $res = $sth->execute(array($offset, $this->pagelimit));
        
        if (PEAR::isError($res)) {
            $this->log("pear error step 1 " . $res->getMessage());
            $this->not_found();
            $sth->free();
            return;
        }
        
        $nrows = $res->numRows();
        $ids = array();

        while($row = $res->fetchRow()) {
            array_push($dossiers, $row);
            array_push($ids, $row['id']);
        }
        $sth->free();
            
//        $sqlusers = "SELECT u.id, u.name, u.email, du.dossier_id, du.user_type FROM users u, dossier_users du WHERE du.user_id = u.id AND du.dossier_id IN (" . $sqldossierids . ")";
        $sqlusers = "SELECT u.id, u.name, u.email, du.dossier_id, du.user_type FROM users u, dossier_users du WHERE du.user_id = u.id AND du.dossier_id IN (" . implode(',', $ids) . ")";
        
        // get all dossier users 
        $sth = $this->dbh->prepare($sqlusers);
//        $res = $sth->execute(array($offset, $this->pagelimit));
        $res = $sth->execute();
        
        if (PEAR::isError($res)) {
            $this->log("pear error step 2 " . $res->getMessage());
            $this->log("SQL was " . $sqlusers);
            $this->not_found();
            $sth->free();
            return;
        }
        while($row = $res->fetchRow()) {
            array_push($users, $row);
        }
        $sth->free();
        $this->data['objects'] = $nrows;
        $this->data['limit'] = $this->pagelimit;
        $this->data['page'] = $this->page_or_dossier + 1;
        $this->data['dossiers'] = $dossiers;
        $this->data['users'] = $users;
        
        $this->respond_json_data();
    }
    
    protected function read_dossier() {
        $this->mark();
    }
    
    protected function update_dossier($data) {
        $this->mark();
        $this->dbh->setFetchMode( MDB2_FETCHMODE_ASSOC );
        
        $dossierid = $this->page_or_dossier;
        $bPrivate  = $data['private_flag'];
              
        $sqlupdate = 'UPDATE dossiers SET private_flag = ? WHERE id = ?'; 
        $sqlselect = 'SELECT id FROM dossiers WHERE id = ?';
        
        if (isset($dossierid)) {
            $sth = $this->dbh->prepare($sqlselect);
            $res = $sth->execute(array($dossierid));
            if (PEAR::isError($res)) {
                $this->log("pear error on update check " . $res->getMessage());
                
                $this->not_found();
                $sth->free();
                return;
            }
            
            if($res->numRows() < 1) {
                $this->log("requested dossier not found");
                $this->not_found();
                $sth->free();
                return;
            }
            
            $sth->free();
            
            $sth = $this->dbh->prepare($sqlupdate);
            $res = $sth->execute(array($bPrivate, $dossierid));
            if (PEAR::isError($res)) {
                $this->log("pear error on update " . $res->getMessage());
                
                $this->not_found();
                $sth->free();
                return;
            }
            
            $sth->free();
            $this->no_content();
        }
        else {
            $this->not_found();
        }
    }
}

$service = new DossierAdminService();
// check if the active user is allowed to run the service with the given parameter

// if everything is OK run the actual service
$service->run();

?>
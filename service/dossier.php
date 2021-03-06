<?php

require_once 'HTTP/Request.php';
include_once 'commonService.php';

include 'session.php';
include 'user.php';

/**
 * @class DossierService
 * @extends OAUTHRESTService
 *
 * This class handles the dossier management.
 * The related service is not expected to be directly used by customers without an
 * appropriate frontend.
 *
 * The service expects calls of the following style:
 *
 * BASE_URI [+ "/" + Dossier_ID [ + "/" + Digital_Library_ID]]
 *
 * It supports PUT, GET, POST, and DELETE HTTP request methods. All other HTTP request methods
 * are not allowed.
 *
 * Standard use cases
 *
 * The examples assume http://example.com/DossierService.php as BASE_URI
 *
 * 1. Create a new Dossier with default values
 *
 * PUT http://example.com/DossierService.php
 *
 * 2. add a new Item to a dossier
 *
 * PUT http://example.com/DossierService.php/12 (POST Data: id=153256)
 *
 * 3. remove the new item from the dossier again
 *
 * DELETE http://example.com/DossierService.php/12/153256
 *
 * 4. Update the title of a dossier
 *
 * POST http://example.com/DossierService.php/12 (POST Data: title=Some%20fancy%20title)
 *
 * 5. Update the banner image url for a dossier
 *
 * POST http://example.com/DossierService.php/12 (POST Data: image=http://example.com/images/banner/1235424.jpg)
 *
 * 6. remove the entire dossier
 *
 * DELETE http://example.com/DossierService.php/12
 *
 * 7. Get the dossier
 *
 * GET http://example.com/DossierService.php/12
 *
 */
class DossierService extends OAUTHRESTService {
    protected $servicepath = '/service/dossier.php';

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
     *
     * This handler method is called on GET requests.
     *
     * Depending on the service parameters it switches between "dossier mode" and "dossier item mode".
     *
     * The dossier item mode is activated if a dossier id and an item id are found on the service URL.
     *
     * The dossier mode is activated if only a dossier id is found on the serivce URL.
     *
     * In all other cases the handler triggers a bad request.
     */
    protected function handle_GET() {
        $this->mark();
        $this->log('enter handle_GET');
        if ($this->item_id > 0 ) {
            $this->log('item id >0 in handle_GET');
            $this->read_item();
        }
        else if ( $this->dossier_id > 0 ) {
            $this->log('dossier id >0 in handle_GET');
            $this->read_dossier();
        }
        else {
            $this->log('read_user dossiers in handle_GET');
            $this->read_user_dossiers();
        }
    }

    /**
     * handle_post()
     *
     * This handler method is called on POST requests.
     *
     * Depending on the service parameters it switches between "dossier mode" and "dossier item mode".
     *
     * The dossier item mode is activated if a dossier id and an item id are found on the service URL.
     *
     * The dossier mode is activated if only a dossier id is found on the serivce URL.
     *
     * In all other cases the handler triggers a bad request.
     */
    protected function handle_POST() {
        $this->mark();
        // make sure that the post parameters are read
        $content = file_get_contents("php://input");
        $this->log($content);
        $data = json_decode($content, true);
        if (!data) {
            parse_str($content, $_POST);
        }
        if ($this->item_id > 0 ) {
            $this->update_item($data);
        }
        else if ( $this->dossier_id > 0 ) {
            $this->update_dossier();
        }
        else {
            $this->bad_request();
        }
    }

    /**
     * handle_put()
     *
     * This handler method is called on PUT requests.
     *
     * Depending on the service parameters it switches between "dossier mode" and "dossier item mode".
     *
     * The dossier item mode is activated if a dossier id is found on the service URL.
     *
     * The dossier mode is activated if the service URL has no additional parameters.
     *
     * If the service is called with an item id this handler triggers a bad request.
     */
    protected function handle_PUT() {
        $this->mark();
        // make sure that the post parameters are read
        $content = file_get_contents("php://input");
        $this->log($content);
        $data = json_decode($content, true);
        if (!$data) {
            parse_str($content, $_POST);
        }

        if ( $this->item_id ) {
            $this->bad_request();
        }
        else if ( $this->dossier_id ) {
            $this->add_item($data);
        }
        else {
            $this->add_dossier();
        }
    }

    /**
     * handle_delete()
     *
     * This handler method is called on DELETE requests.
     *
     * Depending on the service parameters it switches between "dossier mode" and "dossier item mode".
     *
     * The dossier item mode is activated if a dossier id and an item id are found on the service URL.
     *
     * The dossier mode is activated if only a dossier id is found on the serivce URL.
     *
     * In all other cases the handler triggers a bad request.
     */
    protected function handle_DELETE(){
        $this->mark();
        if ($this->item_id > 0 ) {
            $this->delete_item();
        }
        else if ( $this->dossier_id > 0 ) {
            $this->delete_dossier();
        }
        else {
            $this->bad_request();
        }
    }

    /**
     * delete_item()
     *
     * method called by the handle_delete() method in dossier item mode.
     *
     * Removes one item from a dossier.
     *
     * If the requested item is not part of the dossier or the dossier does not exist, this method
     * will trigger a 404 Not Found error.
     */
    protected function delete_item() {
        $this->mark();

        $this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
        $mdb2 = $this->dbh;

        // verify item
        // first check if the item actually exists in the dossier
        $sth = $mdb2->prepare('SELECT id FROM dossier_items WHERE dossier_id = ? and digital_library_id = ?');
        $res = $sth->execute(array($this->dossier_id, $this->item_id));
        if (PEAR::isError($res)) {
            $this->log("pear error " . $res->getMessage());
            $this->bad_request();
            $sth->free();
            return;
        }

        $bItem = $res->numRows();
        $sth->free();

        if ( $bItem < 1 ) {
            $this->log("item does not exist in this dossier");
            $this->not_found();
            return;
        }

        // delete item
        $sth = $mdb2->prepare('DELETE FROM dossier_items WHERE dossier_id = ? and digital_library_id = ?');
        $res = $sth->execute(array($this->dossier_id, $this->item_id));
        if (PEAR::isError($res)) {
            $this->log("pear error " . $res->getMessage());
            $this->bad_request();
            return;
        }
        $sth->free();

        //HTTP spec defines 200 OK or 204 NO CONTENT as succesful DELETE operation.
        //GONE is an error!
        // $this->gone();

        //return successful 204 NO CONTENT
        $this->no_content();
    }

    /**
     * add_item()
     *
     * adds a new item to a dossier. This method is called by the handle_put() method in dossier item mode.
     *
     * This method expects an "id" parameter passed as POST url encoded form data that contains the
     * digital library id of the new dossier item.
     *
     * If the requested dossier does not exist, the method triggers a 404 Not Found error.
     *
     * If the new item id is not present in the digital library, the method triggers a 404 Not Found error.
     *
     * If the new item already exists in the dossier, then the service will silently accept the call
     * with a 204 No Content response.
     *
     * On success this method returns the id of the newly created dossier item. This ID is only used for
     * verification and has not functional meaning for the caller.
     */
    protected function add_item($data) {

        $this->mark();

        // sanity check by firstly loading dossier data
        $this->dbh->setFetchMode( MDB2_FETCHMODE_ASSOC );

        //reference the database handler
        $mdb2 = $this->dbh;

        //prepare and execute, retrieve dossier id
        $sth = $mdb2->prepare( 'SELECT * FROM dossiers WHERE id = ?' );
        $res = $sth->execute( array($this->dossier_id) );

        //free
        $sth->free();

        //check if we have supplied a valid dossier id that exists in the db
        $bDossier = $res->numRows();
        if ( $bDossier < 1 ) {

            $this->log( "no dossier to add the item to" );
            $this->not_found();
            return;
        }

        // verify a digital library id was passed in to the function
        if ( array_key_exists( "id" , $data ) ) {

            //reference it and sanity check
            $digital_library_id = $data["id"];
            if ( !isset( $digital_library_id ) && !( strlen( $digital_library_id ) > 0 ) ) {

                //what a strange way to check
                $this->log( "no item id passed" );
                $this->bad_request();
                return;
            }
        } else {

            $this->log( "no item id passed" );
            $this->bad_request();
            return;
        }

        // verify that the object isn't already in the dossier
        $sth = $mdb2->prepare( 'SELECT id FROM dossier_items WHERE dossier_id = ? AND digital_library_id = ? LIMIT 1' );
        $res = $sth->execute( array( $this->dossier_id , $digital_library_id ) );

        //free
        $sth->free();

        //check for item existence in the dossier already
        $bItemInDossier = $res->numRows();
        if ( $bItemInDossier > 0 ) {

            $this->log( 'Item already exists in this dossier, silently send OK' );
            $this->no_content();
            return;
        }

        // check if the item is already loaded from the KMS and stored in our library_metadata table
        $sth = $mdb2->prepare( 'SELECT digital_library_id FROM library_metadata WHERE digital_library_id = ? LIMIT 1' );
        $res = $sth->execute( array( $digital_library_id ) );

        //free
        $sth->free();

        //check if item is already cached from the KMS in the db
        $bItemCached = $res->numRows();
        if ( $bItemCached <= 0 ) {

            //in future if the load is too high on the KMS we can change to insert a placeholder,
            //then update the library metadata table when the KMS responds.

            // get the item from the KMS
            // $r = new HTTP_Request('http://yellowjacket.ethz.ch/tools/data/'.$digital_library_id . '.json', "GET");

            // TESTME: new KMS code
            $r = new HTTP_Request('http://mercury.ethz.ch/serviceengine/OWContent', array('method'=> 'POST'));

            try {

                $r->addPostData('serviceid', 'ISN');
                $r->addPostData('owid', '898');
                $r->addPostData('ocid', '531');
                $r->addPostData('lng', 'en');
                $r->addPostData('id', $digital_library_id);

                $r->sendRequest();
                if ( $r->getResponseCode() == 200 ) {

                    $itemmeta = $r->getResponseBody();
                    // trim whitespace
                    $itemmeta = preg_replace('/[\s\n\r\t]+/', ' ', $itemmeta);
                    
                    $this->log( 'response message itemmeta ' . $itemmeta );
                    $tmp = json_decode( $itemmeta );

                    if ( json_last_error() !== JSON_ERROR_NONE ) {
                        $lasterr = "Unknown error";
                        switch (json_last_error()) {
                        case JSON_ERROR_DEPTH:
                            $lasterr = ' - Maximum stack depth exceeded';
                            break;
                        case JSON_ERROR_STATE_MISMATCH:
                            $lasterr =  ' - Underflow or the modes mismatch';
                            break;
                        case JSON_ERROR_CTRL_CHAR:
                            $lasterr =  ' - Unexpected control character found';
                            break;
                        case JSON_ERROR_SYNTAX:
                            $lasterr =  ' - Syntax error, malformed JSON';
                            break;
                        case JSON_ERROR_UTF8:
                            $lasterr =  ' - Malformed UTF-8 characters, possibly incorrectly encoded';
                            break;
                        default: 
                            break;
                        }
                        
                        throw new Exception( "JSON PARSING ERROR " . json_last_error() . ': ' . $lasterr );
                    }

                    if ( empty( $tmp ) ) {
                        throw new Exception( "No JSON data returned from KMS" );
                    }

                    $tmp->{'image'} = html_entity_decode( $tmp->{'image'} );
                    $this->log( 'image url: '. $tmp->{'image'} );

                    $tmp->{'isn_detail_url'} = html_entity_decode( $tmp->{'isn_detail_url'} );
                    $this->log( 'isn_detail_url: ' . $tmp->{'isn_detail_url'} );

                    $itemmeta = json_encode( $tmp );
                } else {

                    $this->log( 'response code is: ' . $r->getResponseCode() );
                }
            }
            catch ( HttpException $e ) {
                $this->log( "HTTP error while fetching the item: " . $e->getMessage() );
                $this->logtest( empty( $tmp ) , "invalid JSON returned" );
                $this->bad_request();
                return;
            }
            catch ( Exception $e ) {
                $this->log( "Data Error: " . $e->getMessage() );
                $this->bad_request();
                return;
            }

            // verify that the KMS actually returned something meaningful
            if ( empty( $itemmeta ) ) {
                $this->log( "item not in KMS" );
                $this->not_found();
                return;
            }

            //insert library id and metadata for it into a separate table
            $sth = $mdb2->prepare( 'REPLACE INTO library_metadata ( digital_library_id , metadata ) VALUES ( ? , ? )' );
            $res = $sth->execute( array( $digital_library_id , $itemmeta ) );

            //free
            $sth->free();
            if ( PEAR::isError( $res ) ) {

                $this->log( 'pear error ' . $res->getMessage() );
                $this->bad_request();
                return;
            }
        } //end of IF. now we know that the KMS metadata is in our database.

        //calculate the position id of the newly inserted item
        // 1 select the records from dossier items where dossier_id = dossier id
        // count the number of the results
        // position id is the number of results + 1
        $sth = $mdb2->prepare( 'SELECT * FROM dossier_items WHERE dossier_id = ?' );
        $res = $sth->execute( array( $this->dossier_id ) );

        //free
        $sth->free();
        if ( PEAR::isError( $res ) ) {

            $this->log( 'pear error ' . $res->getMessage() );
            $this->bad_request();
            return;
        }

        //no error so far, the number of rows will be the new item's position
        $item_position = $res->numRows();

        //log our values so far, just before we insert
        $this->log( 'data for insert - digital_library_id:' . $digital_library_id . " dossier_id:" . $this->dossier_id . ' item_position:' . $item_position );

        //now we actually add the item to the very dossier (we no longer use the user id for the dossier items)
        $sth = $mdb2->prepare( 'INSERT INTO dossier_items ( digital_library_id , dossier_id , position ) VALUES ( ? , ? , ? )' );
        $res = $sth->execute( array( $digital_library_id , $this->dossier_id , $item_position ) );

        //free
        $sth->free();
        if ( PEAR::isError( $res ) ) {

            $this->log( 'pear error ' . $res->getMessage() );
            $this->bad_request();
            return;
        }

        //assign the item to the dossier in the json array we will return
        $this->item_id = $mdb2->lastInsertID( "dossiers" , "id" );

        //form a 'data' array to be json'd
        array_push( $this->data , array( "dossier_id" => $this->dossier_id , "item_id" => $this->item_id ) );

        //return the 'data' array as json data
        $this->respond_json_data();
    }

    /**
     * update_item()
     *
     * This method is called by handle_post() in dossier item mode and changes the position of a
     * dossier item inside the provided dossier.
     *
     * */
    protected function update_item($data) {

        $this->mark();
        $this->log("enter update item");

        //load item data

        if (array_key_exists('sortedList', $data)) {
            $this->log("update sortedList");
            $sorted_list=$data['sortedList'];
        }

        $this->log("sorted list is".json_encode($sorted_list));
        $dossier_id=$this->dossier_id;
        $this->log("dossier id in update item is ".$dossier_id);


        //iterate over the sorted_List array
        //for each item of this list insert into dossier_items the dig. library id in the order defined by the sorted list array
        $values = array();
        $types = array();

        if ( !empty( $sorted_list ) ) {

            foreach( $sorted_list as $key => $value ) {

                $this->log("enter foreach loop");

                $values["dossier_id"]=$dossier_id;
                array_push($types, "integer");
                $values["digital_library_id"]=$value;
                array_push($types, "integer");
                $values["position"]=$key;
                array_push($types, "integer");
                $mdb2 = $this->dbh;
                $mdb2->loadModule('Extended');

                // key is the for the position for item id with id = value
                $affectedRows = $mdb2->extended->autoExecute( "dossier_items" , $values , MDB2_AUTOQUERY_UPDATE , 'digital_library_id = ' . $mdb2->quote( $value , 'integer' ) , $types );

                if ( PEAR::isError( $affectedRows ) ) {

                    $this->log( "error " . $affectedRows->getMessage() );
                    $this->bad_request();
                } else {

                    $this->log( "Service: item updated" );
                    $this->no_content();
                }
            } //end of for
        } //end of if
    } //end of function

    /**
     * read_item()
     *
     * This method is called by handle_get() in dossier item mode. It is used in getBoookmarkedDossiers in
     * order to check which dossiers of the current user have already the specific dossier item.
     *
     * The retrieved from the client REQUEST URL has the following format: http://baseURL/service/dossier.php/string/item_id, where:
     * - baseURL : is the address of the server that hosts the service.
     * - string: it is "dossiers". We pass this string and not a specific dossier id in order to check all the dossiers
     * - item_id: it is the id of the a dossier item of any dossier.
     *
     *
     * SELECT DISTINCT di.dossier_id
     * FROM  `dossier_items` di, dossier_users du
     * WHERE du.dossier_id = di.dossier_id
     * AND du.user_id =1
     * AND di.digital_library_id =169327
     * LIMIT 0 , 30
     */
    protected function read_item() {
        $this->mark();
        $this->log("enter read item");
        $this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
        $dbh = $this->dbh;

        // get the values of the variables that we will use in the query
        $user_id=$this->session->getUserID();
        $item_id= $this->item_id;

        $this->log("user id in read item is ".$user_id);
        $this->log("item id  ".$item_id);

        $sth= $dbh->prepare("SELECT di.dossier_id FROM dossier_items di,dossier_users du WHERE du.dossier_id = di.dossier_id AND du.user_id = ? AND di.digital_library_id=?");
        $res = $sth->execute(array($user_id,$item_id));

        if (PEAR::isError($res)){
            $this->log('DB Error 1: ' . $res->getMessage());
            $sth->free();
            $this->bad_request();
            return;
        }

        //if no dossier has this item then
        //return an empty array
        if ($res->numRows()<1){
            $retval2 = array();
            $this->data["dossiers"]=$retval2;
        }


        $retval = array();
        if ($res->numRows() > 0) {
            while ($row = $res->fetchRow() ){
                $this->log('row: ' . json_encode($row));
                array_push($retval,$row['dossier_id']);
            }
            $this->data["dossiers"]=$retval;
        }

        $this->respond_json_data();
    }

    /**
     * delete_dossier()
     *
     * Removes an entire dossier and all its items from the service. This method is called by the
     * handle_delete() method in dossier mode.
     *
     * On success the service returns 204 NO CONTENT, as per HTTP spec.
     *
     * If the requested dossier cannot be found, the service responds
     * with a 404 Not Found error.
     */
    protected function delete_dossier() {

        //mark the log file, load Extended module and configure the default fetch mode
        $this->mark();
        // $this->dbh->loadModule( 'Extended' );
        $this->dbh->setFetchMode( MDB2_FETCHMODE_ASSOC );
        
        if (empty($this->dossier_id)) {
            //couldn't find the dossier in the db, return a 404 not found
            $this->mark("no dossier id");
            $this->not_found();
            return;
        }
        
        $this->log('attempt to delete ' . $this->dossier_id);
        $this->log('request URL is ' . $_SERVER['REQUEST_URI']);
        
        $sqlparam = array($this->dossier_id);
        
        //handle on database
        $mdb2 = $this->dbh;

        //prepare the statement then execute to check for dossier id
        $sth = $mdb2->prepare( 'SELECT * FROM dossiers WHERE id = ?' );
        $res = $sth->execute( $sqlparam );

        //boolean?! dossier flag based on the number of rows returned
        $bDossier = $res->numRows();

        //free the statement
        $sth->free();
        if ( $bDossier < 1 ) {
            $this->mark("dossier id " . $this->dossier_id . " not found in the DB");
            //couldn't find the dossier in the db, return a 404 not found
            $this->not_found();
            return;
        }
        
        // if we get here we've found the dossier to delete!
        // first remove all the items in the dossier
        $sth = $mdb2->prepare( 'DELETE FROM dossier_items WHERE dossier_id = ?' );
        $res = $sth->execute( $sqlparam );
//        $affectedRows = $this->dbh->extended->autoExecute( "dossier_items" , $sqlparam , MDB2_AUTOQUERY_DELETE , 'dossier_id = ?' );
//        if ( PEAR::isError( $affectedRows ) ) {
        if ( PEAR::isError( $res ) ) {

//            $this->log( "error " . $affectedRows->getMessage() );
            $this->log( "error " . $res->getMessage() );
            $this->bad_request();
            return;
        }

        // now we should remove all dossier users, too
        $sth = $mdb2->prepare( 'DELETE FROM dossier_users WHERE dossier_id = ?' );
        $res = $sth->execute( $sqlparam );
//        $affectedRows = $this->dbh->extended->autoExecute( "dossier_users" , $sqlparam , MDB2_AUTOQUERY_DELETE , 'dossier_id = ?' );
//        if ( PEAR::isError( $affectedRows ) ) {
        if ( PEAR::isError( $res ) ) {
            $this->log( "error " . $res->getMessage() );
            $this->bad_request();
            return;
        }

        // if we removed all related items successfully, we also remove the dossier itself.
        $sth = $mdb2->prepare( 'DELETE FROM dossiers WHERE id = ?' );
        $res = $sth->execute( $sqlparam );
//        $affectedRows = $this->dbh->extended->autoExecute( "dossier_users" , $sqlparam , MDB2_AUTOQUERY_DELETE , 'dossier_id = ?' );
//        if ( PEAR::isError( $affectedRows ) ) {
        if ( PEAR::isError( $res ) ) {
            $this->log( "error " . $res->getMessage() );
            $this->bad_request();
            return;
        } 
        
        //if we get here we've managed to delete the dossier and associated fragments successfully
        $this->log( "Service 2: dossier deleted" );

        // $this->gone();
        //return 204 no content as per HTTP specification
        $this->no_content();
    }

    /**
     * add_dossier()
     *
     * This method creates a new dossier for a user. This method is called by the handle_put() method
     * in dossier mode.
     *
     * On success this method responds with the id of the newly created dossier.
     *
     * This method expects a title, a description, or an image item on the url-encoded form data posted to
     * the service. If these items do not exist, it uses default values instead.
     */
    protected function add_dossier() {
        $this->mark();

        $mdb2 = $this->dbh;
        $ttl = "";
        $dsc = "";
        $img = "";

        if (array_key_exists('title', $_POST)) {
            $ttl = $_POST['title'];
        }
        if (array_key_exists('description', $_POST)) {
            $dsc = $_POST['description'];
        }

        if (array_key_exists('image', $_POST)) {
            $img = $_POST['image'];
        }

        // all the default value handling is done in the create dossier function
        // so in the simplest case all three parameters are empty.
        if ($this->create_dossier($ttl, $dsc, $img)) {
            $this->respond_json_data();
        }
        else {
            $this->bad_request();
        }
    }

    /**
     * @method bool create_dossier($title, $description, $image)
     *
     * @param string $title the title of the new dossier
     * @param string $description the short description of the dossier
     * @param string $image the image URI for the banner
     *
     * This method creates a dossier in the database and assigns the active user as
     * its owner.
     *
     * When the dossier has been inserted into the database, the method returns TRUE.
     * If the method fails to create the dossier or cannot assing the user to it
     * the method will return FALSE. FALS typically indicates a database error.
     */
    protected function create_dossier($title, $description, $image) {
        $mdb2 = $this->dbh;

        if (empty($title)) {
            $title = "My Personal Dossier";
        }
        if (empty($description)) {
            $description = "This is your new Dossier. You can change the title, description, and picture by clicking on the 'Edit Dossier' button. To change the image click the image space.";
        }
        if (empty($image)) {
            $image = "gallery/default3.jpg";
        }

        $sth = $mdb2->prepare("insert into dossiers (title, description, image) Values (?,?,?)");
        $res = $sth->execute(array($title, $description, $image));

        if (PEAR::isError($res)) {
            $sth->free();

            $this->log("DB error while creating the dossier " . $res->getMessage());
            return false;
        }
        else {
            $sth->free();
            // get last inserted id
            $this->dossier_id = $mdb2->lastInsertID("dossiers", "id");
            array_push($this->data, array("dossier_id"=> $this->dossier_id));

            // attach the active user as a dossier owner.
            $sth = $mdb2->prepare('INSERT INTO dossier_users (user_id, dossier_id, user_type) VALUES (?,?,?)');
            $res = $sth->execute(array($this->session->getUserID(), $this->dossier_id, 'owner'));
            if (PEAR::isError($res)) {
                $sth->free();

                $this->log("DB error while adding the user privileges " . $res->getMessage());
                return false;
            }
        }
        return true;
    }

    /**
     * update_dossier()
     *
     * updates the meta data of a dossier. This method is called by handle_post() in dossier mode.
     *
     * If the requested dossier id does not exist the service responds with a 404 Not Found error.
     *
     * The service expects a title, dossier, or image item to be present in the url-encoded post data.
     * All data items are optional, but at least one item has to be present and set.
     *
     * If none of the data items is present on the POST data, the service responds with 400 Bad Request.
     *
     * On success the service responds on 204 No Content.
     */
    protected function update_dossier() {
        $this->mark();
        // verify dossier id
        $this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
        $mdb2 = $this->dbh;
        $sth = $mdb2->prepare('SELECT * FROM dossiers WHERE id=?');
        $res = $sth->execute($this->dossier_id);
        $bDossier = $res->numRows();
        $sth->free();
        if ($bDossier == 1) {
            // check for the variables
            if (array_key_exists('title', $_POST)) {
                $this->log("update title!");
                $ttl = $_POST['title'];
            }
            if (array_key_exists('description', $_POST)) {
                $dsc = $_POST['description'];
                $this->log("update description! " . $dsc);
            }

            if (array_key_exists('image', $_POST)) {
                $this->log("update image!");
                $img = $_POST['image'];
            }

            if (!empty($ttl) || !empty($dsc) || !empty($img)) {


                $values = array();
                $types = array();

                if (!empty($ttl)) {
                    $values["title"]= $ttl;
                    array_push($types, "text");
                }
                // Commenting out to enable empty description
                //if (!empty($dsc)) {
                    $values["description"]= $dsc;
                    array_push($types, "text");
                //}
                if (!empty($img)) {
                    $values["image"]= $img;
                    array_push($types, "text");
                }

                $mdb2->loadModule('Extended');
                $affectedRows = $mdb2->extended->autoExecute("dossiers",
                        $values,
                        MDB2_AUTOQUERY_UPDATE,
                        'id = '.$mdb2->quote($this->dossier_id, 'integer'),
                        $types);
                if (PEAR::isError($affectedRows)) {
                    $this->log("error " . $affectedRows->getMessage());
                    $this->bad_request();
                }
                else {
                    $this->log("Service 2: dossier updated");
                    $this->no_content();
                }

            }
            else {
                $this->bad_request();
            }
        }
        else {
            $this->not_found();
        }
    }

    /**
     * read_dossier()
     *
     * Returns all information for a selected dossier. This method is called by the handle_get() method in dossier mode.
     *
     * If the requested dossier does not exist, the service responds with a 404 Not Found error.
     *
     * On success the service returns the dossier meta-data and all dossier items.
     */
    protected function read_dossier() {
        $this->mark();

        // verify dossier id
        $this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
        $mdb2 = $this->dbh;

        $sth = $mdb2->prepare('SELECT * FROM dossiers WHERE id=?');
        $this->log('dossierId in read dossier is '.$this->dossier_id);
        $res = $sth->execute(array($this->dossier_id));

        if ($res->numRows() == 1) {
            // load the dossier meta data
            // there should be only one dossier with that id
            $this->log('found the dossier');
            $row=$res->fetchRow();
            $this->data['dossier_metadata'] = $row;
            $sth->free();

            // load the dossier item list
            $sth = $mdb2->prepare('SELECT lm.metadata, di.dossier_id, di.position FROM dossier_items di,library_metadata lm  WHERE di.dossier_id=? AND di.digital_library_id = lm.digital_library_id ORDER BY di.position ASC ');
            $res = $sth->execute($this->dossier_id);
            $idata= array();
            while ($row=$res->fetchRow()) {
                //parse the item meta data first
                $row["metadata"] = json_decode($row["metadata"]);
                array_push($idata,$row);
            }

            $this->data["dossier_items"]=$idata;

            // load the users for the specific dossier

            $sth = $mdb2->prepare("SELECT u.name, du.user_type, du.user_id FROM users u, dossier_users du WHERE u.id = du.user_id AND du.dossier_id = ?");
            $res = $sth->execute($this->dossier_id);
            if (PEAR::isError($res)) {
                $this->log('cannot execute the query for the users');
                $this->log('DB Error: ' . $res->getMessage());
                $this->bad_request();
                return;
            }
            //$udata= array();
            $retval = array();
            if ($res->numRows() > 0) {
                while ($row = $res->fetchRow() ){
                    $this->log('row: ' . json_encode($row));
                    array_push($retval, array(
                    'user_id'   => $row['user_id'],
                    'username'  => $row['name'],
                    'user_type' => $row['user_type']));
                    //array_push($udata,$row);
                }

                //$this->data["user_list"] = $udata;
                $this->data["user_list"] = $retval;
                $this->log("User List of the ".$this->dossier_id." dossier is " .json_encode($this->data["user_list"]));
            }
            $this->respond_json_data();
        }
        else {
            $this->log("dossier with id ". $this->dossier_id . ' not found');
            $this->not_found();
        }
        $sth->free();
    }

    protected function read_user_dossiers() {
        $this->mark();
        $dbh = $this->dbh;
        $dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);

        $userid = $this->session->getUserID();

        $sth = $dbh->prepare("SELECT d.id, d.title, d.description, d.image, d.private_flag, du.user_type FROM dossiers d, dossier_users du WHERE d.id = du.dossier_id AND du.user_id = ? ORDER BY d.id DESC");
        $res = $sth->execute($userid);
        if (PEAR::isError($res)){
            $this->log('DB Error 1: ' . $res->getMessage());
            $sth->free();
            $this->bad_request();
            return;
        }

        $retval = array();

        if ($res->numRows() === 0) {
            // if the user has no dossier yet, we create one for her/him
            $sth->free();
            if ($this->create_dossier('','','')){
                $sth = $dbh->prepare("SELECT d.id, d.title, d.description, d.image, d.private_flag, du.user_type FROM dossiers d, dossier_users du WHERE d.id = du.dossier_id AND du.user_id = ?");
                $res = $sth->execute($userid);
                if (PEAR::isError($res)){
                    $this->log('DB Error 2: ' . $res->getMessage());
                    $sth->free();
                    $this->bad_request();
                    return;
                }
            }
            else {
                $this->bad_request();
                return;
            }
        }
        while ($row = $res->fetchRow() ){
            $this->log('row: ' . json_encode($row));
            array_push($retval, array(
            'dossier_id'    => $row['id'],
            'title'         => $row['title'],
            'description'   => $row['description'],
            'image'         => $row['image'],
            'private_flag'  => $row['private_flag'],
            'user_type'     => $row['user_type']
            ));
        }

        $this->data = $retval;
        $this->log("Dossier List is: " . json_encode($this->data));
        $this->respond_json_data();
    }

    /**
     * @method boolean dossierExists(id)
     * 
     * This function returns true if the dossier with the given id exists.
     */
    protected function dossierExists() {
        $this->mark();
        $this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
        $sth = $this->dbh->prepare('SELECT * FROM dossiers WHERE id=?');
        $res = $sth->execute(array($this->dossier_id));
        $retval = false;
        if ($res->numRows() == 1) {
            $retval = true;
        }
        return $retval;
    }

    /**
     * dossierIsPublic()
     *
     * This function is useful in order to restrict the access and management
     * of a dossier to users that do not have the permission on it.
     *
     * If a dossier is public, everyone (every type of authenticated and non-authenticated users)
     * can see it.
     *
     * Returns true if the dossier type is public and false if it is private
     *
     */

    protected function dossierIsPublic($dossierId){
        $this->mark();
        // select private_flag from dossiers table
        $this->dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);
        $mdb2 = $this->dbh;
        $sth = $mdb2->prepare('SELECT * FROM dossiers WHERE id=? AND (private_flag is NULL OR private_flag = 0)');
        $res = $sth->execute(array($this->dossier_id));
        if ($res->numRows() == 1) {
            //there should be only one dossier with that id
            $row=$res->fetchRow();
            $private_flag = $row;
            $sth->free();
            $this->log("dossier is public");
            return true;
        }
        
        $this->log("dossier is private");
        return false;
    }



    protected function prepareOperation($meth) {
        $retval = parent::prepareOperation($meth);

        //if any external guest user access a dossier via a shared link
        //he should be able to
        if ($meth == 'GET' &&
            $this->dossier_id &&
            $this->dossierIsPublic($this->dossier_id)) {
            // all visitors are allowed to access any public dossier for reading.
            // This is required for external linking
            $this->log('public dossier is accessed');

            $retval = true;
        }
        else if ($this->session &&
                 $this->session->getUserID() &&
                 $this->dossier_id) {
            // now check if the user is allowed to perform the requested method

            // authenticated user
            // check if the user is allowed to perform the requested operation
            switch($meth) {
                case 'GET':
                    $this->log("enter GET in prepare statement in dossier.php");
                    // only access if the dossier is public or if the user is a "user" (or editor or owner)
                    $this->user = new UserManagement($this->dbh);
                    if ($this->dossierIsPublic($this->dossier_id) ||
                        $this->user->hasUserPriviledges($this->session->getUserID(),
                                                        $this->dossier_id)) {
                        $retval = true;
                    }
                    else  {
                        $retval = false;
                    }
                    break;
                case 'PUT':
                    $this->log("enter PUT in prepare statement in dossier.php");
                    //add new item
                    // only access if the user is a editor (or owner)
                    $this->user = new UserManagement($this->dbh);
                    if (!$this->user->hasEditorPriviledges($this->session->getUserID(),$this->dossier_id)){
                        $this->log("the user cannot add item");
                        $retval = false;
                    }
                    break;
                case 'POST':
                    $this->user = new UserManagement($this->dbh);
                    $this->log("enter POST in prepare statement in dossier.php");

                    //or update a dossier item (its metadata like title, description, author, etc.)
                    if ( $this->item_id) {

                        // only access if the user is an editor
                        if (!$this->user->hasEditorPriviledges($this->session->getUserID(),$this->dossier_id)){
                            $this->log("we will return false in post in prepare statement");
                            $retval = false;
                        }

                    }
                    break;
                case 'DELETE':
                    $this->user = new UserManagement($this->dbh);
                    $this->log("enter DELETE in prepare statement in dossier.php");
                    if ( $this->item_id) {
                        // only access if the user is a editor
                        if (!$this->user->hasEditorPriviledges($this->session->getUserID(),$this->dossier_id)){
                            $retval = false;
                        }
                    }
                    else if ( !empty($this->dossier_id) ) {
                        // only access if the user is an owner
                        if (!$this->user->isOwner($this->session->getUserID(),
                                                  $this->dossier_id)){
                            $retval = false;
                        }
                        else {
                            $this->log("user '". $this->session->getUserID(). "'is the owner of dossier no. " . $this->dossier_id);
                        }
                    }
                    else {
                        $retval = false;
                    }
                    break;
                default:
                    //ignore and accept the parent's prepareOperation
                    break;
            }
        }

        if (!$retval) {
            $this->log('session prerequisite failed');
            if (!$this->dossierExists()) {
                $this->not_found();
            }
            else {
                $this->authentication_required();
            }
        }

        return $retval;
    }
}


$service = new DossierService();
// check if the active user is allowed to run the service with the given parameter

// if everything is OK run the actual service
$service->run();

?>

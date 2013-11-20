<?php
require_once('HTTP/Request.php');
require_once('HTTP/Request/Listener.php');
require_once 'MDB2.php';
include 'dbConnect.php';



// get the pdf id 

class HTTPStreamer extends HTTP_Request_Listener
{
    private $fd;
    function update(&$subject, $event, $data = null)
    {    
        switch($event) {
             case 'sentRequest': 
                   error_log('request has been sent');
                   $this->fd = fopen('php://output', 'w');
                   break;
	     case 'gotHeaders':
  		   error_log('got headers');
 		   foreach($data as $n => $v){
 			if ( $n==='content-disposition' ) continue;
 			header($n.': '. $v);
		   } 
 		   break; 
	     case 'tick':
	           error_log('tick');
                   fwrite($this->fd, $data, strlen($data));
		   break;
             case 'gotBody':
                   error_log('data completely loaeded');
                   fclose($this->fd);
                   break;
            default:
                   break;
        }
    }
}

// use the pdf id

// get the id for the specific item from the URL query string $_GET["id"]
	$item_id=$_GET["id"];
	error_log("item id id".$item_id);
// get the JSON data for the id from the database
// 	$query='SELECT metadata FROM library_metadata WHERE id=?';
// 	$statement = $mdb2->prepare($query);
	
// 	$res= $statement->execute($item_id);
		
	$mdb2->setFetchMode(MDB2_FETCHMODE_ASSOC);

 	$sth = $mdb2->prepare('SELECT metadata FROM library_metadata  WHERE digital_library_id=?');
 	 	
 	if (PEAR::isError($sth)) {
 			error_log("pear error " . $sth->getMessage());
 			exit;
 			}
 		
	$res = $sth->execute($item_id);
	
// 	if (PEAR::isError($res)) {
// 		$this->log("pear error " . $res->getMessage());
// 		$this->bad_request();
// 		$sth->free();
// 		return;
// 	}

// 	$idata= array();
	
// 	while ($row=$res->fetchRow()) {
// 		//parse the item meta data 
// 		$row["metadata"] = json_decode($row["metadata"]);
// 		array_push($idata,$row);
// 	}
	
// 	error_log("metadata are ".$idata);
	
// check if this is indeed a pdf item, and them get its identifier and pass it as an argument to the Http_Request

	
$r = new HTTP_Request("http://mercury.ethz.ch/serviceengine/Files/ISN/136414/ipublicationdocument_singledocument/cdb593a6-7909-4cf1-b812-03bbe49405d7/en/IB_ChinasWhitePapersonSpaceAnAnalysis.pdf", array('method'=> "GET"));

$r->attach(new HTTPStreamer());

$r->sendRequest();

?>

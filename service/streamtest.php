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
		
	$mdb2->setFetchMode(MDB2_FETCHMODE_ASSOC);

 	$sth = $mdb2->prepare('SELECT metadata FROM library_metadata  WHERE digital_library_id=?');
 	 	
 	if (PEAR::isError($sth)) {
 			error_log("pear error " . $sth->getMessage());
 			exit;
 			}
 		
	$res = $sth->execute($item_id);
	
	if (PEAR::isError($res)) {
		$this->log("pear error " . $res->getMessage());
		$this->bad_request();
		$sth->free();
		return;
	}

 	$idata= array();


	while ($row=$res->fetchRow()) {
		error_log('row: ' . json_encode($row));
		//parse the item meta data
		$row = json_decode($row["metadata"],true);
		array_push($idata,$row);
	}
	


	// check if this is indeed a pdf item, and them get its identifier and pass it as an argument to the Http_Request

	$type=$idata[0]["type"];
	if ($type=="Publication"){
		error_log("it is indeed a publication");
		$url=$idata[0]["identifier"];
	}

	
$r = new HTTP_Request($url, array('method'=> "GET"));
	
$r->attach(new HTTPStreamer());

$r->sendRequest();

?>

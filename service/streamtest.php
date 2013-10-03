<?php
require_once('HTTP/Request.php');
require_once('HTTP/Request/Listener.php');

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

$r = new HTTP_Request("http://mercury.ethz.ch/serviceengine/Files/ISN/136414/ipublicationdocument_singledocument/cdb593a6-7909-4cf1-b812-03bbe49405d7/en/IB_ChinasWhitePapersonSpaceAnAnalysis.pdf", array('method'=> "GET"));

$r->attach(new HTTPStreamer());

$r->sendRequest();

?>

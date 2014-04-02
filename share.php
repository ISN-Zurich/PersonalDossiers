<?php

// Need to cut apart the request URI
$query = $_SERVER['REQUEST_URI'] ;
$pos = ( strripos ($query, "/") + 1 ) ;
$dossier_id = substr( $query , $pos ) ;

//then build the redirect URL
$body_load_attr = "share('http://lab.isn.ethz.ch/index.html?id=" . $dossier_id . "');" ;

// code to display the following: Title, image, description here
//setting baseURL and query
$baseURL = "http://lab.isn.ethz.ch/service/dossier.php/";
$getDossier = curl_init();

// Set CURL loose
curl_setopt( $getDossier , CURLOPT_URL, $baseURL . $dossier_id ) ;
curl_setopt( $getDossier , CURLOPT_RETURNTRANSFER, 1 ) ;
curl_setopt( $getDossier , CURLOPT_TIMEOUT, '3' ) ;

//grab json
$dossierContent = trim( curl_exec( $getDossier ) ) ;
curl_close( $getDossier ) ;

// parse content
$dossierContent_json = json_decode( $dossierContent , true ) ;

$imageURL = $dossierContent_json['dossier_metadata']['image'] ;
if ( substr( $dossierContent_json['dossier_metadata']['image'] , 0 , 4 ) != 'http' ) {

	$imageURL = 'http://lab.isn.ethz.ch/' . $dossierContent_json['dossier_metadata']['image'] ;
}

?><!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" lang="en">
<head>
<title><?php echo $dossierContent_json['dossier_metadata']['title'] ;?></title>
<meta property="og:title" content="<?php echo htmlentities( $dossierContent_json['dossier_metadata']['title'] ) ;?>"/>
<meta property="og:url" content="<?php echo $_SERVER['REQUEST_URI'] ;?>" />
<meta property="og:image" content="<?php echo $imageURL ;?>" />
<meta property="og:description" content="<?php echo htmlentities( $dossierContent_json['dossier_metadata']['description'] ) ;?>" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-language" content="en-US" />
<script type="text/javascript"><!--

    function share(url) {

        location.replace(url);
    }

--></script>
</head>
<body onload="<?php echo $body_load_attr ?>">
    <div id="contentArea">
    <img src="<?php echo $imageURL ;?>" />
    <h1><?php echo $dossierContent_json['dossier_metadata']['title'] ;?></h1>
    <p><?php echo $dossierContent_json['dossier_metadata']['description'] ;?></p>
    </div>
</body>
</html>
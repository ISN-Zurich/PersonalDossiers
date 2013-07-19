<?php

require_once 'MDB2.php';

//NEW Database connection by using MDB2
$dsn = array(
		'phptype'  => 'mysql',
		'username' => '',
		'password' => '',
		'hostspec' => 'localhost',
		'database' => 'dossier',
);

$options = array(
		'debug'       => 2,
		'portability' => MDB2_PORTABILITY_ALL,
);

// uses MDB2::factory() to create the instance
// and also attempts to connect to the host
$mdb2 =& MDB2::connect($dsn, $options);
if (PEAR::isError($mdb2)) {
	die($mdb2->getMessage());
} else {
	//echo 'Connected Successufly';
}

?>
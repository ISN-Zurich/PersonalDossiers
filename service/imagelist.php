<?php  
require_once 'MDB2.php';

header('content-type: application/json; charset=utf-8');

$dsn = array(
            'phptype'  => 'mysql',
            'username' => 'yasudam',
            'password' => 'E66waQf9rVNDWCpv',
            'hostspec' => 'localhost',
            'database' => 'isn_pictures'
            );
        
$options = array(
            'debug'       => 0,
            'portability' => MDB2_PORTABILITY_ALL,
            );
        
$dbh =& MDB2::connect($dsn, $options);
if (PEAR::isError($dbh)) {
    die($dbh->getMessage());
} 
else {
    //echo 'Connected Successufly';
    $dbh->setCharset('utf8');
}

$pi = $_SERVER['PATH_INFO'];
if (empty($pi)) {
    $pi = "";
}
$pathinfo = explode('/',$pi);
$query    = $_SERVER['QUERY_STRING'];

$page = 0;

if ( count($pathinfo) == 2 && intval($pathinfo[1]) > 0  ) {
   $page = intval($pathinfo[1]) - 1;
}

$limit    = 50;
$offset   = $page * $limit;

$dbh->setFetchMode(MDB2_FETCHMODE_ASSOC);

$sqlquery = 'SELECT * FROM image ORDER BY modifiedTS LIMIT ?, ?';

$sqlparam = array($offset, $limit);
if (!empty($query)) {
    // FIXME: proper index table for keywords

    $sqlquery = 'SELECT DISTINCT i.* FROM image i, image_keyword ik WHERE i.imageID = ik.imageID AND (LOWER(ik.keyword) like LOWER(?) OR LOWER(i.objectData) LIKE LOWER(?)) ORDER BY i.modifiedTS LIMIT ?, ?';
    $lq = '%'.$query.'%';
    $sqlparam = array($lq,$lq,$offset, $limit);
}

$message = '';
$sth = $dbh->prepare($sqlquery);
$res = $sth->execute($sqlparam);
if (PEAR::isError($res)) {
    $message =  $res->getMessage();
}

$bItem = $res->numRows();
$idata= array();
while ($row=$res->fetchRow()) {
    //parse the item meta data first
    $row["objectdata"] = json_decode($row["objectdata"]);
    array_push($idata,$row);
}

$sth->free();

$data = array(
    'count' => $bItem,
    'page' => $page,
    'query' => $query,
    'images'=>$idata
);

echo(json_encode($data));

?>

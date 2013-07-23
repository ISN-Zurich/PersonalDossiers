<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="stylesheet" type="text/css" href="style/gallery.css" />
    <link type="text/css" href="style/personaldossier.css" rel="stylesheet">

    <script type="text/javascript" src="libs/jquery.js"></script>
    <script type="text/javascript" src="libs/sha1.js"></script>
    <script type="text/javascript" src="libs/oauth.js"></script>

    <script type="text/javascript" src="scripts/common.js"></script>

    <script type="text/javascript" src="scripts/models/oauthhelper.js"></script>
    
    <script type="text/javascript" src="scripts/models/userModel.js"></script>
    <script type="text/javascript" src="scripts/models/bookmarkModel.js"></script>
    <script type="text/javascript" src="scripts/models/dossierListModel.js"></script>

    <script type="text/javascript" src="scripts/views/addImage.js"></script>
    
    <script type="text/javascript" src="scripts/controllers/galleryController.js"></script>
</head>

<body>

<?php
   $i = 0;
   foreach (new DirectoryIterator('gallery') as $file) {
      if (! $file->isDot() && $file->isFile()  ) {
         $m = preg_match( '/\.jpg/', $file->getFilename() );

         if ( $m ) {
$i++;
echo('<div id="prnt'.$i.'" class="pictureContainer">');
echo('<img id="imgx'. $i . '" src="gallery/'. $file->getFilename() .'"/>');
echo('<span  id="span' . $i .'" class="pictureSelect">choose this picture</span>');
echo('</div>');
         }
      }
   }
?>

</body>

</html>

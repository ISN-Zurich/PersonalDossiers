<!--  This page will be shared with social media platforms that dont understand how to render the javascript (facebook for start) -->

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" >
        <meta http-equiv="Pragma" content="no-cache" />

        <!-- Inclusion of dossiers-project javascript files -->

        <script type="text/javascript" src="libs/jquery.js"></script>
        <script type="text/javascript" src="libs/jquery-ui.js"></script>
        <script type="text/javascript" src="libs/sha1.js"></script>
        <script type="text/javascript" src="libs/oauth.js"></script>

        <script type="text/javascript" src="scripts/isnlogger.js"></script>
        <script type="text/javascript" src="scripts/common.js"></script>

        <script type="text/javascript" src="scripts/models/oauthhelper.js"></script>
        <script type="text/javascript" src="scripts/models/authentication.js"></script>
        <script type="text/javascript" src="scripts/models/dossierListModel.js"></script>
        <script type="text/javascript" src="scripts/models/bookmarkModel.js"></script>
        <script type="text/javascript" src="scripts/models/userModel.js"></script>

<!--
        <script type="text/javascript" src="scripts/views/logView.js"></script>
        <script type="text/javascript" src="scripts/views/shareButtonView.js"></script>
        <script type="text/javascript" src="scripts/views/dossierUsersView.js"></script>
        <script type="text/javascript" src="scripts/views/addEmbedButton.js"></script>
-->

        <script type="text/javascript" src="scripts/views/dossierBannerView.js"></script>
        <script type="text/javascript" src="scripts/views/dossierContentView.js"></script>
        <script type="text/javascript" src="scripts/views/detailedEmbedView.js"></script>
        <script type="text/javascript" src="scripts/controllers/embedController.js"></script>
        <script type="text/javascript" src="scripts/main.js"></script>

        <title>ISN Personal Dossiers</title>

        <meta http-equiv="X-UA-Compatible" content="IE=edge" >
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="Content-language" content="en-US" />
        <meta name="MSSmartTagsPreventParsing" content="TRUE" />

        <link type="text/css" href="http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/screen.css" rel="stylesheet"/>
        <link type="text/css" href="http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/footer.1.0.css" rel="stylesheet"/>
        <link type="text/css" href="style/personaldossier.css" rel="stylesheet"/>
        <link type="text/css" href="style/developmentScratch.css" rel="stylesheet"/>
        <link href="libs/icomoon/style.css" rel="stylesheet" type="text/css">
        
        <script type="text/javascript">
            <!--
            function share(url) {
                location.replace(url); 
            }
            
            -->
        </script>

    </head>
    <?php 
        // Need to cut apart the request URI, then build the redirect URL
        $qury =$_SERVER['REQUEST_URI'];
        $pos = strripos ($qury, "/");
        $pos++;
        $urlParam = "?id=".substr($qury,$pos);
        echo "<body onload=share('http://lab.isn.ethz.ch/".$urlParam."')>";
    ?>
        
        <div class="pd_embed pd_details">
            <!-- ISN LOGO -->
            <div id="pd_footer_gen"></div>
            <div id="dossiercontentHeader" class="pd_sidebar-header darkblue">ISN Personal Dossiers</div>

            <!-- Content Area -->
            <div id="content" class="">
                <div class="entry" id="bannerArea">
                    <div class="wp-caption alignnone" style="width: 480px">
                        <div id="header_image">
                            <img id="bannerImage" class="" alt="">
                        </div>
                    </div>
                </div>
                <div id="contentArea" class="pd_overflow">
                    <?php
                        // code to display the following: Title, image, description here

                        //setting baseURL and query
                        $qry_str = substr($qury,$pos);
                        $baseURL = "http://lab.isn.ethz.ch/service/dossier.php";
                        $getDossier = curl_init();

                        // Set CURL loose
                        curl_setopt($getDossier, CURLOPT_URL, $baseURL . $qry_str); 
                        curl_setopt($getDossier, CURLOPT_RETURNTRANSFER, 1);
                        curl_setopt($getDossier, CURLOPT_TIMEOUT, '3');
                        $dossierContent = trim(curl_exec($getDossier));
                        curl_close($getDossier);

                        // handle content, spit it out
                        $dossierContent_json =json_decode($dossierContent,true);
                        $dossierPicture =  $dossierContent_json['dossier_metadata'][image];
                        echo "<img src=http://lab.isn.ethz.ch/".$dossierPicture." />";
                        echo  "<h1>".$dossierContent_json['dossier_metadata'][title]."</h1>";
                        echo  "<p>".$dossierContent_json['dossier_metadata'][description]."</p>";                      
                        ?>
                </div>
            </div>

            <!-- details block -->
            <div id="pd_embed_details" class="hide">
                <div id="pd_embed_details_metadata">
                </div>
                <div id="contentFrame">
                </div>
            </div>
        </div>
    </body>
</html>

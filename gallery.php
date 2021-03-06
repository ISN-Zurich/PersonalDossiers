<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="MSSmartTagsPreventParsing" content="TRUE" />

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-language" content="en-US" />

    <meta http-equiv="Pragma" content="no-cache" />

    <meta name="copyright" content="&amp;copy; Copyright (c) International Relations and Security Network (ISN), ETH Zürich" />

    <title>Personal Dossiers in ISN</title>
    <link rel="Shortcut icon" href="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/favicon.ico" type="image/x-icon" />

    <link type="text/css" href="http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/screen.css" rel="stylesheet" media="screen" />

    <style type="text/css">
        @import url("http://www.isn.ethz.ch/extension/kmscomments/design/kmscomments/stylesheets/kmscomments.css");
        @import url("http://www.isn.ethz.ch/extension/kmssearch/design/kmssearch/stylesheets/kmssearch.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/slider.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/digilib.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/staff.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/ddmenu.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/sectioned_article.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/jobs.1.0.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/video_overlay.1.0.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/footer.1.0.css");
        @import url("http://www.isn.ethz.ch/extension/isndesign/design/isn/stylesheets/search_banner.1.1.css");
    </style>

    <!-- Personal Dossiers Artwork -->
    <link href="libs/icomoon/style.css" rel="stylesheet" type="text/css">

    <!-- Personal Dossiers special styles -->
    <link type="text/css" href="style/personaldossier.css" rel="stylesheet" />
    <link type="text/css" href="style/developmentScratch.css" rel="stylesheet" />

    <!-- personal dossiers front end logic files -->
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

    <script type="text/javascript" src="scripts/views/logView.js"></script>
    <script type="text/javascript" src="scripts/views/shareButtonView.js"></script>

    <script type="text/javascript" src="scripts/views/dossierUsersView.js"></script>
    <script type="text/javascript" src="scripts/views/addEmbedButton.js"></script>
    <script type="text/javascript" src="scripts/views/dossierBannerView.js"></script>
    <script type="text/javascript" src="scripts/views/dossierContentView.js"></script>
    <script type="text/javascript" src="scripts/views/invitationView.js"></script>

    <script type="text/javascript" src="scripts/controllers/dossierController.js"></script>
    <script type="text/javascript" src="scripts/controllers/galleryController.js"></script>
    <script type="text/javascript" src="scripts/main.js"></script>
</head>

<body>
<div id="page_oc">
    <div class="container">
        <div class="printhidden">
            <div class="column span-5"><a href="/"><img src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/header/20y/logo_isn.gif" alt="Logo ISN" class="logo_isn" width="147" height="59" /></a></div>
            <div class="column span-13">&nbsp;</div>
            <div class="column span-6 last"><a href="http://www.ethz.ch/index_EN"><img src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/header/logo_eth.gif" alt="Logo ETH Z&uuml;rich" class="logo_eth" width="196" height="61" /></a></div>
            <div class="column span-24 last"><img src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/header/20y/20y_header.gif" alt="The International Relations and Security Network / Dedicated Service since 1994" width="950" height="50" /></div>
            <div class="column span-24" id="headernavi">
                <ul class="headerlinks">
                    <li><a href="http://www.isn.ethz.ch/">Home</a></li>
                    <li><a href="http://www.isn.ethz.ch/Services/Contact">Contact</a></li>
                    <li><a href="http://www.isn.ethz.ch/About-Us/Who-we-are">About Us</a></li>
                    <li><a href="http://www.isn.ethz.ch/Services/Newsletters">Newsletters</a></li>
                </ul>
            </div><!-- id="headernavi" -->

            <div class="column span-24 floatleft" style="border:solid 1px white;border-width:1px 0px;"><img src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/header/header.jpg" alt="Slogan: Managing Information - sharing knowledge" class="column span-24 floatleft" /></div>

            <div class="column span-24"><a name="navi"></a>
                <div id="dd_menu_outer_container" class="nojs">
                    <ul id="dd_menu_container">
                        <li class="dd_menu_item">
                            <div class="dd_menu_item_text_container"><a class="dd_menu_item_text" href="http://www.isn.ethz.ch/Dossiers">Dossiers</a></div>
                            <ul class="dd_menu_subcontainer">
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Dossiers">Issues / Regions</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://lab.isn.ethz.ch/">Your Dossiers</a></div></li>
                            </ul>
                        </li>
                        <li class="dd_menu_item">
                            <div class="dd_menu_item_text_container"><a class="dd_menu_item_text" href="http://www.isn.ethz.ch/Security-Watch/Articles">Security Watch</a></div>
                            <ul class="dd_menu_subcontainer">
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Security-Watch/Articles/List">View all Articles</a></div></li>
                            </ul>
                        </li>
                        <li class="dd_menu_item">
                            <div class="dd_menu_item_text_container"><a class="dd_menu_item_text" href="http://isnblog.ethz.ch">ISN Blog</a></div>
                            <ul class="dd_menu_subcontainer">
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://isnblog.ethz.ch/week/our-perspectives">Our Perspectives</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://isnblog.ethz.ch/week/global-views">Global Views</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://isnblog.ethz.ch/week/partner-insights">Partner Insights</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://isnblog.ethz.ch/week/expert-opinion">Expert Opinion</a></div></li>
                            </ul>
                        </li>
                        <li class="dd_menu_item">
                            <div class="dd_menu_item_text_container"><a class="dd_menu_item_text" href="http://www.isn.ethz.ch/Digital-Library/Overview">Digital Library</a></div>
                            <ul class="dd_menu_subcontainer">
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Digital-Library/Publications">Publications</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Digital-Library/Articles">Articles</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Digital-Library/Audio">Audio</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Digital-Library/Video">Video</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Digital-Library/Organizations">Organizations</a></div></li>
                            </ul>
                        </li>
                        <li class="dd_menu_item dd_menu_item_cap">
                            <div class="dd_menu_item_text_container"><a class="dd_menu_item_text" href="http://www.isn.ethz.ch/Communities-and-Partners/Partner-Network">Communities and Partners</a></div>
                            <ul class="dd_menu_subcontainer">
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Communities-and-Partners/Partner-News">Partner News</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Communities-and-Partners/ISN-CSS-Events">ISN / CSS Events</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Communities-and-Partners/Related-Programs">Related Programs</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/Communities-and-Partners/Expert-Communities">Expert Communities</a></div></li>
                            </ul>
                        </li>
                        <li class="dd_menu_item dd_menu_item_edu">
                            <div class="dd_menu_item_text_container"><a class="dd_menu_item_text" href="http://www.isn.ethz.ch/e-Education/ISN-ADL-Support">e-Education</a></div>
                            <ul class="dd_menu_subcontainer">
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/e-Education/Learning-Platform">Learning Platform</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/e-Education/Mobile-Learning-Research">Mobile Learning / Research</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/e-Education/Available-Resources">Available Resources</a></div></li>
                                <li class="dd_menu_subitem"><div class="dd_menu_subitem_text_container"><a class="dd_menu_subitem_text" href="http://www.isn.ethz.ch/e-Education/ISN-Mobler-Cards">ISN Mobler Cards</a></div></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <hr class="row_white" />
        </div>

        <div class="column span-6" id="sidebar_left">
            <div class="column span-6 search_banner_section">
                <a class="grey_bar_btn bi more" href="http://www.isn.ethz.ch/Browse-Information">Browse Information <img src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/search_banner/browse_info.png" /></a> <a class="grey_bar_btn as more" href="http://www.isn.ethz.ch/kmssearch/search/adv">Advanced Search <img src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/search_banner/adv_search.png" /></a>
            </div>
            <div class="clearboth"></div>
        </div>
        <!-- id="sidebar_left" -->

        <div class="column span-12 search_banner_section">
            <form method="post" action="http://www.isn.ethz.ch/kmssearch/search/simpleall" id="search_form">
                <input type="hidden" name="stage" value="search" /> <input type="hidden" value="Dossiers" name="red" /> <input type="hidden" value="en" name="l" /> <input type="hidden" value="standard" name="t" /> <input type="hidden" value="0" name="start" /> <input type="hidden" value="20" name="num" /> <input type="hidden"value="77233387-374f-4688-9a93-ed530a1b91ae" name="c" /> <input type="text" id="search_bar_text" value="Type your search here..." class="" name="q" /> <input type="submit" id="search_bar_submit" class="search_bar_button" value="Search" name="search" />
                <div id="search_bar_select_pointer">Search within the section</div>
                <div id="search_bar_select_container">
                    <select id="search_bar_select" name="ot">
                        <option value="">The ISN</option>
                        <option value="0c54e3b3-1e9c-be1e-2c24-a6a8c7060233">Publications</option>
                        <option value="26b029ba-8af6-464b-898a-d16dd7d15a02" selected="selected">Dossiers</option>
                        <option value="4888caa0-b3db-1461-98b9-e20e7b9c13d4">Articles</option>
                        <option value="40db1b50-7439-887d-706e-8ec00590bdb9">Audio</option>
                        <option value="966c9813-6e74-4e0b-b884-8ed9f3f0978c">Videos</option>
                        <option value="61995759-76d5-4913-aefc-68711537abb5">Special Features</option>
                        <option value="cab359a3-9328-19cc-a1d2-8023e646b22c">IR Directory</option>
                        <option value="3c7cd8ea-376b-af5b-2388-393bc970da60">Blog Posts</option>
                    </select>
                </div>
                <a class="search_bar_button" id="search_bar_help" href="http://www.isn.ethz.ch/isn/Services/Search-help">Help?</a>
            </form>
        </div>
        <div class="column span-6 last search_banner_section">
            <div class="grey_bar st">Share this <a href="https://plus.google.com/share?url=http://isn.ethz.ch/Dossiers" class="sb_icon" id="st_googleplus" title="Share on Google Plus" target="_blank"><span class="hide">Share on Google Plus</span></a><a href="http://reddit.com/submit?url=http://isn.ethz.ch/Dossiers" class="sb_icon" id="st_reddit" title="Submit to Reddit" target="_blank"><span class="hide">Submit to Reddit</span></a><a href="http://twitter.com/home/?status=http://isn.ethz.ch/Dossiers" class="sb_icon" id="st_twitter" title="Tweet about this" target="_blank"><span class="hide">Tweet about this</span></a><a href="https://www.facebook.com/sharer.php?u=http://isn.ethz.ch/Dossiers" class="sb_icon" id="st_facebook" title="Share on Facebook" target="_blank"><span class="hide">Share on Facebook</span></a></div>
            <div class="grey_bar in">Interact <a href="http://www.isn.ethz.ch#comments" class="sb_icon disabled" id="in_comment" title="Comments [disabled]"><span class="hide">Comment</span></a><a href="http://www.isn.ethz.ch/layout/set/print/content/view/full/24140" class="sb_icon" id="in_print" title="Print"><span class="hide">Print</span></a><a href="http://pdfcreate.ethz.ch" class="sb_icon" id="in_pdf" title="PDF"><span class="hide">PDF</span></a><a href="http://www.isn.ethz.ch/content/tipafriend/24140" class="sb_icon" id="in_mail" title="Mail"><span class="hide">Mail</span></a></div>
        </div>

        <div class="column span-12" id="">
            <div class="entry">
                <div id="dossiercontentHeader" class="sidebar-header darkblue">My Dossier</div>
                <div class="wp-caption alignnone" style="width: 480px">
                    <div id="header_image"><img id="bannerImage" class=" " alt=""></div>
                </div>
            </div>

            <div id="contentArea" class="span-12">
                <div id="noContent" class="hide">

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
                </div>
            </div>
        </div><!-- id="content" -->

        <div class="column span-6 last" id="sidebar_right">
            <div id="InteractionBar" class="pd_grey_bar st">
                <span class="pd_boxTitle">My Account</span>
                <a href="user.html#notifications" class="sb_icon pd_tabs_margin pd_interactionItem disable" id="st_notifications" title="Notifications" target=""><span id="span_notifications" class="pd_active iconMoon">N</span></a>
                <a href="user.html#userProfile" class="sb_icon pd_tabs_margin pd_interactionItem disable" id="st_user" title="Your Profile" target=""><span id="span_user" class="pd_active iconMoon">T</span></a>
                <a href="user.html#personalDossiers" class="sb_icon pd_tabs_margin pd_interactionItem clickable" id="st_dossiers" title="Your Dossiers" target=""><span id="span_dossiers" class="pd_active iconMoon">D</span></a>
                <a class="pd_sb_icon pd_tabs_margin pd_a_selected clickable" id="logView" title="Logout"><span id="st_log_out" class="pd_active iconMoon">L</span></a>
            </div><!-- id="InteractionBar" -->

            <div id="st_logout_confirm" class="box snippetlist hide">
                <div class="pd-snippetlist-content sidebar-header darkblue">
                    <div class="about_section_desc">
                        <ul>
                            <li class="pd_loginContainer"><div id="confirmationMsg" class="pd_loginContainer clickable">Click here to log out</div></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div id="dossierOwners" class="userlist hide">
                <div class="sidebar-header darkblue">Owners</div>
                <div class="snippetlist-content first greyBg">
                    <div class="about_section_desc">
                        <div id="pd_udossierOwners"></div>
                    </div>
                </div>
            </div>

            <div id="dossierEditors" class="userlist hide">
                <div class="sidebar-header darkblue">Editors</div>
                <div class="snippetlist-content first greyBg">
                    <div class="about_section_desc">
                        <div id="pd_udossierEditors"></div>
                    </div>
                </div>
            </div>

            <div id="dossierUsers" class="userlist hide">
                <div class="sidebar-header darkblue">Users</div>
                <div class="snippetlist-content first greyBg">
                    <div class="about_section_desc">
                        <div id="pd_udossierUsers"></div>
                    </div>
                </div>
            </div>

            <div id="editDossier" class="clickable pd_editDossier hide">
                <div class="grey_bar st clickable">Edit Dossier<span class="st_editDosser iconMoon">E</span></div>
            </div>

            <div id="lock-editDossier" class="clickable pd_editDossier hide">
                <div class="grey_bar st clickable">Lock Edit</div>
            </div>

            <div id="embedView">
                <div id="addEmbedBtn" class="clickable pd_editDossier">
                    <div class="grey_bar st clickable">Embed Dossier<span class="st_editDosser iconMoon">B</span></div>
                </div>
                <div id="dropdown_embed" class="hide">
                    <input id="inputContainer" type="text" />
                    <div id="drop_info" >Click on the code area and press Ctr+C to copy</div>
                    <!-- <div id="embed_options" class="">Options</div> -->
                    <div id="embedButtons" class="embedButtonsContainer">
                        <div id="contentEmbed" value="ContentEmbed" class="pd_embed_buttons pd_activeBadge clickable">Content Style</div>
                        <div id="badgeStyle" value="BadgeEmbed" class="pd_embed_buttons clickable">Badge</div>
                    </div>
                </div>
            </div>

            <div id="invitationView" class="hide">
                <input type="text" id="pd_invite_bar_text" value="Invite others..." name="q">
                <div id="sendInvitation" class="roleSeparatorUnselected clickable">Send</div>
            </div>
            <div class="clearboth"></div>
        </div><!-- id="container" -->
    </div>

    <div id="footer_gen">
        <div id="footer_links">
            <div id="footer_links_ic">
                <ul>
                    <li><a href="http://www.css.ethz.ch/index_EN">CSS</a></li>
                    <li><a href="http://www.isn.ethz.ch/content/view/sitemap/2">Sitemap</a></li>
                    <li><a href="http://www.isn.ethz.ch/content/view/full/3520">FAQs</a></li>
                    <li><a href="http://www.isn.ethz.ch/Services/Get-Involved">Get Involved</a></li>
                    <li><a href="http://www.isn.ethz.ch/Services/Disclaimer">Disclaimer</a></li>
                    <li><a href="http://www.isn.ethz.ch/Services/Privacy-Policy">Privacy Policy</a></li>
                </ul>
            </div><!-- id="footer_links_ic" -->
        </div><!-- id="footer_links" -->
        <div id="footer_oc">
            <div id="footer_ic">
                <div class="column span-6">
                    <div class="footer_title">Contact the ISN</div>
                    <div class="footer_text">International Relations and<br />
                        Security Network (ISN)<br />
                        ETH Zurich<br />
                        Leonhardshalde 21, LEH<br />
                        8092 Zurich, Switzerland<br />
                        <br />
                        Tel: +41 44 632 07 57 / 40 25<br />
                        <br />
                        <a class="footer_link" href="http://www.isn.ethz.ch/Users/ISN/DL/ISN">Send us an email</a>
                    </div>
                </div>
                <div class="column span-6">
                    <div class="footer_title">Sitemap</div>
                    <div class="footer_text">
                        <ul id="http://www.isn.ethz.chfooter_list">
                            <li><a class="footer_link" href="http://www.isn.ethz.ch/Dossiers">Dossiers</a></li>
                            <li><a class="footer_link" href="http://www.isn.ethz.ch/Browse-Information">Browse Information</a></li>
                            <li><a class="footer_link" href="http://www.isn.ethz.ch/Security-Watch/Articles">Security Watch</a></li>
                            <li><a class="footer_link" href="http://www.isn.ethz.ch/Communities-and-Partners/Partner-Network">Communities and Partners</a></li>
                            <li><a class="footer_link" href="http://www.isn.ethz.ch/Digital-Library/Overview">Digital Library</a></li>
                            <li><a class="footer_link" href="http://www.isn.ethz.ch/About-Us/Who-we-are">About Us</a></li>
                            <li><a class="footer_link" href="http://www.isn.ethz.ch/e-Education/The-ISN-TACC">e-Education</a></li>
                        </ul>
                    </div>
                </div>
                <div class="column span-6">
                    <div class="footer_title">Newsletters</div>
                    <div class="footer_text"><a class="footer_link" href="http://www.isn.ethz.ch/Services/Newsletters">Sign up here</a></div>
                    <div class="footer_title">Partner Network</div>
                    <div class="footer_text"><a class="footer_link" href="http://www.isn.ethz.ch/Communities-and-Partners/Partner-Network">Become apartner</a></div>
                </div>
                <div class="column span-6 last">
                    <div class="footer_title">Follow us</div>
                    <div class="footer_text">
                        <a class="follow_icon_link" href="http://www.facebook.com/pages/International-Relations-and-Security-Network-ISN/141505796320"><img class="follow_icon" src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/footer/facebook.png" /></a>
                        <a class="follow_icon_link" href="http://www.twitter.com/ISN_Zurich"><img class="follow_icon" src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/footer/twitter.png" /></a>
                        <a class="follow_icon_link" href="http://plus.google.com/103191959462754817639"><img class="follow_icon" src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/footer/googleplus.png" /></a>
                        <a class="follow_icon_link" href="http://www.linkedin.com/company/international-relations-and-security-network-isn"><img class="follow_icon" src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/footer/linkedin.png" /></a>
                        <a class="follow_icon_link" href="http://www.youtube.com/user/isnzurich"><img class="follow_icon" src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/footer/youtube.png" /></a>
                        <a class="follow_icon_link" href="http://www.isn.ethz.ch/Services/ISN-RSS-feeds"><img class="follow_icon" src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/footer/rss.png" /></a>
                    </div>
                    <div class="clearboth"></div>
                    <div class="footer_title">Parent Organizations</div>
                    <div class="footer_text"><a id="footer_css_logo" href="http://www.css.ethz.ch"><img src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/footer/css.png" /></a><a id="footer_eth_logo" href="http://www.ethz.ch"><img src="http://www.isn.ethz.ch/extension/isndesign/design/isn/images/icons/footer/ethz.png" /></a></div>
                </div>
            </div>
        </div>
    </div><!-- id="footer_gen" -->
</div><!-- id="page_oc" -->
</body>
</html>

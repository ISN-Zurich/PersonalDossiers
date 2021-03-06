/*jslint vars: true, sloppy: true */
function bookmarkView( controller ) {

    var self = this;
    self.controller = controller;
    self.tagID = "bookmarkList";
    self.libBookmarkModel = self.controller.models.bookmarkDossier;

    //will move the binding of the dossier list update to the librarybookmark model
    // it will load the bookmarkedossiers, and when this is ready, the bookmark view will open
    $(document).bind('BookmarkedDossierListUpdate', function(){

        ISNLogger.log( "bound bookmarked dossier list update in bookmark view" );
        self.open();
    });


    $("#bookmarkList").bind("click", function( e ) {

        var targetE = e.target.nodeName;
        ISNLogger.log( "target clicked " + targetE );
        if ( $(targetE) ) {

            var targetID = e.target.id;
            ISNLogger.log( "targetID is " + targetID );
            var dossierID = targetID.substring(4);
            ISNLogger.log( "dossier ID is " + dossierID );

            //check the class of our clicked element, if it's not the icon we want to redirect to the dossier
            //if it's the bookmark icon we want to continue and add the bookmark to the appropriate dossier
            if ( targetID.substring(0,4) === 'icon' ) {

                //disable the element from being clickable while we wait for a result
                //done in the model!? what was I thinking?
                //refactor it into here at some point!

                //check whether the item already exists in the dossier
                if ( self.libBookmarkModel.hasItem( dossierID ) ) {

                    //exists, call to remove the item from a dossier
                    self.libBookmarkModel.removeItem( dossierID );
                } else {

                    //does not exist, call to add item to a dossier
                    self.libBookmarkModel.addItem( dossierID );
                }
            } else {

                //we are not in the icon... redirect to the dossier view!
                top.location.href = "http://lab.isn.ethz.ch/index.html?id=" + dossierID ;
            }
        }
    });
}



bookmarkView.prototype.openDiv = openView;



bookmarkView.prototype.open = function(){

    this.update();
    this.openDiv();
};



bookmarkView.prototype.update = function(){

    var self = this;
    var dossierListModel = self.controller.models.dossierList;

    $("#bookmarkList").empty();

    if ( dossierListModel.listIsPresent() ) {

        dossierListModel.reset();
        dossierId = dossierListModel.getDossierId();

        do {
            this.renderDossier();
        } while ( dossierListModel.nextDossier() );

        ISNLogger.log( "passed the design of the bookmarks list" );
        var height = $("#bookmarkContainer").outerHeight();
        ISNLogger.log( "height of bookmark container is " + height );
        this.controller.notifyNewHeight( height );
    }
};



bookmarkView.prototype.renderDossier = function(){

    ISNLogger.log("enter render Dossier");

    var libraryBookmarkModel = self.controller.models.bookmarkDossier;
    var dossierListModel = self.controller.models.dossierList;
    var dossierID = self.controller.models.dossierList.getDossierId();
    var isFollowedDossier = dossierListModel.isFollowedDossier();
    var library_id = self.controller.library_item_id;

    ISNLogger.log( "dossier id in render dossier is" + dossierID );
    ISNLogger.log( "library id is " + library_id );

    if ( !isFollowedDossier ) {

        ISNLogger.log( "is not a following dossier, passed design" );

        var div1 = $("<div/>", {
            //"id": "item"+dossierID,
            "class" : "clickable pd_editDossier bookmarkItem"
        }).appendTo( "#bookmarkList" );

        var div2 = $("<div/>", {
            "id" : "item" + dossierID,
            "class" : "st clickable overflowText grey_bar pd_clearfloat"
        }).appendTo( div1 );

        $("<span/>", {
            "id" : "ittl" + dossierID,
            'class': 'pd_dossiertext',
            'text': self.controller.models.dossierList.getDossierTitle()
        } ).appendTo(div2);

        $("<span/>", {
            "id" : "icon" + dossierID,
            "class" : libraryBookmarkModel.hasItem( dossierID ) ? "st_editDosser pd_bookmark_icon_exist iconMoon" : "st_editDosser pd_bookmark_icon iconMoon",
            "text" : "K"
        }).appendTo( div2 );
    }
};



bookmarkView.prototype.closeDiv = function(){};



bookmarkView.prototype.close = function(){

    this.closeDiv();
};
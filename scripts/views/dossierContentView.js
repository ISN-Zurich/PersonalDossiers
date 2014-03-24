/***
 * Design the overview page of the dossier.

 * This contains the list of the items of the dossier (publication, audio, video, articles)
 * */

/*jslint vars: true, sloppy: true */

/**
 * TODO: Documentation
 */
function DossierContentView( dController ) {
    var self = this;
    self.controller = dController;
    self.tagID = 'contentArea';
    self.deleteMode = 0;
     
    self.embed = (self.controller.id && self.controller.id.length && (self.controller.id === 'badgeController' || self.controller.id === 'detailembedController'));
    
    $(document).bind("click", globalClickHandler );
     
    /**
     * @function globalClickHandler(event)
     * 
     * The globalClickHandler() is responbile to respond to user interactions 
     * in the dynamic parts of the interface in order to improve the responsiveness of the 
     * UI.
     */
    function globalClickHandler( e ) {
         
        var targetE = e.target;
        var targetID = targetE.id;
        
        if ( !self.embed && $(targetE).hasClass("deleteButton") ) {

            self.deleteMode = true;
            var myID = targetID.substring( 7 );
            self.deleteMode = myID;
            $(targetE).hide();
            $("#delete-confirm-" + myID).show();
            e.stopPropagation();
        } 
        else if ( !self.embed && $(targetE).hasClass("deleteConfirmButton") ) {
            // get rid of the element
            var myIDf = targetID.substring( 15 );
            self.removeItem(myIDf);
            self.deleteMode = 0;
            e.stopPropagation();
        }
        else if ( self.embed && targetID.indexOf('embeditem') === 0 ) {
            // this opens the detailed view for the embedded item
            var id = targetID.substring( 9 );
            if ( id > 0 ) {
                // open view
                self.controller.models.bookmark.setIndexToItemId(id);
                self.controller.openDetails();
                e.preventDefault();
            }
        }
    }
     
    $(window).bind("click", function(){
        // rescue click to cancel a delete request
        self.rescueFromDelete();
    });

    $(window).bind('keydown', function( e ) {
        //keyCode 27 = escape
        if ( e.keyCode === 27 ) {
            self.rescueFromDelete();
        }
    });

    
    $("#pd_footer_gen").bind("click", function() {
        window.open( baseURL() + 'index.html' , '_blank' );
    });

    $('#editDossier').bind('click', function() {
        if( !self.embed ) {
            var userType = self.controller.models.dossierList.getUserType();
            ISNLogger.log( 'user type in dossier content view is ' + userType );
            if ( userType !== "user" ) {

                // 2. enable sortability
                self.activateSorting();

                // 3. show delete button
                if ( self.controller.oauth ) {

                    $('.deletecontainer').show();
                }
            }
        }
    });

    $('#lock-editDossier').bind('click', function(){
        if ( !self.embed ) {
            // 1. store the positioning of the items
            self.storeOrder();

            // 2. send the new positions to the server
            self.controller.models.bookmark.arrangeItems();

            // 3. remove the sortability from the list
            $('#sortable').sortable('disable');

            // 5. remove the delete button
            $('.deletecontainer').hide();
        }
    });
} //end of constructor

/**
 * opens the view
 * @prototype
 * @function openDiv
 **/
DossierContentView.prototype.openDiv = openView;

/**
 * closes the view
 * @prototype
 * @function closeDiv
 **/
DossierContentView.prototype.closeDiv = closeView;

/**
 * TODO: Documentation
 */
DossierContentView.prototype.open = function() {
	if( this.controller.models['bookmark'].dossierForbidden ) {
        // make sure that people can access only dossier that are indeed public
        $('#privateDossier').show();    
    }
    else {
        this.update();
    }
	this.openDiv();
};

/**
 * @method rescueFromDelete()
 * 
 * This function resets the delete status when a user decides that 
 * an entry should not get deleted from a dossier.
 */
DossierContentView.prototype.rescueFromDelete = function (){
    if ( !this.embed && this.deleteMode > 0 ) {
        $('#delete-confirm-' + this.deleteMode).hide();
        $('#delete-' + this.deleteMode).show();
        this.deleteMode = 0;
    } 
};
     
/**
 * TODO: Documentation
 */
DossierContentView.prototype.update = function(){

    $("#contentArea").empty();

    //TODO: only if we are loggedIn to display the logout button
    if ( this.controller.oauth ) {
        $("#delete").removeClass("hidden");
        $('#findinformation').removeClass("hidden");
        $('#shareButton').removeClass("hidden");
    }
    if ( this.controller.hashed ) {

        $('#loginButtonLink').removeClass("hidden");
    }
    ISNLogger.log( 'open dossier list view' );
    this.renderList();
};

/**
 * TODO: Documentation
 */
DossierContentView.prototype.renderList = function(){

    var iFrameHeight = window.innerHeight || document.documentElement.clientHeight;
    var bookmarkModel = this.controller.models.bookmark;
    ISNLogger.log( 'dossier list length in dossier content view ' + bookmarkModel.dossierList.length );

    if ( bookmarkModel.dossierList && bookmarkModel.dossierList.length > 0 ) {

        var divContainer = $("<ul/>", {
            "id" : "sortable",
        }).appendTo("#contentArea");
        ISNLogger.log( 'dossier list index is ' + bookmarkModel.index );
        bookmarkModel.firstItem();
        do {
            this.renderItem();
        } 
        while ( bookmarkModel.nextItem() );
    } 
    else {

        //if the specific dossier has no dossier items
        ISNLogger.log( 'the dossier has no dossier items' );
        var div = $("<div/>", {
            "id" : "noContent"
        }).appendTo("#contentArea");
        
        // FIXME: language code should not be hardcoded.
        var p = $("<p/>", {
            "text" : "Your Dossier has no items. You can add items  to the personal dossier if you go to http://isn.ethz.ch/. In there, under both the dossiers and the digital library menus there are various content items. If you enter in the ones you are interested in you will see an addBookmark button on the right side. By clicking on it, this item will be added to your active dossier"
        }).appendTo(div);
    }

    if ( this.embed ) {

        var bannerHeight = $("#bannerArea").outerHeight();
        var footerHeight = $("#pd_footer_gen").outerHeight();
        var footerHeight = $("#pd_footer_gen").height() + $("#dossiercontentHeader").height();
        var totalHeight = bannerHeight + footerHeight ; // we add 176 px for the image that might be still on its way
        var contentAreaHeight = iFrameHeight - totalHeight;
        $("#contentArea").css( "height" , contentAreaHeight + "px" );
    }
    // self.activateSorting();
};

/**
 * TODO: Documentation
 */
DossierContentView.prototype.activateSorting = function(){
    var self = this;
    ISNLogger.log( 'enter activateSorting' );
    $('#sortable').sortable("enable");

    //make the list sortable
    $('#sortable').sortable({

        placeholder : "placeholder",
        forcePlaceholderSize : true,
        //placeholder : "ui-state-highlight"
        start : function( event , ui ) {
            self.rescueFromDelete();
            $(ui.item).addClass("currentSortedItem");
        },
        stop : function( event , ui ) {

            $(ui.item).removeClass("currentSortedItem");
        }
    });
    $('#sortable').disableSelection();
};

/**
 * @method renderItem()
 * 
 * This function creates a content block of the current item of the Bookmark Model Iterator. 
 * 
 * If this method runs for an embed page, then the content links will be deactivated and the trigger 
 * for a opening the detailed view will be set.
 */
DossierContentView.prototype.renderItem = function(){

    //var self=this;
    ISNLogger.log( 'enter renderItem' );

    var bookmarkModel = this.controller.models.bookmark, 
        dossierID = this.controller.models.bookmark.getItemId();
    
    ISNLogger.log( 'dossier item id is ' + dossierID );

    
    var div1 = $("<li/>", {
        "id" : "item" + dossierID,
        "class" : "ui-state-default featured2 dossier_item"
    }).appendTo("#sortable");

    var divFloat = $("<div/>", {
        // "class" : "floatleft"
    }).appendTo(div1);

    var divA = $("<a/>", {
        "href" : bookmarkModel.getISNURL()
    }).appendTo(divFloat);

    var img = $("<img/>", {
        "class" : "floatleft",
        "src" : bookmarkModel.getThumbnail(),
        "width" : "80",
        "height" : "60"
    }).appendTo(divA);

    var divFloatText = $("<div/>", {
        // "class" : "floatleft overviewcontent dossier_text"
        "class" : "overviewcontent dossier_text"
    }).appendTo(div1);

    // if we are not in the embedded page display the isn url
    // if we are in the embed page, but if the dossier item type is different than publication display also the isn url
    var firstLineContainer = $("<div/>").appendTo(divFloatText);

    if ( !this.embed ) {
        var div3 = $("<div/>", {
            "class" : "deletecontainer hide"
        }).appendTo(firstLineContainer);

        $("<span/>", {
            "id" : "delete-"+ dossierID,
            "text" : "R",
            "class" : "deleteButton iconMoon"
        }).appendTo(div3);

        $("<span/>", {
            "id" : "delete-confirm-" + dossierID,
            "text" : "WR",
            "class" : "iconMoon deleteConfirmButton"
        }).appendTo(div3);
         
        $("<span/>", {
            "class" : "iconMoon dragIcon",
            "text" : "S"
        }).appendTo(div3);
    }
    
    var divp1 = $("<span/>", {
		"class":"small"
	}).appendTo(firstLineContainer);

    var btype = bookmarkModel.getType();
    var btypeS = btype === 'Audio' ? btype : btype + 's';
    
    $('<span/>', {'class': 'overview_date', 'text': bookmarkModel.getDate() }).appendTo(divp1);
    $('<a/>', {'class': 'OTName', 
               'href': 'http://www.isn.ethz.ch/Digital-Library/' + btypeS + '/', 'text': btype,
              }).appendTo(divp1);
    
    var divh1 = $("<h1/>").appendTo(divFloatText);

    if ( !this.embed ) {

        var divAText = $("<a/>", {
            "class" : "header1",
            "href" : bookmarkModel.getISNURL(),
            "text" : bookmarkModel.getTitle()
        }).appendTo(divh1);
    } 
    else {
        //if we are in the big embed view we need to open also a view that contains the header of the
        //detailed embede for back and forth navigation
        var divA = $("<a/>", {
            "id" : "embeditem" + bookmarkModel.getItemId(),
            "class" : "header1",
            "href" : bookmarkModel.getEmbedURL(),
            "text" : bookmarkModel.getTitle()
        }).appendTo(divh1);
    }

    //FIX #136 get short description removed
    var divp2 = $("<p/>", {
        "id" : "itemDescription" + dossierID,
        // "class" : "left",
        // text : bookmarkModel.getDescriptionShort(136)
        "text" : bookmarkModel.getDescription()
    }).appendTo(divFloatText);

};

/**
 *  In this function we delete a dossier item by performing two tasks
 *  1. Remove its visual representation
 *  2. Actual remove it by deleting the data from the database
 */
DossierContentView.prototype.removeItem = function( id ) {
    if ( !this.embed ) {
        this.controller.models.bookmark.removeItem(id);
        // remove the visuals
        $("#item" + id).remove();
    }
};

/**stores the current sorting order in the bookmark model
 * @prototype
 * @function storeOrder
 **/
DossierContentView.prototype.storeOrder = function() {
    if ( !this.embed) {
        ISNLogger.log("enter store Order");
        var orderList = new Array();

        $("#sortable").find("li.ui-state-default").each(function(index) {
            var id = $(this).attr("id").substring(4);
            orderList.push(id);
        });
        this.controller.models["bookmark"].setOrder(orderList);
    }
};

/**
 * TODO: Documentation
 * FIXME: unused?
 */
DossierContentView.prototype.showDraggableIcon = pdNOOP;

/**
 * closes the view
 * @prototype
 * @function closeDiv
 **/
DossierContentView.prototype.closeDiv = closeView;

/**
 * empties the course list
 * @prototype
 * @function close
 **/
DossierContentView.prototype.close = function() {

    //is this function being used!?
    ISNLogger.log("close course list view");
    this.active = false;
    this.closeDiv();
    $("#contentArea").empty();
};

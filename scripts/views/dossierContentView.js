/***
 * Design the overview page of the dossier.

 * This contains the list of the items of the dossier (publication, audio, video, articles)
 * */

/*jslint vars: true, sloppy: true */
function DossierContentView( dController ) {

    var self = this;
    self.controller = dController;
    self.tagID = 'contentArea';
    self.deleteMode = 0;

    $('.deleteButton','.deleteConfirmButton').bind("click", clickHandler );
    function clickHandler( e ) {

        var targetE = e.target;
        var targetID = targetE.id;
        if ( $(targetE).hasClass("deleteButton") ) {

            self.deleteMode = true;
            var myID = targetID.substring(7);
            self.deleteMode = myID;
            $(targetE).hide();
            $("#delete-confirm-" + myID).show();
            e.stopPropagation();
        } else if ( $(targetE).hasClass("deleteConfirmButton") ) {

            // get rid of the element
            var myIDf = targetID.substring(15);
            self.removeItem(myIDf);
            self.deleteMode = 0;
            e.stopPropagation();
        }
    }

    $(window).bind("click", function(){

        // rescue click to cancel a delete request
        if ( self.deleteMode > 0 ) {
            $('#delete-confirm-' + self.deleteMode).hide();
            $('#delete-' + self.deleteMode).show();
            self.deleteMode = 0;
        }
    });

    $(window).bind('keydown', function( e ) {

        if ( e.keyCode === 27 && self.deleteMode > 0 ) {
            $('#delete-confirm-' + self.deleteMode).hide();
            $('#delete-' + self.deleteMode).show();
            self.deleteMode = 0;
        }
    });


    $("#pd_footer_gen").bind("click", function(){

        window.open( baseURL() + 'index.html' , '_blank' );
    });


    $('#editDossier').bind('click', function(){

        var userType=self.controller.models.dossierList.getUserType();
        ISNLogger.log( 'user type in dossier content view is ' + userType );
        if ( userType !== "user" ) {

            // 1. display the grey sortable icon next to the titles of the items
            $('.dragIcon').show();

            // 2. enable sortability
            self.activateSorting();

            // 3. show delete button
            if ( self.controller.oauth ) {

                $('.deletecontainer').show();
            }
        }
    });


    $('#lock-editDossier').bind('click', function(){

        // 1. store the positioning of the items
        self.storeOrder();

        // 2. send the new positions to the server

        self.controller.models.bookmark.arrangeItems();

        // 3. remove the sortability from the list
        $('#sortable').sortable('disable');

        // 4. remove the grey sortable icon from the titles of the items
        $('.dragIcon').hide();

        // 5. remove the delete button
        $('.deletecontainer').hide();
    });
} //end of constructor


/**
 * opens the view
 * @prototype
 * @function openDiv
 **/
DossierContentView.prototype.openDiv = openView;



DossierContentView.prototype.open = function(){
    this.update();
    this.openDiv();
};



DossierContentView.prototype.update = function(){

    var self=this;
    $("#contentArea").empty();

    //TODO: only if we are loggedIn to display the logout button
    if ( self.controller.oauth ) {

        $("#delete").removeClass("hidden");
        $('#findinformation').removeClass("hidden");
        $('#shareButton').removeClass("hidden");
    }
    if ( self.controller.hashed ) {

        $('#loginButtonLink').removeClass("hidden");
    }
    ISNLogger.log( 'open dossier list view' );
    this.renderList();
};



DossierContentView.prototype.renderList = function(){

    var iFrameHeight= window.innerHeight || document.documentElement.clientHeight;
    var bookmarkModel = self.controller.models.bookmark;
    ISNLogger.log( 'dossier list length in dossier content view ' + bookmarkModel.dossierList.length );

    if ( bookmarkModel.dossierList && bookmarkModel.dossierList.length > 0 ) {

        var divContainer = $("<ul/>", {
            "id" : "sortable",
        }).appendTo("#contentArea");

        ISNLogger.log( 'dossier list index is ' + bookmarkModel.index );
        bookmarkModel.firstItem();
        do {

            this.renderItem();
        } while ( bookmarkModel.nextItem() );
    } else {

        //if the specific dossier has no dossier items
        ISNLogger.log( 'the dossier has no dossier items' );
        var div = $("<div/>", {
            "id" : "noContent"
        }).appendTo("#contentArea");
        var p = $("<p/>", {
            "text" : "Your Dossier has no items. You can add items  to the personal dossier if you go to http://isn.ethz.ch/. In there, under both the dossiers and the digital library menus there are various content items. If you enter in the ones you are interested in you will see an addBookmark button on the right side. By clicking on it, this item will be added to your active dossier"
        }).appendTo(div);
    }

    if ( self.controller.id === "embedController" ) {

        var bannerHeight = $("#bannerArea").height();
        var footerHeight = $("#pd_footer_gen").height();
        var totalHeight = bannerHeight + footerHeight ; // we add 176 px for the image that might be still on its way
        var contentAreaHeight = iFrameHeight - totalHeight;
        $("#contentArea").css( "height" , contentAreaHeight + "px" );
    }
    // self.activateSorting();
};



DossierContentView.prototype.activateSorting = function(){

    ISNLogger.log( 'enter activateSorting' );
    //$( "#sortable" ).removeClass("ui-sortable-disabled");
    $('#sortable').sortable("enable");

    //make the list sortable
    $('#sortable').sortable({

        placeholder : "placeholder",
        forcePlaceholderSize : true,
        //placeholder : "ui-state-highlight"
        start : function(event,ui) {

            $(ui.item).addClass("currentSortedItem");
        },
        stop : function(event,ui) {

            $(ui.item).removeClass("currentSortedItem");
        }
    });
    $('#sortable').disableSelection();
};



DossierContentView.prototype.renderItem = function(){

    //var self=this;
    ISNLogger.log( 'enter renderItem' );

    var bookmarkModel = self.controller.models.bookmark;
    var dossierID = self.controller.models.bookmark.getItemId();
    ISNLogger.log( 'dossier item id is ' + dossierID );

    var div1 = $("<li/>", {
        "id" : "item" + dossierID,
        "class" : "ui-state-default featured2 hideOT dossier_item"
    }).appendTo("#sortable");

    var divFloat = $("<div/>", {
        "class" : "floatleft"
    }).appendTo(div1);

    var divA = $("<a/>", {
        "href" : bookmarkModel.getISNURL()
    }).appendTo(divFloat);

    img = $("<img/>", {
        "class" : "floatleft",
        "src" : bookmarkModel.getThumbnail(),
        "width" : "80",
        "height" : "60"
    }).appendTo(divA);

    var divFloatText = $("<div/>", {
        "class" : "floatleft overviewcontent dossier_text"
    }).appendTo(div1);


    // if we are not in the embedded page display the isn url
    // if we are in the embed page, but if the dossier item type is different than publication display also the isn url
    firstLineContainer = $("<div/>").appendTo(divFloatText);

    divp1 = $("<span/>", {
        "class" : "small",
        text : bookmarkModel.getDate() + "/" + bookmarkModel.getType()
    }).appendTo(firstLineContainer);

    icon = $("<span/>", {
        "class" : "iconMoon dragIcon hide",
        text : "S"
    }).appendTo(firstLineContainer);

    var divh1 = $("<h1/>").appendTo(divFloatText);

    if ( self.controller.id !== "embedController" || bookmarkModel.getType() !== "Publication" ) {

        divAText = $("<a/>", {
            "class" : "header1",
            "href" : bookmarkModel.getISNURL(),
            text : bookmarkModel.getTitle()
        }).appendTo(divh1);
    } else {

        //if we are in the big embed view we need to open also a view that contains the header of the
        //detailed embede for back and forth navigation
        divA = $("<a/>", {
            "class" : "header1",
            "href" : bookmarkModel.getEmbedURL(),
            text : bookmarkModel.getTitle()
        }).appendTo(divh1);
    }


    divp2 = $("<p/>", {
        "id" : "itemDescription" + dossierID,
        "class" : "left",
        text : bookmarkModel.getDescriptionShort(136)
    }).appendTo(divFloatText);

    var divMore = $("<span/>", {
        "class" : "more more_a",
        "style" : "padding-left:5px",
        "text" : "More"
    }).appendTo(divp2);

    if ( self.controller.id !== "embedController" ) {
        div3 = $("<div/>", {
            "class" : "deletecontainer hide"
        }).appendTo(divFloatText);

        delButton = $("<div/>", {
            "id" : "delete-"+ dossierID,
            "text" : "Delete",
            "class" : "deleteButton"
        }).appendTo(div3);

        delConfirmButton = $("<div/>", {
            id : "delete-confirm-" + dossierID,
            text : "Really delete?",
            "class" : "deleteConfirmButton"
        }).appendTo(div3);
    }
};



/**
 *  In this function we delete a dossier item by performing two tasks
 *  1. Remove its visual representation
 *  2. Actual remove it by deleting the data from the database
 */
DossierContentView.prototype.removeItem = function( id ) {

    var bookmarkModel = self.controller.models.bookmark;

    //call the model removeBookmark()
    bookmarkModel.removeItem(id);

    // remove the visuals
    $("#item" + id).remove();
};



/**stores the current sorting order in the bookmark model
 * @prototype
 * @function storeOrder
 **/
DossierContentView.prototype.storeOrder = function() {

    ISNLogger.log("enter store Order");
    var orderList = new Array();

    $("#sortable").find("li.ui-state-default").each(function(index) {
        var id = $(this).attr("id").substring(4);
        orderList.push(id);
    });
    controller.models["bookmark"].setOrder(orderList);
};



DossierContentView.prototype.showDraggableIcon = function(){};



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
    moblerlog("close course list view");
    this.active = false;
    this.closeDiv();
    $("#contentArea").empty();
};

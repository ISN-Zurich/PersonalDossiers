/**
 * 
 * this script is executed on digital libary html which is hosted in 

 * the main ISN website. 
 *  
 * 
 */
function DesignBookmarkView(dcontroller) {
	ISNLogger.log("enter design bookmark view");
	var self = this;

	self.controller=dcontroller;

	$('#isn_pd_widget').bind("click", function(e) { //add id dynamically
		if ( e.target.id === "addbmbutton" ) {
			self.addItemToDossier();
		}
//		ISNLogger.log("clicked on the submit button");
//		var dossierItemId= $('input#inputValue').val();
//		ISNLogger.log("got the input value and it is "+dossierItemId);
//		var bookmarkModel=controller.models["bookmark"];
//		bookmarkModel.addItem(dossierItemId);
	});	

        if ( this.controller.isLoggedin() ) {
	    this.open();
        }
}


DesignBookmarkView.prototype.open = function() {
	ISNLogger.log("open add bookmark view");
	this.update();
};


DesignBookmarkView.prototype.update = function(){
    ISNLogger.log('update bookmark button');
	//design the bookmark button dynamically in the appropriate div
	
	var bookMarkbuttonContainer = $("<div/>", {
		"id":"bookmark" //add id dynamically
	}).appendTo("#isn_pd_widget");
	
	var bookmarkButton = $("<p/>", {
            "id": "addbmbutton",
		"class":"bold active",
		text:"add Bookmark"
	}).appendTo("#bookmark");
	
	
	
	// display it only when we are logged in
    if ( this.controller.isLoggedin() ) {
        $("#isn_pd_widget").removeClass("none");
    }	
};

DesignBookmarkView.prototype.addItemToDossier = function() {
    ISNLogger.log('click on add bookmark');

    var search = window.location.search;

    var params = search.split("&");
    var i;
    for ( i = 0; i < params.length; i++) {
        var tmp = params[i].split('=');
        if ( tmp[0] === "id" || tmp[0] === "?id" ) {
            this.itemId = tmp[1];
        }
    }

    ISNLogger.log( 'add id ' + this.itemId);
    this.controller.addItem(this.itemId);
};




/**
 * 
 * this script is executed on digital libary html which is hosted in 

 * the main ISN website. 
 *  
 * 
 */
function DesignBookmarkView(dcontroller) {
    console.log("enter design bookmark view");
    var self = this;
    
    self.controller=dcontroller;

    $('#isn_pd_widget').bind("click", function(e) { //add id dynamically
	if ( e.target.id === "addbmbutton" ) {
            self.addItemToDossier();
        }
    });	

    if ( this.controller.isLoggedin() ) {
	this.open();
    }
}


DesignBookmarkView.prototype.open = function() {
	console.log("open add bookmark view");
	this.update();
};


DesignBookmarkView.prototype.update = function(){
    console.log('update bookmark button');
	//design the bookmark button dynamically in the appropriate div
	
	var bookMarkbuttonContainer = $("<div/>", {
		"id":"bookmark", //add id dynamically
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

DesignBookmarkView.prototype.feedback = function(type) {
    if ( type === 'OK' ) {
        // change from add bookmark to bookmarked
        $('#addbmbutton').text('bookmarked');
    }
};

DesignBookmarkView.prototype.addItemToDossier = function() {
    this.controller.addItem();
};




/**
 * This views refers to the banner  
 * 
 * 
 * 
 **/

/*jslint vars: true, sloppy: true */

function DossierBannerView(myController){
    var self = this;
    
    self.editMode = false;
    
    self.waitForUpload = 0;
    self.goToGallery = false;
    self.activeEditElement = "";
    self.controller= myController;
    self.tagID='header_image';	
    
    $('#header_image').bind('click', _clickHandler);
    
    // click handler
    function _clickHandler(e) {
	var targetID = e.target.id;
	
	if ( self.editMode ) {
	    // always check for edits
	    self.checkDescriptionEdit();
	    self.checkTitleEdit();			
	}
	
	switch (targetID) {
	case 'editDossier':
	    self.activateBannerEditMode();
	    e.stopPropagation();
	    break;
	case 'lock-editDossier':
	    self.deactivateBannerEditMode();
	    e.stopPropagation();
	    break;
	case 'bannerImage':
	    // go to image gallery
	    self.changeImage();
	    e.stopPropagation();
	    break;
	default:
	    break;
	}
    }

    $(document).bind('dataSuccessfullySent', function() {
        self.waitForUpload--;
        self.transitionToGallery();
    });
} //end of constructor

DossierBannerView.prototype.activateBannerEditMode = function() {
    this.editMode = true;
    console.log("activate Banner Edit");
    
    // TODO: add visual cues that some parts are now editable
    
    $("#titleContainer").attr('contenteditable', 'true');
    $("#descriptionContainer").attr('contenteditable', 'true');
    $('#bannerImage').attr('title', 'Click to Edit');
    
    $("#editDossier").removeClass('titleEdit').addClass('hidden');
    $("#lock-editDossier").removeClass('hidden').addClass('titleEdit');
};

DossierBannerView.prototype.deactivateBannerEditMode = function() {
    console.log("deactivate Banner Edit");
    
    // TODO: remove visual cues that from editable parts
    
    $("#titleContainer").removeAttr('contenteditable');
    $("#descriptionContainer").removeAttr('contenteditable');
    $('#bannerImage').removeAttr('title');
    
    $("#lock-editDossier").removeClass('titleEdit').addClass('hidden');
    $("#editDossier").removeClass('hidden').addClass('titleEdit');
    
    this.editMode = false;
};

DossierBannerView.prototype.changeImage= function(){
    if (this.editMode) {
        console.log('wait for Transition');
        this.goToGallery = true;
        this.transitionToGallery();
    }
};

DossierBannerView.prototype.transitionToGallery = function() {
    if ( this.waitForUpload === 0 && this.goToGallery === true ) {
        console.log('upload done');
	window.location.href = "gallery.php";
    }
};

DossierBannerView.prototype.checkTitleEdit = function() {
    var value = $("#headerTitle").text();
    var oldVal= self.controller.models.bookmark.getDossierTitle();
    
    if ( value !== oldVal) {
	console.log('Change the title content! and make it: '+value);
	this.controller.models.bookmark.setDossierTitle(value);

	this.waitForUpload++;
	this.controller.models.bookmark.sendDataToServer();
    }
}; 

DossierBannerView.prototype.checkDescriptionEdit = function() {
    var value = $("#headerDescription").text();
    var oldVal= self.controller.models.bookmark.getDossierDescription();
    
    if ( value !== oldVal) {
	console.log('Change the description content! ' + value);
	this.controller.models.bookmark.setDossierDescription(value);
	// safe the edit in the backend

    this.waitForUpload++;
	this.controller.models.bookmark.sendDataToServer();
    }
}; 


DossierBannerView.prototype.open=function(){
    console.log("open dossier banner view");	
    this.renderBanner();
    // this.openDiv();	
};

DossierBannerView.prototype.renderBanner= function(){
    var self=this;
    //Design the Banner area 
    $("#header_image").empty();
    var bookmarkModel = self.controller.models.bookmark;
    //var dossierId= bookmarkModel.getDossierID();
    var dossierId=bookmarkModel.dossierId;
    
    console.log("dossier id in banner view is "+dossierId);
    // 1. If there is no dossier selected, set the default banner settings	(title, bg img, description) for the default dossier id
    // - design dynamically the existing html-code of the index.html
    //	var div=$("<div/>", {
    //	}).appendTo("#header_image");
    
    img=$("<img/>", {
	"id":"bannerImage",//we need to provide the dossierId dynamically
	"class" : "big_img",
	//"src": "sample_index_files/default3.jpg"//to get it dynamically
	"src": bookmarkModel.getDossierImageURL()
    }).appendTo("#header_image");
    
    
    var div1=$("<div/>", {
	"id": "headerText",
	"class":"column span-6 last"
    }).appendTo('#header_image');
    
    
    var p1=$("<p/>", {
	"id":"titleContainer"
    }).appendTo(div1);
    
    span=$("<span/>", {
	"id":"headerTitle",//we need to provide the dossierId dynamically
	"class":"headerTitle", 
	//text:"My personal dossier" //to get it dynamically
	text:bookmarkModel.getDossierTitle()
    }).appendTo(p1);
    
    
    var p2=$("<p/>", {
	"id":"descriptionContainer",
	"class": "margingForEdit"
    }).appendTo(div1);
    
    span2=$("<span/>", {
	"id":"headerDescription", //we need to provide the dossierId dynamically
	"class":"subject",
	//text:"Short description about what pseronal dossiers are dossiers are Short description about what personal dossiers are"//to get it dynamically
	text:bookmarkModel.getDossierDescription()
    }).appendTo(p2);
    
    if (self.controller.oauth){
    divEdit=$("<span/>", {
	"id":"editDossier",//we need to provide the dossierId dynamically
	"class":"titleEdit",
	text:"edit"
    }).appendTo(div1);
    
    divLockEdit=$("<span/>", {
	"id":"lock-editDossier", //we need to provide the dossierId dynamically
	"class":"hidden",
	text:"lock edit"
    }).appendTo(div1);
    }
};

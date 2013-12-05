/*jslint vars: true, sloppy: true */

/**
 
* This views refers to the banner  
 * 
 * 
 * 
 **/
function DossierBannerView(myController){
    var self = this;
    
    self.editMode = false;
    
    self.waitForUpload = 0;
    self.goToGallery = false;
    self.activeEditElement = "";
    self.controller= myController;
    self.tagID='header_image';	
    
      
    $('#header_image').bind('click', function(e){
	if ( self.editMode ) {
	    // always check for edits
		self.checkDescriptionEdit();
	    self.checkTitleEdit();	;		
	}
	var targetID = e.target.id;
	if (targetID == "bannerImage"){
    self.changeImage();
    e.stopPropagation();}}
    );
    
    $('#editDossier').bind('click', function(e){
    	if ( self.editMode ) {
    	    // always check for edits
    	    self.checkDescriptionEdit();
    	    self.checkTitleEdit();			
    	}
    	
    	var userType=self.controller.models.dossierList.getUserType();
    	console.log("user type in dossier banner view is "+userType);
    	if (userType!== "user"){
    		console.log("will activate banner edit mode, we are not users");
    	self.activateBannerEditMode();
	    e.stopPropagation();
    	}
    	// //TODO: implement the else: display to the user a dropdown message that he does not have the rights to edit 
    });
    
    $('#lock-editDossier').bind('click', function(e){
    	if ( self.editMode ) {
    	    // always check for edits
    	    self.checkDescriptionEdit();
    	    self.checkTitleEdit();			
    	}
    	
    	self.deactivateBannerEditMode();
	    e.stopPropagation();
    });
    
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
    
    $("#editDossier").addClass('hide');
    $("#lock-editDossier").removeClass('hide');
        
};

DossierBannerView.prototype.deactivateBannerEditMode = function() {
    console.log("deactivate Banner Edit");
    
    // TODO: remove visual cues that from editable parts
    
    $("#titleContainer").removeAttr('contenteditable');
    $("#descriptionContainer").removeAttr('contenteditable');
    $('#bannerImage').removeAttr('title');
    
    $("#lock-editDossier").addClass('hide');
    $("#editDossier").removeClass('hide');
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
    var oldVal= self.controller.models['bookmark'].getDossierTitle();
    
    if ( value !== oldVal) {
	console.log('Change the title content! and make it: '+value);
	this.controller.models['bookmark'].setDossierTitle(value);

	this.waitForUpload++;
	this.controller.models['bookmark'].sendDataToServer();
    }
}; 

DossierBannerView.prototype.checkDescriptionEdit = function() {
    var value = $("#headerDescription").text();
    var oldVal= self.controller.models['bookmark'].getDossierDescription();
    
    if ( value !== oldVal) {
	console.log('Change the description content! ' + value);
	this.controller.models['bookmark'].setDossierDescription(value);
	// safe the edit in the backend

        this.waitForUpload++;
	this.controller.models['bookmark'].sendDataToServer();
    }
}; 


DossierBannerView.prototype.open=function(){
    console.log("open dossier banner view");	
    this.renderBanner();
    // this.openDiv();	
};

DossierBannerView.prototype.renderBanner= function(){
    var self=this
    //Design the Banner area 
    $("#header_image").empty();
    var bookmarkModel = self.controller.models['bookmark'];
    //var dossierId= bookmarkModel.getDossierID();
    var dossierId=bookmarkModel.dossierId;
    
    console.log("dossier id in banner view is "+dossierId);
    
    var img=$("<img/>", {
	"id":"bannerImage",//we need to provide the dossierId dynamically
	"class" : "big_img",
	"width":"470px",
	"height":"176px", 
	"src": bookmarkModel.getDossierImageURL()
    }).appendTo("#header_image");
    
  var titleContainer=$("<p/>", {
	"id":"titleContainer",
    }).appendTo("#header_image");
    
    
    var span=$("<span/>", {
    	"id":"headerTitle",//we need to provide the dossierId dynamically
    	"class":"headerTitle", 
    	text:bookmarkModel.getDossierTitle()
        }).appendTo(titleContainer);
        
  var descriptionContainer=$("<p/>", {
	"id":"descriptionContainer",
	"class": "margingForEdit"
  }).appendTo("#header_image");
    
    var p=$("<p/>", {
    	"id":"headerDescription",
    	"text": bookmarkModel.getDossierDescription()
        }).appendTo(descriptionContainer);
    
    hr=$("<hr/>", {
		"class":"overview white"
	}).appendTo("#header_image");
      
    if (self.controller.oauth){
    	$("#editDossier").removeClass("hide");
    	
    }
};

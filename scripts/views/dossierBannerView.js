/*jslint vars: true, sloppy: true */

/**
 * This views refers to the banner
 **/
function DossierBannerView(myController){
    var self = this;
    self.controller= myController;

    self.embed = (self.controller.id && self.controller.id.length && (self.controller.id === 'badgeController' || self.controller.id === 'detailembedController'));
    self.editMode = false;
    self.deleteMode = false;

    self.waitForUpload = 0;
    self.goToGallery = false;
    self.activeEditElement = "";

    self.tagID='header_image';

    $('#header_image').bind('click', function(e){
        if (!self.embed && 
            self.editMode && 
            self.controller.checkActiveUserRole('owner')) {
            // always check for edits
            self.checkDescriptionEdit();
            self.checkTitleEdit();
            var targetID = e.target.id;
            if ( ( targetID == "bannerImage" ) || ( targetID == "bannerImageEditOverlay" ) ) {
                self.changeImage();
                e.stopPropagation();
            }
        }
    });

    $('#editDossier').bind('click', function(e){
        if ( !self.embed ) {
            if (self.editMode && 
                self.controller.checkActiveUserRole('owner')) {
                // always check for edits
                self.checkTitleEdit();
                self.checkDescriptionEdit();
            }

            if (self.controller.checkActiveUserRole('owner')) {
                
                ISNLogger.log("will activate banner edit mode, we are not users");
                self.activateBannerEditMode();
                e.stopPropagation();
            }
        }
    });

    $('#lock-editDossier').bind('click', function(e){
        
        if ( !self.embed ) {
            if (self.editMode && 
                self.controller.checkActiveUserRole('owner')) {
                // always check for edits
                self.checkTitleEdit();
                self.checkDescriptionEdit();
            }

            self.deactivateBannerEditMode();
            e.stopPropagation();
        }
    });


    $('#deleteDossier').bind('click', function(e){

        if ( !self.embed && self.controller.checkActiveUserRole('owner') ){

            ISNLogger.log("owners can delete the dossier, reveal confirm buttons");
            self.activateBannerDeleteMode();
            e.stopPropagation();
        }
    });


    $('#confirmDeleteDossierButton').bind('click', function(e){

        if ( !self.embed ) {

            if ( self.deleteMode && self.controller.checkActiveUserRole('owner')) {

                ISNLogger.log("delete the dossier");
                self.deleteDossier();
            }
            e.stopPropagation();
        }
    });


    $('#cancelDeleteDossierButton').bind('click', function(e){

        if ( !self.embed ) {

            if ( self.deleteMode ) {
                var userType = self.controller.models.dossierList.getUserType();
                ISNLogger.log( "user type in dossier banner view is " + userType );
                if ( userType !== "user" ) {

                    ISNLogger.log("owners can delete the dossier");
                    self.deactivateBannerDeleteMode();
                    e.stopPropagation();
                }
            }
        }
    });

    $(document).bind('dataSuccessfullySent', function() {
        self.waitForUpload--;
        self.transitionToGallery();
    });

    $(document).bind('dossierDeleteSuccess', function(){
        window.location.href = "user.html#personalDossiers";
    });

} //end of constructor

DossierBannerView.prototype.activateBannerEditMode = function() {
    if ( !this.embed ) {
        this.editMode = true;
        ISNLogger.log("activate Banner Edit");

        // TODO: add visual cues that some parts are now editable

        $("#titleContainer").attr('contenteditable', 'true');
        $("#descriptionContainer").attr('contenteditable', 'true');
        $('#bannerImage').attr('title', 'Click to Edit');

        $("#editDossier").addClass('hide');
        $("#lock-editDossier").removeClass('hide');
        $("#bannerImageEditOverlay").removeClass('hide');
    }
};

DossierBannerView.prototype.deactivateBannerEditMode = function() {
    ISNLogger.log("deactivate Banner Edit");
    if ( !this.embed ) {
        // TODO: remove visual cues that from editable parts

        $("#titleContainer").removeAttr('contenteditable');
        $("#descriptionContainer").removeAttr('contenteditable');
        $('#bannerImage').removeAttr('title');

        $("#lock-editDossier").addClass('hide');
        $("#editDossier").removeClass('hide');
        $("#bannerImageEditOverlay").addClass('hide');
        this.editMode = false;
    }
};

DossierBannerView.prototype.activateBannerDeleteMode = function() {

    if ( !this.embed ) {

        this.deleteMode = true;
        ISNLogger.log("activate Banner Delete");
        $("#deleteDossier").addClass('hide');
        $("#confirmDeleteDossier").removeClass('hide');
    }
};

DossierBannerView.prototype.deactivateBannerDeleteMode = function() {

    if ( !this.embed ) {

        this.deleteMode = false;
        ISNLogger.log("deactivate Banner Delete");
        $("#confirmDeleteDossier").addClass('hide');
        $("#deleteDossier").removeClass('hide');
    }
};

DossierBannerView.prototype.deleteDossier = function() {

    ISNLogger.log('in deleteDossier');
    //if we aren't embedded and are in delete confirm mode
    if ( !this.embed && this.deleteMode ) {

        ISNLogger.log('about to call the model directly from the view on: callServiceToDeleteDossier()');

        //call our dossier delete service via the controller
        self.controller.models['bookmark'].callServiceToDeleteDossier();

        ISNLogger.log('transition to welcome view');
    }
    ISNLogger.log('leave deleteDossier');
}


DossierBannerView.prototype.changeImage = function(){
    if (!this.embed && this.editMode) {
        ISNLogger.log('wait for Transition');
        this.goToGallery = true;
        this.transitionToGallery();
    }
};

DossierBannerView.prototype.transitionToGallery = function() {
    if ( this.waitForUpload === 0 && this.goToGallery === true ) {
        ISNLogger.log('upload done');
       window.location.href = "gallery.html?id="+ this.controller.getActiveDossier();
    }
};

DossierBannerView.prototype.checkTitleEdit = function() {
    if (!this.embed){
        var oldVal= self.controller.models['bookmark'].getDossierTitle();
        var value = $("#headerTitle").text();

        if (value !== oldVal) {
            ISNLogger.log('old val in title is: '+oldVal);

            ISNLogger.log('Change the title content! and make it: '+value);

            this.controller.models['bookmark'].setDossierTitle(value);

            this.waitForUpload++;
            this.controller.models['bookmark'].sendDataToServer();
        }
    }
};

DossierBannerView.prototype.checkDescriptionEdit = function() {
    if ( !this.embed ) {
        var value = $("#headerDescription").text();
        var oldVal= self.controller.models['bookmark'].getDossierDescription();

        if (value !== oldVal) {
            ISNLogger.log('Change the description content! ' + value);
            this.controller.models['bookmark'].setDossierDescription(value);
            // safe the edit in the backend

            this.waitForUpload++;
            this.controller.models['bookmark'].sendDataToServer();
        }
    }
};

DossierBannerView.prototype.open = function(){
    ISNLogger.log("open dossier banner view");
    if(!this.controller.models['bookmark'].dossierForbidden) {
        this.renderBanner();
        if (!(this.controller.checkActiveUserRole('owner') || this.controller.checkActiveUserRole('editor')) ) {
            $('#editDossier').addClass('hide');
            $('#deleteDossier').addClass('hide');
        }
        else {
            $('#editDossier').removeClass('hide');
        }
        this.openDiv();
    }
};

DossierBannerView.prototype.openDiv = openView;
DossierBannerView.prototype.close   = closeView;

DossierBannerView.prototype.renderBanner= function(){
    var self=this
    //Design the Banner area
    $("#header_image").empty();
    var bookmarkModel = self.controller.models['bookmark'];
    var dossierListModel=self.controller.models['dossierList'];
    var userType=dossierListModel.getUserType();
    //var dossierId= bookmarkModel.getDossierID();
    var dossierId=bookmarkModel.dossierId;

    ISNLogger.log("dossier id in banner view is "+dossierId);

    var img=$("<img/>", {
        "id"     : "bannerImage", //we need to provide the dossierId dynamically
        "class"  : "big_img",
        "width"  : "470px",
        "height" : "176px",
        "src"    : bookmarkModel.getDossierImageURL()
    }).appendTo("#header_image");

    var editImg = $( "<div/>", {
        "id" : "bannerImageEditOverlay",
        "class" : "hide"
    }).appendTo("#header_image");

    var titleContainer=$("<div/>", {
    "id":"titleContainer",
    }).appendTo("#header_image");

    var span=$("<div/>", {
        "id":"headerTitle",//we need to provide the dossierId dynamically
        "class":"headerTitle",
        text:bookmarkModel.getDossierTitle()
    }).appendTo(titleContainer);

/*
    var descriptionContainer=$("<p/>", {
    "id":"descriptionContainer",
    }).appendTo("#header_image");
*/
    var p = $("<p/>", {
        "id":"headerDescription",
        "text": bookmarkModel.getDossierDescription()
    }).appendTo("#header_image");

    // hr=$("<hr/>", {
    //     "class":"overview white"
    // }).appendTo("#header_image");

    if (self.controller.oauth && userType !== "user"){
        $("#editDossier").removeClass("hide");
        $("#deleteDossier").removeClass("hide");
    }
};

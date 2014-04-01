/**
 * GalleryView
 * 
 * The gallery view is responsible for displaying 
 */

//it is like a model for the selection of images
function GalleryView(controller){

    ISNLogger.log("runs in image handler constructor");
    var self=this;

    self.tagID = "imagegallery";
    
    self.controller=controller;
    
    $(document).bind("click", imageSelectHandler);
    $(document).bind("GalleryImagesReady", imageMoreImages);
    this.open();
    
    function imageSelectHandler(e){
        ISNLogger.log("run into final image select handler");
        var targetE = e.target;
        var targetID = targetE.id;
        
        if ( targetID === 'loadmoreimages') {
            self.controller.models.gallery.more();
        }
        else {
            ISNLogger.log("targetID is "+targetID);
            ISNLogger.log("clicked on image");
            var myID=targetID.substring(4);
            if (myID > 0 && self.controller.models.gallery.findImageId(myID)) {
                var oldId = self.controller.models.gallery.id;

                self.controller.models.gallery.setImageId(myID);
                var src = self.controller.models.gallery.getImageSrc();
                if (src.length){

                    self.controller.storeDossierImage(src);
                }
                else {

                    self.controller.models.gallery.setId(oldId);
                }
            }
        }
    }
    
    function imageMoreImages () {
        // skip the last item of the previous batch.
        self.controller.models.gallery.next();
        self.renderMore();
    }
    
    ISNLogger.log("image handler ready");
}

GalleryView.prototype.openDiv   = openView;
GalleryView.prototype.close     = closeView;
GalleryView.prototype.open      = function() {
    this.openDiv();
};

GalleryView.prototype.update    = function() {
    this.controller.models.gallery.reset();
    this.renderMore();  
};

/**
 * @method renderMore()
 * 
 * renders all images after the current iterator of the gallery model.
 * This function is used in update() as well as in the event handler for 
 * the "GalleryImagesReady" event
 */
GalleryView.prototype.renderMore = function() {
    do {
        this.renderImage();
    } while (this.controller.models.gallery.next());
    if (this.controller.models.gallery.lastPage) {
        $("#gallerynavigation").show();
    }
    else {
        $("#gallerynavigation").hide();
    }
};

GalleryView.prototype.renderImage = function() {
    var id  = this.controller.models.gallery.getImageId();
    var src = this.controller.models.gallery.getImageSrc();
    var ttl = this.controller.models.gallery.getImageTitle();
    var divCont = $("<div/>", {'id': 'prnt'+ id}).appendTo('#imagegallery'); 
     $('<h3/>', {'text': ttl, 
                  'id': 'head' + id}).appendTo(divCont);
    $('<img/>', {'src': src, 
                 'id':  'imgx' + id,
                 'class': 'galleryimage'
                }).appendTo(divCont);   
};

/**
 * @method clear()
 * 
 * clears the gallery space.
 */
GalleryView.prototype.clear = function () {
    $("#imagegallery").html("");
};

GalleryView.prototype.nextPage  = function() {};
GalleryView.prototype.prevPage  = function() {};
/**
 * The GalleryModel provides the interface to the ISN slider images
 */

/*jslint vars: true, sloppy: true */

function GalleryModel(controller) {
    this.controller = controller;
    this.refresh();
}

/**
 * @method getImageId()
 * 
 * returns the image's KMS id
 */
GalleryModel.prototype.getImageId = function () {
    if (this.images.length && this.id < this.images.length) {
        return this.images[this.id].imageid;
    }
    return 0;
};

/**
 * @method getImageSrc()
 * 
 * returns the source for the active Image
 */
GalleryModel.prototype.getImageSrc = function () {
    if (this.images.length && this.id < this.images.length) {
        return 'http://pictures.isn.ethz.ch/cache/' +  this.images[this.id].imageid + '.' + this.images[this.id].objectdata.fileExtension;
    }
    return "";
};

/** 
 * @method getImageTitle()
 * 
 * return the title of the active image
 */
GalleryModel.prototype.getImageTitle = function () {
    if (this.images.length && this.id < this.images.length) {
        return this.images[this.id].objectdata.title;
    }
    return "";
};

/**
 * @method loadImages(page) 
 * 
 * loads a chunk of images from the service. page refes to the service 
 * pagination. The service returns the image data in chunks of 50 items
 */
GalleryModel.prototype.loadImages = function(page) {
    ISNLogger.debugMode = true;
    
    var self = this;
    var q = self.query || "";
    var pp = page + 1;
    var url = self.controller.baseURL +'service/imagelist.php/' + pp;
    if ( q.length ) {
        url = url + '?' + q;
    }
    
    // now fetch the items.
    $.ajax({
        url:  url,
        type : 'GET',
        dataType : 'json',
        success : loadImgList,
        error : function(request) {
    
            //localStorage.setItem("pendingCourseList", true);
            ISNLogger.log("Error while loading dossier list from server");
            ISNLogger.log("ERROR status text: "+ request.statusText);
            ISNLogger.log("ERROR status code: "+ request.statusCode());
            ISNLogger.log("ERROR status code is : " + request.status);
            ISNLogger.log("ERROR responsetext: "+ request.responseText);
        }
    });
    
    /**
     * @private loadImgList(data)
     * 
     * callback function for the ajax request to the image list service. 
     */
    function loadImgList(data) {
        ISNLogger.log("received an answer from IMAGELIST.PHP");
        
        if ( data.count < 50 ) {
            
            // we are on the last page
            self.lastPage = true;
        }
        
        if (data.images && data.images.length) {
            var i;
            for ( i = 0; data.images[i]; i++) {
                
                self.images.push(data.images[i]);    
            }
            
            
            ISNLogger.log("fire GalleryImagesReady " + i + " images");
            $(document).trigger("GalleryImagesReady");
        }
    }
};

/**
 * @method next()
 * 
 * increment the internal iterator
 */
GalleryModel.prototype.next = function() {
    var i = this.id + 1;
    if (this.images && i < this.images.length) {
        this.id = i;
        return true;
    }
    return false;
};

/**
 * @method setId(id)
 * 
 * sets the iterator to the provided list id. If the id is within 
 * the range of the iterator, it will be set to that id. If the id is larger 
 * than the number of available images it will set the id to the last element,
 * otherwise the id is set to the first element.
 */
GalleryModel.prototype.setId = function(id) {
    if (id >= 0 &&  id < this.images.length) {
        
        this.id = id;
    }
    else if (id >= this.images.length) {
        
        this.id = this.images.length - 1;
    }
    else {
        
        this.id = 0;
    }
};

/**
 * @method reset()
 * 
 * Reset the iterator to the first item.
 */
GalleryModel.prototype.reset = function() { 
    this.setId(0); 
};

/**
 * @method boolean setImageId(kmsid)
 * 
 * sets the iterator to the provided KMS id. The method returns true if 
 * the KMSID is in the image list, otherwise the method returns false to indicate
 * that the operation failed.
 */
GalleryModel.prototype.setImageId = function (kmsid) {
    var i = 0
    for (i; this.images[i]; i++) {
        
        if (this.images[i].imageid === kmsid) {
            this.id = i;
            return true;
        }
    }
    return false;
};

/**
 * @method findImageId(kmsid)
 * 
 * informs us whether an id is a valid KMSID for the current gallery selection.
 */
GalleryModel.prototype.findImageId = function (kmsid) {
    var i = 0
    for (i; this.images[i]; i++) {
        
        if (this.images[i].imageid === kmsid) {
            return true;
        }
    }
    return false;
};


/**
 * @method more() 
 * 
 * loads the next page from the source.
 */
GalleryModel.prototype.more = function() {
    this.page++;
    this.loadImages(this.page);
};

/**
 * @method refresh()
 * 
 * loads new data from the server
 */
GalleryModel.prototype.refresh = function() {
    this.page = 0;
    this.lastPage = false;
    
    this.images = [];
    this.id = 0;
    //this.query = '';
    
    // ask the controller if there is already a query
    
    // load the first chunk from the service
    this.loadImages(this.page);   
};

/**
 * @method filter(querystring)
 * 
 * 
 */
GalleryModel.prototype.filter = function(query) {
    this.query = query;
    this.refresh();
};

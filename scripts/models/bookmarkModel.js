/**
 * Model Functions
 * 
 * 1. addBookmark
 * 2. removeBookmark
 * 3. arrangeDocuments
 * 
 ****/

/*jslint vars: true, sloppy: true */

function BookmarkModel(dController){
    ISNLogger.log("enter BookmarkModel");
    var self=this;
    self.controller=dController;
    this.loaded=false;
    //dossier attributes 
    //this.dossierId=self.controller.getActiveDossier();
    
    // ISNLogger.log("default dossier is "+this.dossierId);
    
    this.dossierTitle= null;
    this.dossierDescription = null;
    this.dossierImageURL=null;
    
    //dossier items' attributes
    this.dossierData=[];
    this.dossierMetadata=[];
    this.dossierList=[];
    this.dossiers=[];
    this.index=0;
    this.userlist=[];
    this.user_index=0;
    this.storedPosition=[];
    
    this.editMode=false;
    //load the list of dossier items for the active dossier
    // this.loadDossierList();
    //this.initValues();
    if (self.controller.hashed) {
    	ISNLogger.log("in bookmark model constructor, to get the active dossier id");
        self.dossierId = self.controller.getActiveDossier();
        self.loadDossierList();
    }
    $(document).bind("ActiveDossierReady", loadActiveDossier);
       
    function loadActiveDossier() {
    	ISNLogger.log("enter event handler in bookmark model to load activeDossier");
    	if (!self.controller.hashed){
            ISNLogger.log("load Active Dossier");
            self.dossierId=self.controller.getActiveDossier();
            self.loadDossierList();
        }
    }  
 }

BookmarkModel.prototype.initValues=function(){
    this.dossierTitle= this.getDossierTitle();
    this.dossierDescription=this.getDossierDescription();
    this.dossierImageURL= this.getDossierImageURL();
};

BookmarkModel.prototype.setEditModeOn=function(){
	ISNLogger.log();
    this.editMode=true;
};

BookmarkModel.prototype.addItem=function(id){
    ISNLogger.log("enter addItem in Bookmark Model");
    var self=this;
    var dossierID = self.dossierId || self.controller.getActiveDossier();
    ISNLogger.log("dossierID in addItem is "+dossierID);
    var url=self.controller.baseURL +'service/dossier.php/'+ dossierID;
    var method="PUT";
    var pdata= JSON.stringify({'id': id });
    
    ISNLogger.log( 'addItem: data is ' + pdata);
    if ( dossierID && id ) {
        ISNLogger.log("before AJAX");
        $.ajax({
            url :url,
            type : method,
            data: pdata,
            dataType : 'json',
            success: success,
            error:error,
            beforeSend:setHeader
        });
    }

    function success(){
	// great! well done!
	ISNLogger.log("great the insertion of the bookmark was succesfull");
        $(document).trigger('BOOKMARKSTORED');
    }
    
    function error(request) {
        // the server rejected the request!
        ISNLogger.log("the server rejected the request of adding an item");
        ISNLogger.log("ERROR status text: "+ request.statusText); 
        ISNLogger.log("ERROR status code: "+ request.statusCode()); 
        ISNLogger.log("ERROR status code is : " + request.status);
        ISNLogger.log("ERROR responsetext: "+ request.responseText); 
        if (request.status == 401){
            // access keys have been rejected
            self.controller.keysRejected();
        }
    }
    
    function setHeader(xhr){
	   var header_request=self.controller.oauth.oauthHeader(method, url);
	   xhr.setRequestHeader('Authorization', header_request);
    }
};

BookmarkModel.prototype.removeItem=function(id){
    var self=this;
    //send delete request via ajax
    var dossierID = self.dossierId;
    var url= self.controller.baseURL +'service/dossier.php/' + dossierID + '/' + id;
    var method="DELETE";
    
    
    if ( dossierID && id ) {
        $.ajax({
            url: url,
            type : method,
            dataType : 'text',
            success: success,
            error:error,
            beforeSend:setHeader
        });
    }
    
    function success(){
	   ISNLogger.log("success in deleting the dossier item");	
    }

    function error(){
        ISNLogger.log("error in deleting the dossier item");
        if (request.status == 401){
            // access keys have been rejected
            self.controller.keysRejected();
        }
    }
    
    function setHeader(xhr) {
        var header_request=self.controller.oauth.oauthHeader(method, url);
        xhr.setRequestHeader('Authorization', header_request);
    }
};

BookmarkModel.prototype.arrangeItems=function(){
	var self=this;
	ISNLogger.log("enter arrange Items in Bookmark model");
	var sorted_order = this.getOrder();
	ISNLogger.log("sorted order is "+sorted_order);
	var dossierID=self.controller.getActiveDossier();
	ISNLogger.log("dossierID  in arrangeItems is" +dossierID);
	
	//url will look like this: 
	var url=self.controller.baseURL +'service/dossier.php/'+ dossierID + '/100'; 
	var method="POST";
	var dataObject = {
		"sortedList": sorted_order
	};
	var data=JSON.stringify(dataObject);
	
//	var myData={};
//	myData.sortedList=sorted_order;
	ISNLogger.log("data to be sent are "+data);
	$.ajax({
	    url:  url,
	    type : method,
	    data: data,
	    dataType : 'json',
	    success : sentData,
	    error : function(request) {
            ISNLogger.log("Error while sending arranging order of items to the server");
            ISNLogger.log("ERROR status text: "+ request.statusText); 
            ISNLogger.log("ERROR status code: "+ request.statusCode()); 
            ISNLogger.log("ERROR status code is : " + request.status);
            ISNLogger.log("ERROR responsetext: "+ request.responseText); 
            if (request.status == 401){
                // access keys have been rejected
                self.controller.keysRejected();
            }
	    },
	    beforeSend : setHeader
	});
	
	function sentData(){
		ISNLogger.log("success in sending arranging order to the server");
		//$(document).trigger("dataSuccessfullySent"); DO WEE NEED THIS
	}
	
	function setHeader(xhr){
		var header_request=self.controller.oauth.oauthHeader(method, url);
		xhr.setRequestHeader('Authorization', header_request);
	}
};

BookmarkModel.prototype.setOrder=function(array_order){
	ISNLogger.log("enter set Order in bookmark model");
	this.storedPosition = array_order;	
	ISNLogger.log("stored order is "+this.storedPosition);
};


BookmarkModel.prototype.getOrder=function(){
	return this.storedPosition;
};

/*
 * Load the list of dossier items for the active dossier
 *
 */
BookmarkModel.prototype.loadDossierList=function(){
    ISNLogger.log("enter loadDossier list");
    var self=this;
    var data = {};
    
    //var dossierID = this.dossierId;
    var dossierID= self.dossierId;
    ISNLogger.log("dossier ID in loadDossierList is "+dossierID);
    var url= self.controller.baseURL +'service/dossier.php/' + dossierID;
    var method="GET";
    if ( dossierID ) {
        ISNLogger.log("before executing the ajax request for " + dossierID);
        $.ajax({
            url:  url,
            type : 'GET',
            dataType : 'json',
            success : createDossierList,
            error : function(request) {
                //localStorage.setItem("pendingCourseList", true);
                ISNLogger.log("Error while loading dossier list from server");
                ISNLogger.log("ERROR status text: "+ request.statusText); 
                ISNLogger.log("ERROR status code: "+ request.statusCode()); 
                ISNLogger.log("ERROR status code is : " + request.status);
                ISNLogger.log("ERROR responsetext: "+ request.responseText); 
                if (request.status === 401){
                    //	window.location.href ="user.html";
                    ISNLogger.log("received 401, we should load the login page");
                    self.dossierForbidden = true;
                    $(document).trigger("BookmarkModelNotLoaded");
                }
            },
            beforeSend : setHeader
        });
    }

    function createDossierList(data){
    	ISNLogger.log("success in getting the dossier list in the model");
    	var dossierObject=null;
    	try{
    		dossierObject=data;
    	}
        catch(err) {
    		dossierObject={};
    		ISNLogger.log("couldnt load dossier items from the database");
    	}

    	dossierItemMetadata={};
    	self.dossierData=dossierObject || {};
    	ISNLogger.log("dossierData are "+JSON.stringify(self.dossierData));
    	//self.dossierList=JSON.stringify(self.dossierData['dossier_items']);

    	self.dossierMetadata=self.dossierData.dossier_metadata;
    	ISNLogger.log("dossier metadata is "+JSON.stringify(self.dossierMetadata));

    	self.dossierList=self.dossierData.dossier_items;
    	ISNLogger.log("dossier items are"+JSON.stringify(self.dossierList));

    	if (self.dossierList && self.dossierList.length>0){
    		var itemId= self.dossierList[0].metadata.id;	
    		ISNLogger.log("dossier item id in success is "+itemId);
    	}
    	//init values

    	self.dossierTitle= self.dossierMetadata.title;
    	ISNLogger.log("dossier title is "+self.dossierTitle);
    	self.dossierDescription=self.dossierMetadata.description;
    	self.dossierImageURL=self.dossierMetadata.image;
    	self.dossierId=self.dossierMetadata.id;

    	self.userlist=self.dossierData.user_list;
    	ISNLogger.log("user list is "+JSON.stringify(self.userlist));
    	$(document).trigger("BookmarkModelLoaded");
    }
    
    function setHeader(xhr) {
        if (self.controller.oauth)   {
        	ISNLogger.log("we are authenticated and we will send a header");
            var header_request=self.controller.oauth.oauthHeader(method, url);
            xhr.setRequestHeader('Authorization', header_request);
        }
        else{
        	ISNLogger.log("we will send a non auth header");
        	var non_authenticationFlag=true;
            xhr.setRequestHeader('NonAuth', non_authenticationFlag);	
        }   
    }
};

BookmarkModel.prototype.sendDataToServer=function(){
    ISNLogger.log("enter send data to server");
    var self=this;
    var dossierID = self.dossierId;
    var url=self.controller.baseURL +"service/dossier.php/"+dossierID;
    var method="POST";
    var myData = {};
    
    if ( dossierID &&
        ((self.dossierTitle && self.dossierTitle.length ) ||
         (self.dossierDescription && self.dossierDescription.length) ||
         (self.dossierImageURL && self.dossierImageURL.length))) {
        if (self.dossierTitle && self.dossierTitle.length) {
            myData.title = self.dossierTitle;
        }
        if (self.dossierDescription && self.dossierDescription.length) { 
                ISNLogger.log('send description to server ' + self.dossierDescription );
            myData.description = self.dossierDescription;
        }
        if (self.dossierImageURL && self.dossierImageURL.length) {
            myData.image = self.dossierImageURL;
        }
        // var data=myData;

        $.ajax({
            url:  url,
            type : method,
            data: myData,
            dataType : 'json',
            success : sentData,
            error : function(request) {
                //localStorage.setItem("pendingCourseList", true);
                ISNLogger.log("Error while sending dossier data to the server");
                ISNLogger.log("ERROR status text: "+ request.statusText); 
                ISNLogger.log("ERROR status code: "+ request.statusCode()); 
                ISNLogger.log("ERROR status code is : " + request.status);
                ISNLogger.log("ERROR responsetext: "+ request.responseText); 
                if (request.status == 401){
                    // access keys have been rejected
                    self.controller.keysRejected();
                }
            },
            beforeSend : setHeader
        });
    }
    
    function sentData(){
        ISNLogger.log("success in sending the data to the server");
        $(document).trigger("dataSuccessfullySent");
        // do nothing, just update the database with the new information
    }
    
    function setHeader(xhr){
        var header_request=self.controller.oauth.oauthHeader(method, url, myData);
        xhr.setRequestHeader('Authorization', header_request);
    }
};

/**
 * Increases the index in the dossiers-item list, which means we move to the next dossier item
 * @prototype
 * @function nextDossierItem
 * @return true if an item with an appropriate index exists, otherwise false
 */
BookmarkModel.prototype.nextItem = function() {
    this.index++;
    ISNLogger.log("this.index in nextItem is "+this.index);
    return (this.index < this.dossierList.length);
};

BookmarkModel.prototype.nextUser = function() {
	ISNLogger.log("user_index before increase is "+this.user_index);
    this.user_index++;
    ISNLogger.log("user_index in nextUseris "+this.user_index);
    ISNLogger.log("userlist length is "+this.userlist.length);
    return  this.user_index < this.userlist.length;
};

BookmarkModel.prototype.hasItem = function(id) {
	ISNLogger.log("enter hasItem");
    var retval = false, i = 0;
    if (this.dossierList && this.dossierList.length && id) {
        for (i; i < this.dossierList.length; i++) {
        	ISNLogger.log("existing library id is "+dossierList[i].digital_library_id);
        	ISNLogger.log("comparable id "+id);
        	
            if ( this.dossierList[i].digital_library_id === id ) {
                retval = true;
                break;
            }
        }
    }
    return retval;
};

/**
 * @method firstItem()
 * 
 * Sets the class' iterator to the first item in the bookmark list.
 */
BookmarkModel.prototype.firstItem = function() {
    this.index=0;	
};

BookmarkModel.prototype.getItemId = function() {
    var self=this;
    ISNLogger.log("this.index in getID is "+this.index);
    ISNLogger.log("dossier list length in id is "+this.dossierList.length);
    return (this.index < this.dossierList.length ) ? this.dossierList[this.index].metadata.id : false;	
};

/**
 * @prototype
 * @function getDossierTitle
 * @return {string}, the title of the dossier item
 */
BookmarkModel.prototype.getTitle = function() {
	if (this.controller.id=="detailembedController"){
        var item_index=this.getItemIndex();
        return (this.index < this.dossierList.length ) ? this.dossierList[item_index].metadata.title : false;	
    }
	return (this.index < this.dossierList.length ) ? this.dossierList[this.index].metadata.title : false;
};


BookmarkModel.prototype.getPublisher = function() {
	if (this.controller.id=="detailembedController"){
        var item_index=this.getItemIndex();
        return (this.index < this.dossierList.length ) ? this.dossierList[item_index].metadata.publisher["name"] : false;	
    }
	return (this.index < this.dossierList.length ) ? this.dossierList[this.index].metadata.title : false;
};

BookmarkModel.prototype.getDate = function() {
	var item_index=this.getItemIndex();
    return (this.index < this.dossierList.length) ? this.dossierList[this.index].metadata.date : false;	
};

//this function is used in detail embed page
BookmarkModel.prototype.getAuthorList = function() {
	var item_index=this.getItemIndex();
	ISNLogger.log("item index is"+item_index);
	ISNLogger.log(" author is "+JSON.stringify(this.dossierList[item_index].metadata.author));
    return (this.index < this.dossierList.length) ? this.dossierList[item_index].metadata.author : false;
};

BookmarkModel.prototype.getDescription = function() {
	// sometimes the item description contains HTML code. In order to strip it from the content, we use a helper div.
	var dtext;
	if (this.index < this.dossierList.length) {
		var dhtml = this.dossierList[this.index].metadata.description;
		ISNLogger.log('description text is: ' + dhtml);
		dtext = $("<div/>", {'html':dhtml}).text();
		ISNLogger.log('description text is: ' + dtext);
	}

    return  dtext;	
};

BookmarkModel.prototype.getDescriptionShort = function(strlen) {
	// sometimes the item description contains HTML code. In order to strip it from the content, we use a helper div.
	var dtext = this.getDescription();
	if ( dtext.length > strlen ) {
		dtext = dtext.slice(0,strlen);
		dtext = dtext + "...";
	}
	
    return  dtext;	
};

BookmarkModel.prototype.getThumbnail = function() {
	if (this.index < this.dossierList.length && 
		this.dossierList[this.index].metadata.image &&
		this.dossierList[this.index].metadata.image.length){
		return this.dossierList[this.index].metadata.image;
	} 
	return "images/default_item_images/default_" +this.getType()+ ".jpg";	
};

BookmarkModel.prototype.getType = function() {
    return (this.index < this.dossierList.length) ? this.dossierList[this.index].metadata.type : "Publication";	
};

BookmarkModel.prototype.getISNURL = function() {
    // return (this.index < this.dossierList.length) ? 'http:\/\/www.isn.ethz.ch\/layout\/set\/pdembed\/Digital-Library\/'+this.dossierList[this.index].metadata.type+'\/Detail\/?lng=en\u0026id='+this.dossierList[this.index].metadata.id: "";
    return (this.index < this.dossierList.length) ? this.dossierList[this.index].metadata.isn_detail_url: "";
};


BookmarkModel.prototype.getEmbedURL = function() {
	itemType= this.getType();
    
    if (itemType === "Publication"){
		//return  'http://yellowjacket.ethz.ch/tools/embedDetailPage.html?id='+ this.getItemId();
		//return  'http://yellowjacket.ethz.ch/tools/embedDetailPage.html?dossier_id='+ dossierListModel.getDossierId() +'&item_id='+this.getItemId();
        return baseURL() + "service/streamtest.php?id="+this.getItemId();
		// return  baseURL() + 'embedDetailPage.html?dossier_id='+ this.dossierId +'&item_id='+this.getItemId();
	}
   
    if ( itemType !== 'Audio') {
        itemType = itemType + 's';
    }
    return 'http:\/\/www.isn.ethz.ch\/layout\/set\/pdembed\/Digital-Library\/'+ itemType +'\/Detail\/?lng=en\u0026id='+this.getItemId();
};

BookmarkModel.prototype.getUsername = function() {
    return (this.user_index < this.userlist.length) ? this.userlist[this.user_index].username: false;	
};

BookmarkModel.prototype.getUsertype = function() {
    return (this.user_index < this.userlist.length) ? this.userlist[this.user_index].user_type: false;	
};

BookmarkModel.prototype.getUserid = function() {
    return (this.user_index < this.userlist.length) ? this.userlist[this.user_index].user_id: false;	
};

//Dossier functions

BookmarkModel.prototype.getDossierID=function(){
	ISNLogger.log("get dossier iD is "+thos.dossierMetadata.id);
    return this.dossierMetadata.id;	
};

BookmarkModel.prototype.getDossierTitle=function(){
    return	 this.dossierMetadata.title;	
};

BookmarkModel.prototype.getDossierDescription=function(){
    ISNLogger.log("this.index in get description is "+this.index);
    return this.dossierMetadata.description;	
};

BookmarkModel.prototype.getDossierImageURL=function(){
    return this.dossierMetadata.image;	
};

BookmarkModel.prototype.setDossierTitle=function(title){
    this.dossierTitle=title;
};

BookmarkModel.prototype.setDossierDescription=function(description){
    ISNLogger.log( 'set description to ' + description);
    this.dossierDescription=description;
};

BookmarkModel.prototype.setDossierImageURL=function(url){
    ISNLogger.log("enter dossier image url");
    this.dossierImageURL=url;
};

BookmarkModel.prototype.reset=function(){
    this.index=0;
};

BookmarkModel.prototype.resetUserIndex=function(){
    this.user_index=0;
};

BookmarkModel.prototype.setIndexToItemId=function(id){
	var index = 0;
	for (index; index < this.dossierList.length;index++){
		if (this.dossierList[index].metadata.id === id ) {
			this.setIndex(index);
			break;
		}
	}
	
    this.index = index;
    ISNLogger.log("index set in bookmark model is "+this.index);
};

BookmarkModel.prototype.setIndex=function(index){
    this.index = index;
    ISNLogger.log("index set in bookmark model is "+this.index);
};

//this will be used in detail embed view to give the metadata for a specific dossier item
// i.e. author, date 
BookmarkModel.prototype.getItemIndex = function(){
	ISNLogger.log("get item index");
	return this.index;
	
	var index_item;
	if (this.controller.id=="detailembedController"){
		for (var index=0; index<this.dossierList.length;index++){
			if (this.dossierList[index].metadata.id === this.controller.getdossierItemId()){
				index_item = index;
			}
		}
	}
	return index_item;
};

BookmarkModel.prototype.showAuthors= function(){
	var self=this;
	var authorList=self.getAuthorList() || [];
	var authorString="";
	for (var i=0; i<authorList.length; i++){
		authorString=authorString + authorList[i] + ", ";
	}
	var finalString=authorString.substring(0,authorString.length-2);
	ISNLogger.log("final string is "+finalString);
	return finalString;
};

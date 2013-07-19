/**
 * Model Functions
 * 
 * 1. addBookmark
 * 2. removeBookmark
 * 3. arrangeDocuments
 * 
 ****/

function BookmarkModel(dController){
    var self=this;
    self.controller=dController;
    this.loaded=false;
    //dossier attributes 
    //this.dossierId=self.controller.getActiveDossier();
    
    // console.log("default dossier is "+this.dossierId);
    
    this.dossierTitle;
    this.dossierDescription;
    this.dossierImageURL;
    
    //dossier items' attributes
    this.dossierData=[];
    this.dossierMetadata=[];
    this.dossierList=[];
    this.dossiers=[];
    this.index=0;
    
    this.editMode=false;
    //load the list of dossier items for the active dossier
    // this.loadDossierList();
    //this.initValues();

    $(document).bind("ActiveDossierReady", loadActiveDossier);
    
    function loadActiveDossier() {
	console.log("load Active Dossier");
	self.dossierId=self.controller.getActiveDossier();
	self.loadDossierList();
    }
};


BookmarkModel.prototype.initValues=function(){
    this.dossierTitle= this.getDossierTitle();
    this.dossierDescription=this.getDossierDescription();
    this.dossierImageURL= this.getDossierImageURL()
}

BookmarkModel.prototype.setEditModeOn=function(){
    this.editMode=true;
}


BookmarkModel.prototype.addItem=function(id){
    console.log("enter addItem in Bookmark Model");
    var self=this;
    var dossierID = self.dossierId || self.controller.getActiveDossier();
    console.log("dossierID in addItem is "+dossierID);
    var url='http://yellowjacket.ethz.ch/tools/service/service2.php/'+ dossierID;
    var method="PUT";
    var pdata= JSON.stringify({'id': id });
    
    console.log( 'addItem: data is ' + pdata);
    if ( dossierID && id ) {
	console.log("before AJAX");
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
	console.log("great the insertion of the bookmark was succesfull");
    }
    
    function error(request) {
	// the server rejected the request!
	console.log("the server rejected the request of adding an item");
	console.log("ERROR status text: "+ request.statusText); 
	console.log("ERROR status code: "+ request.statusCode()); 
	console.log("ERROR status code is : " + request.status);
	console.log("ERROR responsetext: "+ request.responseText); 
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
    var url='http://yellowjacket.ethz.ch/tools/service/service2.php/' + dossierID + '/' + id;
    var method="DELETE";
    
    
    if ( dossierID && id ) {
	$.ajax({
	    url :url,
	    type : method,
	    dataType : 'text',
	    success: success,
	    error:error,
	    beforeSend:setHeader
	});
    }
    
    function success(){
	console.log("success in deleting the dossier item");	
    }

    function error(){
	console.log("error in deleting the dossier item");
    }
    function setHeader(xhr) {
	var header_request=self.controller.oauth.oauthHeader(method, url);
	xhr.setRequestHeader('Authorization', header_request);
    }
    
};

BookmarkModel.prototype.arrangeItem=function(){};


BookmarkModel.prototype.loadDossierList=function(){
    var self=this;
    var data = {};
    
    //var dossierID = this.dossierId;
    var dossierID= self.dossierId;
    var url='http://yellowjacket.ethz.ch/tools/service/service2.php/' + dossierID;
    var method="GET";
    if ( dossierID ) {
	console.log("before executing the ajax request for " + dossierID);
	$.ajax({
	    url:  url,
	    type : 'GET',
	    dataType : 'json',
	    success : createDossierList,
	    error : function(request) {
		//localStorage.setItem("pendingCourseList", true);
		console.log("Error while loading dossier list from server");
		console.log("ERROR status text: "+ request.statusText); 
		console.log("ERROR status code: "+ request.statusCode()); 
		console.log("ERROR status code is : " + request.status);
		console.log("ERROR responsetext: "+ request.responseText); 
		if (request.status === 401){
		    //	window.location.href ="user.html";
		    console.log("received 401, we should load the login page");
		}
	    },
	    beforeSend : setHeader
	});
    }

    function createDossierList(data){
	console.log("success in getting the dossier list");
	var dossierObject;
	try{
	    dossierObject=data;
	}catch(err) {
	    var dossierObject={};
	    console.log("couldnt load dossier items from the database");
	}
	
	var dossierItemMetadata={};
	self.dossierData=dossierObject || {};
	console.log("dossierData are "+JSON.stringify(self.dossierData));
	//self.dossierList=JSON.stringify(self.dossierData['dossier_items']);
	
	self.dossierMetadata=self.dossierData['dossier_metadata'];
	console.log("dossier metadata is "+JSON.stringify(self.dossierMetadata));
	
	self.dossierList=self.dossierData['dossier_items'];
	//console.log("dossierList issssss "+JSON.stringify(self.dossierList));
	if (self.dossierList && self.dossierList.length>0){
	    var itemId= self.dossierList[0]['metadata']['id'];	
	    console.log("dossier item id in success is "+itemId);
	}
	//init values
	
	self.dossierTitle= self.dossierMetadata['title'];
	console.log("dossier title is "+self.dossierTitle);
	self.dossierDescription=self.dossierMetadata['description'];
	self.dossierImageURL=self.dossierMetadata['image'];
	self.dossierId=self.dossierMetadata['id'];
	
	// var stringifiedMetadata = JSON.stringify(dossierMetadata);
	// console.log("metadata is "+stringifiedMetadata);
	
	//self.loaded=true;
	$(document).trigger("BookmarkModelLoaded");
	
    }
    
    function setHeader(xhr) {
	var header_request=self.controller.oauth.oauthHeader(method, url, data);
	xhr.setRequestHeader('Authorization', header_request);
    }
    
};

BookmarkModel.prototype.sendDataToServer=function(){
    console.log("enter send data to server");
    var self=this;
    var dossierID = self.dossierId;
    var url="http://yellowjacket.ethz.ch/tools/service/service2.php/"+dossierID;
    var method="POST";
    
    if ( dossierID &&
	 ((self.dossierTitle && self.dossierTitle.length ) ||
	  (self.dossierDescription && self.dossierDescription.length) ||
	  (self.dossierImageURL && self.dossierImageURL.length))) {
	var myData = {};
	if (self.dossierTitle && self.dossierTitle.length) {
	    myData['title'] = self.dossierTitle;
	}
	if (self.dossierDescription && self.dossierDescription.length) {
            console.log('send description to server ' + self.dossierDescription );
	    myData['description'] = self.dossierDescription;
	}
	if (self.dossierImageURL && self.dossierImageURL.length) {
	    myData['image'] = self.dossierImageURL;
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
		console.log("Error while sending dossier data to the server");
		console.log("ERROR status text: "+ request.statusText); 
		console.log("ERROR status code: "+ request.statusCode()); 
		console.log("ERROR status code is : " + request.status);
		console.log("ERROR responsetext: "+ request.responseText); 
	    },
	    beforeSend : setHeader
	});
    }
    
    function sentData(){
	console.log("success in sending the data to the server");
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
    console.log("this.index in nextItem is "+this.index);
    return this.index < this.dossierList.length;
};


/**
 * Increases the index in the dossiers-item list, which means we move to the next dossier item
 * @prototype
 * @function nextDossierItem
 * @return true if an item with an appropriate index exists, otherwise false
 */
BookmarkModel.prototype.firstItem = function() {
    this.index=0;	
};


BookmarkModel.prototype.getItemId = function() {
    var self=this;
    console.log("this.index in getID is "+this.index);
    console.log("dossier list length in id is "+this.dossierList.length);
    return (this.index < this.dossierList.length ) ? this.dossierList[this.index]['metadata']['id'] : false;	
    //return self.dossierList[this.index]['metadata']['id'];	
};

/**
 * @prototype
 * @function getDossierTitle
 * @return {string}, the title of the dossier item
 */
BookmarkModel.prototype.getTitle = function() {
    return (this.index < this.dossierList.length ) ? this.dossierList[this.index]['metadata']['title'] : false;	
    //return this.dossierList[this.index]['metadata']['title'];	
};


BookmarkModel.prototype.getDate = function() {
    return (this.index < this.dossierList.length) ? this.dossierList[this.index]['metadata']['date'] : false;	
};

BookmarkModel.prototype.getAuthorList = function() {
    return (this.index < this.dossierList.length) ? this.dossierList[this.index]['metadata']['author'] : false;	
};

BookmarkModel.prototype.getDescription = function() {
    return (this.index < this.dossierList.length) ? this.dossierList[this.index]['metadata']['description'] : false;	
};

BookmarkModel.prototype.getThumbnail = function() {
    return (this.index < this.dossierList.length) ? this.dossierList[this.index]['metadata']['image'] : false;	
};

BookmarkModel.prototype.getType = function() {
    return (this.index < this.dossierList.length) ? this.dossierList[this.index]['metadata']['type'] : false;	
};

BookmarkModel.prototype.getISNURL = function() {
    return (this.index < this.dossierList.length) ? this.dossierList[this.index]['metadata']['isn_detail_url'] : false;	
};


//Dossier functions

BookmarkModel.prototype.getDossierID=function(){
    return this.dossierMetadata['id'];	
};

BookmarkModel.prototype.getDossierTitle=function(){
    //return (this.index > this.dossierMetadata.length - 1) ? false :
    return	 this.dossierMetadata['title'];	
    
};

BookmarkModel.prototype.getDossierDescription=function(){
    console.log("this.index in get description is "+this.index);
    //return (this.index > this.dossierMetadata.length - 1) ? false :
    return this.dossierMetadata['description'];	
};

BookmarkModel.prototype.getDossierImageURL=function(){
    return this.dossierMetadata['image'];	
};

BookmarkModel.prototype.setDossierTitle=function(title){
    this.dossierTitle=title;
};

BookmarkModel.prototype.setDossierDescription=function(description){
    console.log( 'set description to ' + description);
    this.dossierDescription=description;
};

BookmarkModel.prototype.setDossierImageURL=function(url){
    console.log("enter dossier image url");
    this.dossierImageURL=url;
};


BookmarkModel.prototype.reset=function(){
    this.index=0;
};


BookmarkModel.prototype.setIndex=function(index){
    this.index=index;
};

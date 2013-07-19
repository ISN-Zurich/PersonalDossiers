/*jslint vars: true, sloppy: true */

// console.log("DLM: parse start!");

function DossierListModel(controller){
	console.log("enter dossier list model");
	var self=this;
	self.controller=controller;
	self.dossierList=[];
	self.activeDossier = -1;
	self.index=0;
	//load the "userProfile" object from Local storage
	//self.loadData();
    
        self.getUserDossiers();

	console.log("initialized dossier list model");
}

//DossierListModel.prototype.loadData = function() {
//	var profileObj=localStorage.getItem("userProfile");
//	
//	if (profileObj){
//		profileObj= JSON.parse(profileObj);
//	}
//	this.profileData=profileObj;
//};

DossierListModel.prototype.reset=function(){
	this.index = 0;
};

DossierListModel.prototype.nextDossier = function(){
	this.index++;
	return this.index < this.dossierList.length;
};

DossierListModel.prototype.listIsPresent=function(){
	return this.dossierList && this.dossierList.length ? true : false;
};

// we should never access the list directly
DossierListModel.prototype.getDossierList=function(){
	return this.dossierList;
};

DossierListModel.prototype.getDossierId = function(){
	if( this.dossierList && this.dossierList.length > 0) {
		return this.dossierList[this.index]['dossier_id'];
	}
};

DossierListModel.prototype.getDossierTitle = function(){
	if( this.dossierList && this.dossierList.length > 0) {
		return this.dossierList[this.index]['title'];
	}
};
	
//DossierListModel.prototype.setActiveDossier = function(dossierId){
//    if( this.dossierList && this.dossierList.length > 0) {
//	this.activeDossier=dossierId;
//	//store in the local storage
//        if (!this.profileData) {
//            this.profileData = {};
//        }
//	this.profileData.activeDossierId=dossierId;
//	var profileString = JSON.stringify(this.profileData);
//	localStorage.setItem("userProfile", profileString);
//	$(document).trigger("ActiveDossierChanged");
//	console.log("local storage after store of active dossier id "+ localStorage.getItem("userProfile"));
//    }
//};

DossierListModel.prototype.getActiveDossier = function(){
    console.log("get active dossier in dossier list model");
    activeDossierId = this.controller.getActiveDossier(); // in the controller: this.models.usermodel.getActiveDossier();
    
    if (activeDossierId) {
	// take the dossier with the smallest ID == DEFAULT ID
	console.log("no active dossier found check for the default! ");
	//this.getDefaultDossierId();
        //end of if !activeDossierId
	this.activeDossier=activeDossierId;
	
	console.log("active dossier should beeeee: "+this.activeDossier);
	return this.activeDossier;
    }
    return undefined;
};


DossierListModel.prototype.getDefaultDossierId = function() {
	var self=this;
	var minId;
	var i;
	if (self.dossierList && self.dossierList.length >0){
		console.log("enter if, list exists");
		for ( i = 0;  i < self.dossierList.length; i++) {
			console.log("enter for " + i);
			if (!minId || self.dossierList[i].dossier_id < minId) {
				console.log("befor set to smaller minId");
				minId = self.dossierList[i].dossier_id;
			}
		}
	}
	console.log("default id is "+ minId);
	activeDossierId = minId;
	// now store the active dossier id to the profile
	var defaultDossierId = minId;
	
	
	// TODO (LATER!) the authentication model requires an event listener 
	// to catch profile updates, so it can store them to the server!

	return defaultDossierId;
};

DossierListModel.prototype.getUserDossiers=function(){
	var self = this;

    var url='http://yellowjacket.ethz.ch/tools/service/dossier.php';
    var method = 'GET';
    console.log( 'request to load dossier list');
    
    if (self.controller.oauth) {
        console.log( 'load dossier list');
	$.ajax({
	    url:  url,
	    type : method,
	    dataType : 'json',
	    success : success,
	    error : function(request) {

		console.log("Error while getting the user dossiers");
		showErrorResponses(request); 
	    },
	    beforeSend : setHeader
	});
    }
    else {
        console.log('the controller lacks the oauth helper!');
    }
    
    function success(data){
	self.dossierList=data;
		
	console.log("dossier list is "+JSON.stringify(self.dossierList));
	console.log("dossier_id is "+JSON.stringify(self.dossierList[0]['dossier_id']));
	
        // inform all dossier views that they need to update
        $(document).trigger('DossierListUpdate'); // for the views
        $(document).trigger("ActiveDossierReady"); //  for the models
    }
    
    
    function setHeader(xhr){

	var header_request=self.controller.oauth.oauthHeader(method, url);
	console.log("oauth header: " + header_request);
	xhr.setRequestHeader('Authorization', header_request);

    }
};



// console.log("DLM: parse end!");

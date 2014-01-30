/*jslint vars: true, sloppy: true */

//ISNLogger.log("DLM: parse start!");

function DossierListModel(controller){
	ISNLogger.log("enter dossier list model");
	var self=this;
	self.controller=controller;
	self.dossierList=[];
	self.activeDossier = -1;
	self.index=0;
	
	self.getUserDossiers();

	//when we add a new dossier, to update the list of dossiers 
	$(document).bind('DossierAdded', function(){
		ISNLogger.log("binded dossierAdded");
		self.getUserDossiers();
	});
	
	ISNLogger.log("initialized dossier list model");
}

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

//we should never access the list directly
DossierListModel.prototype.getDossierList=function(){
	return this.dossierList;
};

DossierListModel.prototype.getDossierId = function(){
	if( this.dossierList && this.dossierList.length > 0) {
		return this.dossierList[this.index].dossier_id;
	}
};

DossierListModel.prototype.getDossierTitle = function(){
	if( this.dossierList && this.dossierList.length > 0) {
		return this.dossierList[this.index].title;
	}
};

DossierListModel.prototype.getDossierDescription = function(){
	if( this.dossierList && this.dossierList.length > 0) {
		return this.dossierList[this.index].description;
	}
};

DossierListModel.prototype.getDossierImage = function(){
	if( this.dossierList && this.dossierList.length > 0) {
		return this.dossierList[this.index].image;
	}
	return undefined;
};

DossierListModel.prototype.getUserTypeOld=function(){
	
	ISNLogger.log("enter getUserType");

	if(this.dossierList && this.dossierList.length > 0) {		
		return this.dossierList[this.index].user_type;
	}
	return undefined;
};



DossierListModel.prototype.getUserType= function(){
	ISNLogger.log("enter get user type");
	var userType="";
	for (var i=0; i <=this.dossierList.length -1; i++){
		ISNLogger.log("i iss "+i);
		if ((this.dossierList[i]["dossier_id"])===this.controller.getActiveDossier()){
			userType=this.dossierList[i]["user_type"];

		}
	}
	ISNLogger.log("userType is "+userType);
	return userType;
};


DossierListModel.prototype.isFollowedDossier = function(){
	ISNLogger.log("enter isFollowedDossier");
	userType=this.getUserTypeOld();
	if (userType == "user"){
		ISNLogger.log("userType is user");
		return true;
	}
	ISNLogger.log("userType is other");
	return false;
	
};

DossierListModel.prototype.getActiveDossier = function(){
	ISNLogger.log("get active dossier in dossier list model");
	activeDossierId = this.controller.getActiveDossier(); // in the controller: this.models.usermodel.getActiveDossier();

	if (activeDossierId) {
		// take the dossier with the smallest ID == DEFAULT ID
		ISNLogger.log("no active dossier found check for the default! ");
		//this.getDefaultDossierId();
		//end of if !activeDossierId
		this.activeDossier=activeDossierId;

		ISNLogger.log("active dossier should beeeee: "+this.activeDossier);
		return this.activeDossier;
	}
	return undefined;
};


DossierListModel.prototype.getDefaultDossierId = function() {
	var self=this;
	var minId=null;
	var i;
	if (self.dossierList && self.dossierList.length >0){
		ISNLogger.log("enter if, list exists");
		for ( i = 0;  i < self.dossierList.length; i++) {
			ISNLogger.log("enter for " + i);
			if (!minId || self.dossierList[i].dossier_id < minId) {
				ISNLogger.log("before set to smaller minId");
				minId = self.dossierList[i].dossier_id;
			}
		}
	}
	ISNLogger.log("default id is "+minId);
	// now store the active dossier id to the profile
	var defaultDossierId = minId;


	// TODO (LATER!) the authentication model requires an event listener 
	// to catch profile updates, so it can store them to the server!

	return defaultDossierId;
};

DossierListModel.prototype.getUserDossiers=function(){

	ISNLogger.log("enter getUserDossiers");
	var self = this;

	var url=self.controller.baseURL +'service/dossier.php';
	var method = 'GET';
	ISNLogger.log( 'request to load dossier list');

	if (self.controller.oauth) {
		ISNLogger.log( 'load dossier list because there is oauth');
		$.ajax({
			url:  url,
			type : method,
			dataType : 'json',
			success : success,
			error : function(request) {

				ISNLogger.log("Error while getting the user dossiers");
				showErrorResponses(request); 
			},
			beforeSend : setHeader
		});
	}
	else {
		//Trigger the activeDossierReady, it will be bound in the bookmark model which in turn
		//will ask the activeDossier in the controller
		$(document).trigger("ActiveDossierReady"); //  for the models  (bookmarkModel)
		ISNLogger.log('the controller lacks the oauth helper! but has a hash key');
	}

	function success(data){
		self.dossierList=data;

		ISNLogger.log("dossier list in dossier LIST MODEL is "+JSON.stringify(self.dossierList));
		ISNLogger.log("dossier_id is "+JSON.stringify(self.dossierList[0].dossier_id));

		// inform all dossier views that they need to update
		$(document).trigger('DossierListUpdate'); // for the models  librarybookmarkModel
		$(document).trigger("ActiveDossierReady"); //  for the models  (bookmarkModel)
	}


	function setHeader(xhr){

		var header_request=self.controller.oauth.oauthHeader(method, url);
		ISNLogger.log("oauth header: " + header_request);
		xhr.setRequestHeader('Authorization', header_request);

	}
};




DossierListModel.prototype.addDossier=function(){
	ISNLogger.log("enter addDossier in Bookmark Model");
	var self=this;

	var url= self.controller.baseURL +'service/dossier.php/' ;
	var method="PUT";


	ISNLogger.log("before AJAX");
	$.ajax({
		url :url,
		type : method,
		dataType : 'json',
		success: success,
		error:error,
		beforeSend:setHeader
	});

	function success(){
		// great! well done!
		ISNLogger.log("great the insertion of the dossier was succesfull");
		$(document).trigger('DossierAdded'); 
	}

	function error(request) {
		// the server rejected the request!
		ISNLogger.log("the server rejected the creation of a new dossier");
		ISNLogger.log("ERROR status text: "+ request.statusText); 
		ISNLogger.log("ERROR status code: "+ request.statusCode()); 
		ISNLogger.log("ERROR status code is : " + request.status);
		ISNLogger.log("ERROR responsetext: "+ request.responseText); 
	}

	function setHeader(xhr){
		var header_request=self.controller.oauth.oauthHeader(method, url);
		xhr.setRequestHeader('Authorization', header_request);
	}
};


//ISNLogger.log("DLM: parse end!");

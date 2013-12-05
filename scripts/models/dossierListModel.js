/*jslint vars: true, sloppy: true */

//console.log("DLM: parse start!");

function DossierListModel(controller){
	console.log("enter dossier list model");
	var self=this;
	self.controller=controller;
	self.dossierList=[];
	self.activeDossier = -1;
	self.index=0;
	
	self.getUserDossiers();

	//when we add a new dossier, to update the list of dossiers 
	$(document).bind('DossierAdded', function(){
		console.log("binded dossierAdded");
		self.getUserDossiers();
	});
	
	console.log("initialized dossier list model");
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
	
	console.log("enter getUserType");

	if(this.dossierList && this.dossierList.length > 0) {		
		return this.dossierList[this.index].user_type;
	}
	return undefined;
};



DossierListModel.prototype.getUserType= function(){
	console.log("enter get user type");
	console.log("active dossier is "+this.controller.getActiveDossier());
	console.log("dossier list in THIS MODEL is"+this.dossierList);
//	myArray=new Array();
//	$.each(this.dossierList, function(key, value) { 
//	  myArray.push(value);
//	});
//	console.log("my ARRAY IS "+myArray);
//	console.log("THRID dos id ITEM IN MY ARRAY "+JSON.parse(myArray[2]["dossier_id"]));
	console.log("raw user type " +this.dossierList[0]["user_type"]);
	console.log("stringified user type " +JSON.stringify(this.dossierList[1]["user_type"]));
	var userType="";
	console.log("dossier list length "+ this.dossierList.length);
		for (var i=0; i <=this.dossierList.length -1; i++){
		//console.log("dossier id for current items is "+this.dossierList[i]['dossier_id']);
			console.log("i iss "+i);
		if ((this.dossierList[i]["dossier_id"])===this.controller.getActiveDossier()){
			userType=this.dossierList[i]["user_type"];
		
		}
	}
		console.log("userType is "+userType);
	return userType;
};


DossierListModel.prototype.isFollowedDossier = function(){
	console.log("enter isFollowedDossier");
	userType=this.getUserTypeOld();
	if (userType == "user"){
		console.log("userType is user");
		return true;
	}
	console.log("userType is other");
	return false;
	
};

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
	var minId=null;
	var i;
	if (self.dossierList && self.dossierList.length >0){
		console.log("enter if, list exists");
		for ( i = 0;  i < self.dossierList.length; i++) {
			console.log("enter for " + i);
			if (!minId || self.dossierList[i].dossier_id < minId) {
				console.log("before set to smaller minId");
				minId = self.dossierList[i].dossier_id;
			}
		}
	}
	console.log("default id is "+minId);
	// now store the active dossier id to the profile
	var defaultDossierId = minId;


	// TODO (LATER!) the authentication model requires an event listener 
	// to catch profile updates, so it can store them to the server!

	return defaultDossierId;
};

DossierListModel.prototype.getUserDossiers=function(){

	console.log("enter getUserDossiers");
	var self = this;

	var url=self.controller.baseURL +'service/dossier.php';
	var method = 'GET';
	console.log( 'request to load dossier list');

	if (self.controller.oauth) {
		console.log( 'load dossier list because there is oauth');
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
		//Trigger the activeDossierReady, it will be bound in the bookmark model which in turn
		//will ask the activeDossier in the controller
		$(document).trigger("ActiveDossierReady"); //  for the models  (bookmarkModel)
		console.log('the controller lacks the oauth helper! but has a hash key');
	}

	function success(data){
		self.dossierList=data;

		console.log("dossier list in dossier LIST MODEL is "+JSON.stringify(self.dossierList));
		console.log("dossier_id is "+JSON.stringify(self.dossierList[0].dossier_id));

		// inform all dossier views that they need to update
		$(document).trigger('DossierListUpdate'); // for the models  librarybookmarkModel
		$(document).trigger("ActiveDossierReady"); //  for the models  (bookmarkModel)
	}


	function setHeader(xhr){

		var header_request=self.controller.oauth.oauthHeader(method, url);
		console.log("oauth header: " + header_request);
		xhr.setRequestHeader('Authorization', header_request);

	}
};




DossierListModel.prototype.addDossier=function(){
	console.log("enter addDossier in Bookmark Model");
	var self=this;

	var url= self.controller.baseURL +'service/dossier.php/' ;
	var method="PUT";


	console.log("before AJAX");
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
		console.log("great the insertion of the dossier was succesfull");
		$(document).trigger('DossierAdded'); 
	}

	function error(request) {
		// the server rejected the request!
		console.log("the server rejected the creation of a new dossier");
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


//console.log("DLM: parse end!");

function addBookmark(controller){
	ISNLogger.log("enter addBookmark.js");
	var self=this;
	var controller=controller;
		
	$("#insertItem").bind("click", clickHandler);
	
	function clickHandler(){
		ISNLogger.log("clicked on the submit button");
		var dossierItemId= $('input#inputValue').val();
		ISNLogger.log("got the input value and it is "+dossierItemId);
		var bookmarkModel=controller.models["bookmark"];
		bookmarkModel.addItem(dossierItemId);
	}
	this.open();
};


function addBookmark(controller){
	console.log("enter addBookmark.js");
	var self=this;
	var controller=controller;
		
	$("#insertItem").bind("click", clickHandler);
	
	function clickHandler(){
		console.log("clicked on the submit button");
		var dossierItemId= $('input#inputValue').val();
		console.log("got the input value and it is "+dossierItemId);
		var bookmarkModel=controller.models["bookmark"];
		bookmarkModel.addItem(dossierItemId);
	}
	this.open();
};


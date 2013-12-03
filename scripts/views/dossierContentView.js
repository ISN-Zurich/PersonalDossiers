/***
 * Design the overview page of the dossier.

 * This contains the list of the items of the dossier (publication, audio, video, articles)
 * */

/*jslint vars: true, sloppy: true */
function DossierContentView(dController){
	var self=this;
	self.controller=dController;
	self.tagID = 'contentArea';

	self.deleteMode = 0;
	$(document).bind("click", deleteClickHandler);
	$(window).bind("click", function(){
		// rescue click to cancel a delete request
		if (self.deleteMode > 0) {
			$('#delete-confirm-'+self.deleteMode).hide();
			$('#delete-'+self.deleteMode).show();
			self.deleteMode = 0;
		}
	});
	
	$(window).bind('keydown', function(e){
		if (e.keyCode === 27 && self.deleteMode > 0) {
			$('#delete-confirm-'+self.deleteMode).hide();
			$('#delete-'+self.deleteMode).show();
			self.deleteMode = 0;
		}
	});
	
	function deleteClickHandler(e) {
		var targetE = e.target;
		var targetID = targetE.id;
		if($(targetE).hasClass("deleteButton") ) {
			self.deleteMode = true;
			var myID = targetID.substring(7);
			self.deleteMode = myID;
			$(targetE).hide();
			$("#delete-confirm-" + myID).show();
			e.stopPropagation();
		}
		else if ($(targetE).hasClass("deleteConfirmButton")) {
			// get rid off the element 
			var myIDf = targetID.substring(15);
			self.removeItem(myIDf);
			self.deleteMode = 0;
			e.stopPropagation();
		}
	}
	
	
	$("#pd_footer_gen").bind("click", function(){
			window.open(
				  'http://yellowjacket.ethz.ch/tools/index.html',
				  '_blank' 
				);
	});
	
	 $('#editDossier').bind('click', function(){
		 // 1. display the grey sortable icon next to the titles of the items
		 // self. showDraggableIcon();
		 
		 // 2 enable sortability
		 self.activateSorting();		 
	 
	 
	 
	 });
	 
	 $('#lock-editDossier').bind('click', function(){
		 // 1.store the positioning of the items
		 self.storeOrder();
		 
		 // 2. remove the sortability from the list
		 $( "#sortable" ).sortable( "disable" );
		 
		 // 3. remove the grey sortable icon from the titles of the items
	 });
	
} //end of constructor


/**
 * opens the view
 * @prototype
 * @function openDiv
 **/ 
DossierContentView.prototype.openDiv = openView;

DossierContentView.prototype.open = function() {
	this.update();

	this.openDiv();
};


DossierContentView.prototype.update = function(){
	
	var self=this;
	
	$("#contentArea").empty();
    //TODO: only if we are loggedIn to display the logout button
    if (self.controller.oauth){
        $("#delete").removeClass("hidden");
        $('#findinformation').removeClass("hidden");
        $('#shareButton').removeClass("hidden");
    }

    if (self.controller.hashed){
         $('#loginButtonLink').removeClass("hidden");
    }
    console.log("open dossier list view");
    this.renderList();
	
};


DossierContentView.prototype.renderList = function() {
	
	var bookmarkModel = self.controller.models.bookmark;
	console.log("dossier list length in dossier content view "+bookmarkModel.dossierList.length);
	
	var iFrameHeight= window.innerHeight || document.documentElement.clientHeight;


	if (bookmarkModel.dossierList && bookmarkModel.dossierList.length > 0) {
	
		var divContainer=$("<ul/>", {
			"id": "sortable",
		}).appendTo("#contentArea");
		
		console.log("dossier list index is "+bookmarkModel.index);
		for (bookmarkModel.index=0; bookmarkModel.index < bookmarkModel.dossierList.length; bookmarkModel.index++){
			this.renderItem();
			bookmarkModel.setIndex(bookmarkModel.index++);
		}
		//	do{
		//	this.renderItem();	
		//	}while (bookmarkModel.nextItem());
		//	}while (bookmarkModel.index<bookmarkModel.dossierList.length);
	} else{
		//if the specific dossier has no dossier items
		console.log("the dossier has no dossier items");
		var div=$("<div/>", {
	    	"id":"noContent"
	        }).appendTo("#contentArea");
		var p=$("<p/>", {
	    	"text": "Your Dossier has no items. You can add items  to the personal dossier if you go to http://isn.ethz.ch/. In there, under both the dossiers and the digital library menus there are various content items. If you enter in the ones you are interested in you will see an addBookmark button on the right side. By clicking on it, this item will be added to your active dossier"
	        }).appendTo(div);
	}
	
	if (self.controller.id ==="embedController"){
		var bannerHeight= $("#bannerArea").height();
		var footerHeight = $("#pd_footer_gen").height();
		var totalHeight = bannerHeight + footerHeight ;	// we add 176 px for the image that might be still on its way
		var contentAreaHeight=iFrameHeight - totalHeight;
		$("#contentArea").css("height",contentAreaHeight+"px" );
	}
	
	
   // self.activateSorting();
  	
};


DossierContentView.prototype.activateSorting = function(){
	
	//make the list sortable
	$( "#sortable" ).sortable({
		placeholder : "placeholder",
		forcePlaceholderSize:true,		
		//placeholder: "ui-state-highlight"
		start : function(event,ui) {
			$(ui.item).addClass("currentSortedItem");
			
		},
		stop : function(event,ui) {
			(ui.item).removeClass("currentSortedItem");
		}
	});
    $( "#sortable" ).disableSelection();
};

DossierContentView.prototype.renderItem = function() {
	//var self=this;

	var bookmarkModel = self.controller.models.bookmark;
	
	console.log("enter render Item");
	var	dossierID = self.controller.models.bookmark.getItemId();
	console.log("dossier item id is"+dossierID);
	
	var div1=$("<li/>", {
		"id": "item"+dossierID, 
		"class" : "ui-state-default featured2 hideOT dossier_item "
	}).appendTo("#sortable");
	
	var divFloat=$("<div/>", {
		"class" : "floatleft"
	}).appendTo(div1);
	
	var divA=$("<a/>", {
		"href":bookmarkModel.getISNURL()
	}).appendTo(divFloat);
	
	img=$("<img/>", {
		"class" : "floatleft",
		"src": bookmarkModel.getThumbnail(),
		"width":"80",
		"height":"60"
	}).appendTo(divA);
	
	var divFloatText=$("<div/>", {
		"class" : "floatleft overviewcontent dossier_text"
	}).appendTo(div1);
	
	var divh1=$("<h1/>", {	}).appendTo(divFloatText);
	
	// if we are not in the embedded page display the isn url
	// if we are in the embed page, but if the dossier item type is different than publication display also the isn url
	
	if (self.controller.id!=="embedController" || bookmarkModel.getType() !== "Publication"){
		divAText=$("<a/>", {
			"class": "header1",
			"href":bookmarkModel.getISNURL(), 
			text:bookmarkModel.getTitle()
		}).appendTo(divh1);
	} else{
		//if we are in the big embed view we need to open also a view that contains the header of the
		//detailed embede for back and forth navigation
		divA=$("<a/>", {
			"class": "header1",
			"href":bookmarkModel.getEmbedURL(), 
			text:bookmarkModel.getTitle()
		}).appendTo(divh1);
		
	}
	 divp1=$("<p/>", {
		"class":"small",
		text:bookmarkModel.getDate()+"/"+bookmarkModel.getType() 
	}).appendTo(divFloatText);
	
	 desContainer=$("<div/>", {
			"class":"pd_box",
	 }).appendTo(divFloatText);
	 
	divp2=$("<p/>", {
		"id":"itemDescription"+dossierID,
		"class":"text",
		text:bookmarkModel.getDescription()
	}).appendTo(desContainer);
	

    if (self.controller.oauth){
    	
    	if (self.controller.id!=="embedController"){
    		div3 = $("<div/>", {
    			"class":"deletecontainer"
    		}).appendTo(divFloatText);

    		delButton = $("<div/>", {
    			"id": "delete-"+ dossierID,
    			"text": "Delete",
    			"class": "deleteButton"
    		}).appendTo(div3);

    		delConfirmButton = $("<div/>", {
    			id: "delete-confirm-" + dossierID,
    			text: "Really delete?",
    			"class": "deleteConfirmButton"
    		}).appendTo(div3);
    	}}

	
};
/**
 *	In this function we delete a dossier item by performing two tasks
 *	1. Remove its visual representation
 *	2. Actual remove it by deleting the data from the database
 */

DossierContentView.prototype.removeItem=function(id){
	var bookmarkModel = self.controller.models.bookmark;
	//call the model removeBookmark()
	bookmarkModel.removeItem(id);	
	// remove the visuals
	$("#item"+id).remove();
};


DossierContentView.prototype.arrangeItem=function(id){
	
};

/**stores the current sorting order in the bookmark model
 * @prototype
 * @function storeOrder
 **/
DossierContentView.prototype.storeOrder = function() {
	
	console.log("enter store Order");
	var orderList = new Array();

	$("#sortable").find("li.ui-state-default").each(function(index) {
		var id = $(this).attr("id").substring(4);
		orderList.push(id);
	});
	controller.models["bookmark"].setOrder(orderList);
};


DossierContentView.prototype.showDraggableIcon = function(){};

/**
 * closes the view
 * @prototype
 * @function closeDiv
 **/ 
DossierContentView.prototype.closeDiv = closeView;


/**
 * empties the course list
 * @prototype
 * @function close
 **/ 
DossierContentView.prototype.close = function() {
	moblerlog("close course list view");
	this.active = false;
	this.closeDiv();
	$("#contentArea").empty();
};

	

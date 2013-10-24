


function ShareButtonView(controller){
    console.log("enter sharebuttonView");
    var self=this;
    self.controller=controller;
    self.tagID="#shareButton";
    this.open();
    $("#st_facebook").attr("href", "http://www.google.com/");
    	
	$("#st_facebook").bind("click", function(e){
		console.log("click facebook button in ");
		var bookmarkModel=self.controller.models['bookmark'];
		var shared_title=encodeURIComponent(bookmarkModel.getDossierTitle());
		var shared_url=encodeURIComponent(self.getPublicLink());
		var shared_description=encodeURIComponent(bookmarkModel.getDossierDescription());
		
		var whole_image_string=window.location.href;
		var trim_url=whole_image_string.substring(0, whole_image_string.indexOf('index.html'));
		console.log("trimed url is "+trim_url);
		
		var shared_image= encodeURIComponent(trim_url+'/'+bookmarkModel.getDossierImageURL());
		console.log("sharedimage is "+shared_image);

		window.open('http://www.facebook.com/sharer.php?s=100&p[title]='+ shared_title + '&p[summary]=' + shared_description + '&p[url]=' + shared_url + '&p[images][0]='+shared_image, 
				 'facebook-share-dialog', 
				 'width=626,height=436'		
		);
		
	});
    
}



ShareButtonView.prototype.openDiv=openView;

ShareButtonView.prototype.open = function(){

    this.update();

};

ShareButtonView.prototype.update = function(){

  
     var self=this;
    $('#shareButton').empty();
    console.log("design dynamically share button");
    var p = $("<p/>", {
        "id":"shareBtn",
        "class": "bold active clickable",
        "text": "Share"
    }).appendTo("#shareButton");

    var divContainer =  $("<div/>", {
         "id":"divContainer",
        "class":"hidden"
    }).appendTo("#shareButton");

    var input = $("<input/>", {
        "id":"shareArea",
        "name":"shareArea",
        "width":"150px",
        "checked":"checked",
        "value": self.getPublicLink()
    }).appendTo("#divContainer");

  /* var div=  $("<span/>", {
          "id": "copyLink",
          "text": "Copy Link"
      }).appendTo("#divContainer");
      */

      var div=  $("<span/>", {
     "id": "closeUrl",
     "text": "remove"
     }).appendTo("#divContainer");
   
};


ShareButtonView.prototype.close = function(){


};

ShareButtonView.prototype.createShareLink = function() {
    var self=this;
    console.log("enter createShareLink");
    $("#divContainer").removeClass("hidden");
    $('#shareArea').select();


    $(document).bind("click", function(e) { //add id dynamically
        console.log("target id is "+ e.target.id);
        if ( e.target.id === "copyLink" ) {
            console.log("clicked copy link button");
          self.copyLink();
        }
    });

    $(document).bind("click", function(e) { //add id dynamically
        console.log("target id is "+ e.target.id);
        if ( e.target.id === "closeUrl" ) {
            console.log("clicked close url");
             $("#divContainer").addClass("hidden");
        }
    });
 };


ShareButtonView.prototype.getPublicLink=function(){

    var self=this;
    var url= window.location.href;
    if (self.controller.hashed){
        var hashedUrl= url;
    }
    else{
        var hashedUrl= url + "#" + this.controller.getActiveDossier();
        console.log("hashedUrl so far is "+hashedUrl);
    }
  return hashedUrl;

};


ShareButtonView.prototype.copyLink= function(){
    if( window.clipboardData && clipboardData.setData ) {
        console.log(" has window clipboard data ");
    }
    if( document.clipboardData && document.clipboardData.setData ) {
        console.log(" has document clipboard data ");
    }
    if ( window.ClipboardEvent) {
        var copyEvent = new ClipboardEvent('copy', { bubbles: true, cancelable: true, dataType: 'text/plain', data: self.getPublicLink() } );
        document.dispatchEvent(copyEvent);
    }
};
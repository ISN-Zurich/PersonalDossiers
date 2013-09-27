/*jslint vars: true, sloppy: true */


function ShareButtonView(controller){
    console.log("enter sharebuttonView");
    var self=this;
    self.controller=controller;
    self.tagID="#shareButton";
    this.open();
  
   $(document).bind("click", function(e) { //add id dynamically
        console.log("click share button before the if");
        console.log("target id is "+ e.target.id);
        if ( e.target.id === "shareBtn" ) {
            console.log("clicked share button");
             self.createShareLink();
        }
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
    p = $("<p/>", {
        "id":"shareBtn",
        "class": "bold active clickable",
        "text": "Share"
    }).appendTo("#shareButton");

    divContainer =  $("<div/>", {
         "id":"divContainer",
        "class":"hidden"
    }).appendTo("#shareButton");

    input = $("<input/>", {
        "id":"shareArea",
        "name":"shareArea",
        "width":"150px",
        "checked":"checked",
        "value": self.getPublicLink()
    }).appendTo("#divContainer");

   div=  $("<span/>", {
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
        hashedUrl= url;
    }
    else{
        hashedUrl= url + "#" + this.controller.getActiveDossier();
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



function ShareButtonView(controller){
    console.log("enter sharebuttonView");
    var self=this;
    self.controller=controller;
    self.tagID="#shareButton";
    this.open();
    //$("#shareButton").bind("click", function(){
    //console.log("clicked the share button");
    //create the public link and display it
    //self.createShareLink();
  //  });



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
    var p = $("<p/>", {
        "id":"shareBtn",
        "class": "bold active clickable",
        "text": "Share"
    }).appendTo("#shareButton");

    var input = $("<input/>", {
        "id":"shareArea",
        "name":"shareArea",
        "class":"hidden",
        "width":"210px",
        "value": self.getPublicLink()
    }).appendTo("#shareButton");

      var div=  $("<div/>", {
          "id": "copylink",
          "class": "hidden",
          "text": "Copy Link"
      }).appendTo("#shareButton");

};


ShareButtonView.prototype.close = function(){


};

ShareButtonView.prototype.createShareLink = function() {
    $("#shareArea").removeClass("hidden");
    $("#copyLink").show();

    $(document).bind("click", function(e) { //add id dynamically
        console.log("click copy link");
        console.log("target id is "+ e.target.id);
        if ( e.target.id === "copyLink" ) {
            console.log("clicked copy link button");
          //  self.copyLink();
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
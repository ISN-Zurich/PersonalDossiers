
function LoginButtonView(controller){
    console.log("enter login button view");
    var self=this;
    self.controller=controller;
    self.tagID="loginButtonLink";
    this.open();
    $("#loginButtonLink").bind("click", function(){
        console.log("clicked the login button on the list");
        window.location.href = 'user.html';
    });

}

LoginButtonView.prototype.openDiv=openView;

LoginButtonView.prototype.open = function(){

    this.update();

};

LoginButtonView.prototype.update = function(){
    $('#loginButtonLink').empty();
    console.log("design dynamically the login button on the list");
    var p = $("<p/>", {
        "class": "bold active clickable",
        "text": "Login"
    }).appendTo("#loginButtonLink");

};

LoginButtonView.prototype.close = function(){
    //2. Verstecken den Logout Button

};

/**
 * This view decides what tab sub module to display on the interaction bar:
 * - the Li for login
 * - the Lo for logout
 *
 *
 * */

function LogView(controller){
    ISNLogger.log("enter logView constructor");
    var self=this;
    self.controller=controller;
    this.tagID='logView';
    this.logView = null;
    //this.open();
    this.update();

    $(document).bind('UserProfileUpdate', function(){
        ISNLogger.log("caught user profile update in log view");
        self.update();
        $("#logView").removeClass("disable");
    });

    $("#logView").bind('click', function(){

        ISNLogger.log("click logout button");
        if(!$("#st_logout_confirm").is(':visible')){

            // $("#st_user").removeClass("pd_sb_icon");
            // $("#st_dossiers").removeClass("pd_sb_icon");
            // $("#logView").addClass("pd_sb_icon");
            $("#st_logout_confirm").removeClass("hide");
        } else {

            $("#st_logout_confirm").addClass("hide");
        }
    });

    $("#cancelLogoutButton").bind('click', function(){
        ISNLogger.log("click logout confirm button");
        $("#st_logout_confirm").addClass("hide");
    });

    $("#confirmLogoutButton").bind('click', function(){
        ISNLogger.log("click logout confirm button");
        self.controller.logout();
    });
}

LogView.prototype.openDiv = openView;

LogView.prototype.open = function(){

    this.update();
    this.openDiv();
};

LogView.prototype.update = function(){

    $("#" + this.tagID).attr('title', this.controller.isAuthenticated() ? 'Logout' : 'Login');
};


LogView.prototype.closeDiv = closeView;

LogView.prototype.close = function(){

    $("#st_logout_confirm").addClass("hide");
    this.closeDiv();
};


//LogView.prototype.update = function(){
//  var self=this;
//  ISNLogger.log("enter open logView");
//  if (self.controller.oauth){
//      ISNLogger.log("we are authenticated, we will show the logout btn");
//      this.showLogout();
//  } else {
//      ISNLogger.log("we are not authenticated, we will show the login btn");
//      this.showLogin();
//  }
//};
//
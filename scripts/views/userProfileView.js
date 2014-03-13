/*jslint vars: true, sloppy: true */
/**
* User Profile View
 */
function userProfileView(controller){

    ISNLogger.log("enter user profile view");
    var self=this;
    self.controller=controller;
    self.tagID="userProfile";
    self.editMode=false;

    //remove the warning messages when start typing again
    $("#pd_newPassword").bind("click", function(e){

        ISNLogger.log("click change password container");
        if (!$("#warning_empty").hasClass("hide")){

            $("#warning_empty").addClass("hide");
        }
        if (!$("#warning_confirm").hasClass("hide")){

            $("#warning_confirm").addClass("hide");
        }
    });


//  $("#pd_confirm_newPassword").bind("click", function(e){
//      ISNLogger.log("click change password container");
//      if (!$("#warning_empty").hasClass("hide")){
//          $("#warning_empty").addClass("hide")
//      }
//
//      if (!$("#warning_confirm").hasClass("hide")){
//          $("#warning_confirm").addClass("hide")
//      }
//  });

    $("#edit_profile").bind("click", function(e){

        ISNLogger.log("clicked the edit user profile button");

        //clear the background for the confirmated password
        $("#pd_confirm_password_label").css('background-color', '#ebedee');
        $("#pd_confirm_password_label").css('color', '#4C5160');

        //close the edit password sub view
        $("#changePasswordContainer").addClass('hide');
        $("#userProfileContainer").removeClass('hide');

        $("#edit_password").css('color', '#4c5160');
        $("#titleInput").attr('contenteditable', 'true');
        $("#nameInput").attr('contenteditable', 'true');
        //$("#emailInput").attr('contenteditable', 'true');
        $("#saveChanges_container").removeClass('hide');

        //$(this).addClass('pd_profile_selected');
        $(this).css('color', '#0089CF');
        self.editMode = true;
    });

    $("#save_changes_submit").bind("click", function(e){

        ISNLogger.log("click save changes before if");
        if (self.editMode){

            ISNLogger.log("clicked the save changes  button");
            self.saveChanges();
            self.controller.models.user.sendUserProfileToServer();
            $("#titleInput").attr('contenteditable', 'false');
            $("#nameInput").attr('contenteditable', 'false');
            $("#emailInput").attr('contenteditable', 'false');
            $("#saveChanges_container").addClass('hide');
            self.editMode=false;
        }
    });

    $("#edit_password").bind("click", function(e){

        //clear the background for the confirmated password
        $("#pd_email_label").css('background-color', '#ebedee');
        $("#pd_email_label").css('color', '#4C5160');
        $("#pd_title_label").css('background-color', '#ebedee');
        $("#pd_title_label").css('color', '#4C5160');
        $("#pd_name_label").css('background-color', '#ebedee');
        $("#pd_name_label").css('color', '#4C5160');

        //make uneditable the user profile fields
        $("#titleInput").attr('contenteditable', 'false');
        $("#nameInput").attr('contenteditable', 'false');
        $("#emailInput").attr('contenteditable', 'false');


        $("#edit_profile").css('color', '#4c5160');
        ISNLogger.log("clicked the edit password button");
        $("#pd_newPassword").attr('contenteditable', 'true');
        $("#pd_confirm_newPassword").attr('contenteditable', 'true');
        self.showPasswordForm();
        $("#userProfileContainer").addClass('hide');
        $("#saveChangesPswd_container").removeClass('hide');
        $(this).css('color', '#0089CF');
        self.editMode = true;
    });

    $("#save_password_submit").bind("click", function(e){

        ISNLogger.log("click save changes before if");
        if (self.editMode){

            ISNLogger.log("clicked the save changes  button");
            self.savePasswordChanges();
        }
    });


    $("#titleInput").focusout(function(){

        ISNLogger.log("focused out title input");
        if (self.editMode){

            var value_title = $("#titleInput").text();
            self.controller.models.user.setUserTitle(value_title);
            self.controller.models.user.sendUserProfileToServer();
            //add a bluesih background to the edit fields
            $("#pd_title_label").css('background-color', '#0089CF');
            $("#pd_title_label").css('color', '#fff');
        }
    });

    $("#nameInput").focusout(function(){

        ISNLogger.log("focused out name input");
        if (self.editMode){

            var value_name = $("#nameInput").text();
            self.controller.models.user.setName(value_name);
            self.controller.models.user.sendUserProfileToServer();
            //add a bluesih background to the edit fields
            $("#pd_name_label").css('background-color', '#0089CF');
            $("#pd_name_label").css('color', '#fff');
        }
    });


/*
    $("#emailInput").focusout(function(){

        ISNLogger.log("focused out email input");
        if (self.editMode){

            var value_email = $("#emailInput").text();
            var currentPassword= self.controller.models.user.getPassword();
            ISNLogger.log("currentpassword is "+currentPassword);
            self.controller.models.user.setUserEmail(value_email, currentPassword);
            self.controller.models.user.sendUserProfileToServer();
            //we need to send and store in the database the new password based on the new email
            $("#pd_email_label").css('background-color', '#0089CF');
            $("#pd_email_label").css('color', '#fff');
        }
    });
*/


    $("#pd_confirm_newPassword").keyup(function(e){
        ISNLogger.log("enter focus in confirm password field");
        if (self.editMode){

            var new_password = $("#pd_newPassword").text();
            var confirm_password = $(this).text();

            if (confirm_password.length == 0){
                ISNLogger.log("confirm password is empty");
                $("#pd_confirm_password_label").css('background-color', '#ebedee');
                $("#pd_confirm_password_label").css('color', '#4C5160');
            }

            if (new_password !== confirm_password){
                $("#pd_confirm_password_label").css('background-color', 'red');
                $("#pd_confirm_password_label").css('color', '#fff');
            }

            if (new_password == confirm_password){
                $("#pd_confirm_password_label").css('background-color', '#0089CF');
                $("#pd_confirm_password_label").css('color', '#fff');
            }

        }
    });
} //end of constructor


userProfileView.prototype.openDiv = openView;


userProfileView.prototype.open = function(){

    ISNLogger.log("enter open in user profile view");
    this.update();
    this.openDiv();
};


userProfileView.prototype.update = function(){

    var self=this;
    ISNLogger.log("enter update user profile view");

    //self.controller.activeView=self.controller.views.user;
    $("#profileViewContainer").removeClass("hide");

    var userModel=self.controller.models.user;
    if (userModel.userProfile) {

        $("#titleInput").text(userModel.getTitle());
        $("#nameInput").text(userModel.getName());
        $("#emailInput").text(userModel.getEmail());
    }

};


userProfileView.prototype.saveChanges = function(){

    var value_title = $("#titleInput").text();
    this.controller.models.user.setUserTitle(value_title);
    var value_name = $("#nameInput").text();
    this.controller.models.user.setUserName(value_name);
    var value_email = $("#emailInput").text();
    this.controller.models.user.setUserEmail(value_email);
    $("#successful_message1").fadeIn();
    $("#successful_message1").fadeOut(5000);
};


userProfileView.prototype.showPasswordForm = function(){

    var self = this;
    userModel = self.controller.models.user;
    $("#userProfileContainer").addClass("hide");
    $("#warning_empty").addClass("hide");
    $("#warning_confirm").addClass("hide");
    $("#changePasswordContainer").removeClass("hide");
    $("#pd_currentPassword").text(userModel.getPassword());
};

userProfileView.prototype.savePasswordChanges= function(){

    ISNLogger.log("enter save password changes");
    var new_password = $("#pd_newPassword").text();
    var current_mail=this.controller.models.user.getEmail();
    var form_validation=true;
    var confirm_password = $("#pd_confirm_newPassword").text();

    if (new_password.length == 0 || confirm_password.length ==0) {

        // one or both of the input password fields are empty
        $("#warning_empty").fadeIn();
        $("#warning_empty").fadeOut(5000);
        form_validation=false;
    }

    if (new_password !== confirm_password){

        $("#pd_confirm_password_label").css('background-color', 'red');
        $("#pd_email_label").css('color', '#fff');
        $("#warning_confirm").fadeIn();
        $("#warning_confirm").fadeOut(5000);
        form_validation=false;
    }

    if (new_password == confirm_password){

        $("#pd_confirm_password_label").css('background-color', '#0089CF');
        $("#pd_email_label").css('color', '#fff');
    }


    if (form_validation){

        ISNLogger.log("passed the form validation");
        this.controller.models.user.sendUserPasswordToServer(new_password,current_mail);
        $("#pd_newPassword").attr('contenteditable', 'false');
        $("#pd_confirm_newPassword").attr('contenteditable', 'false');
        $("#saveChangesPswd_container").addClass('hide');
        $("#successful_message2").fadeIn();
        $("#successful_message2").fadeOut(5000);
        self.editMode=false;
    }
};


userProfileView.prototype.closeDiv=closeView;


userProfileView.prototype.close=function(){

    //close the button on the right side
    $("#profileViewContainer").addClass("hide");

    //close the content area that contains the user data
    this.closeDiv();
};
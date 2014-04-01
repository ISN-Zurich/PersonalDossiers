/*jslint vars: true, sloppy: true */

function RegistrationView(controller){
    var self=this;
    self.controller=controller;
    self.tagID="registrationView";
    self.userModel= self.controller.models.user;



    $(document).bind('EmailAlreadyTaken', function(){
        ISNLogger.log("bound email already taken registration view");
        $("#emailRegistrationInput").hide();
        $("#existing_mail").show();

        $("#pd_registration_email_label").css('background-color', 'red');
        $("#pd_registration_email_label").css('color', '#fff');
    });


    $(document).bind('NameEmpty', function(){
        ISNLogger.log("bound name empty d in registration view");
        $("#nameRegistrationInput").hide();
        $("#empty_name").show();
    });


    $(document).bind('EmailEmpty', function(){
        ISNLogger.log("bound email empty in registration view");

        $("#emailRegistrationInput").hide();
        $("#empty_mail").show();
    });

    $(document).bind('CaptchaError', function(){
        ISNLogger.log("bound CaptchaError in registration view");
        //self.refreshCapcha();
        $("#captcha_message").show();
    });

    $(document).bind('EmailNotValidated', function(){
        ISNLogger.log("bound email not validated in registration view");
        $("#emailRegistrationInput").hide();
        $("#notvalid_mail").show();
    });

    $(document).bind('PasswortNotValidated', function(){
        ISNLogger.log("bound passwort not validated in registration view");
        $("#passwordRegistrationInput").hide();
        $("#empty_password").hide();
        $("#short_password").show();
    });

    $(document).bind('PasswortEmpty', function(){
        ISNLogger.log("bound passwort empty in registration view");
        $("#passwordRegistrationInput").hide();
        $("#short_password").hide();
        $("#empty_password").show();
    });

    $(document).bind('PasswortConfirmEmpty', function(){
        ISNLogger.log("bound confirm passwort empty in registration view");
        $("#passwordRegConfirmInput").hide();
        $("#empty_confirmPassword").show();
    });


    $(document).bind('RegistrationValidated', function(){
        ISNLogger.log("bound registation validated in registration view");
        $("#submit_confirmation").removeClass("inactive_registration");
        $("#submit_confirmation").addClass("active_registration");
    });


    $(document).bind('RegistrationNotValidated', function(){
        ISNLogger.log("bound registation NOT validated in registration view");
        $("#submit_confirmation").removeClass("active_registration");
        $("#submit_confirmation").addClass("inactive_registration");
    });

    $("#registerButton").bind("click", function(e){
        ISNLogger.log("clicked on the register button");
        self.controller.transitionToRegistration();

        // $("#titleRegistrationInput").attr('contenteditable', 'true');
        $("#nameRegistrationInput").attr('contenteditable', 'true');
        $("#emailRegistrationInput").attr('contenteditable', 'true');
        $("#passwordRegistrationInput").attr('contenteditable', 'true');
        $("#passwordRegConfirmInput").attr('contenteditable', 'true');

    });

    $("#cancel_registration").bind("click", function(e){
        self.controller.transitionToIntroduction();
    });

    $("#titleRegistrationInput").focusout(function(e){
        ISNLogger.log("focused out title in registration");
        var value_title = $("#titleRegistrationInput option:selected").text();
        ISNLogger.log("value_title is "+value_title);
        self.userModel.setUserTitle(value_title);
    });


    /**
     * focusing out from the name field
     */
    $("#nameRegistrationInput").focusout(function(e){
        ISNLogger.log("focused out name in registration");
        var value_name = $("#nameRegistrationInput").text();
        self.userModel.setName(value_name);
    });


    /**
     * focusing out from the email field
     */
    $("#emailRegistrationInput").focusout(function(e){
        ISNLogger.log("focused out email in registration");
        var value_email = $("#emailRegistrationInput").text();
        self.userModel.setUserEmail(value_email);
    });


    /**
     * focusing out from the password field
     * */
    $("#passwordRegistrationInput").focusout(function(e){
        ISNLogger.log("focused out password in registration");
        var value_password = $("#passwordRegistrationInput").text();
        var hash_password = self.userModel.getHashPassword(value_password);
        self.userModel.setPassword(hash_password ? hash_password : "", value_password ? value_password.length : "");
    });


    /**
     * * focusing out from the password field
     */

    $("#passwordRegConfirmInput").focusout(function(e){
        ISNLogger.log("focus out password confirmation");

        var password = $("#passwordRegistrationInput").text();
        if(password){
            var hash_password = self.userModel.getHashPassword(password);
        }
        var confirm_password = $("#passwordRegConfirmInput").text();
        if (confirm_password){
            var hash_confirm = self.userModel.getHashPassword(confirm_password);
        }
        self.userModel.setConfirmPassword(hash_confirm,hash_password);
    });



    $("#empty_name").bind("click", function(e){
        ISNLogger.log("clicked on the empty name");
        $("#empty_name").hide();
        $("#nameRegistrationInput").show().focus();

    });

    $("#recaptcha_response_field").bind("click", function(e){
        ISNLogger.log("clicked on recaptcha response field");
        $("#captcha_message").hide();
    });


    $("#empty_mail").bind("click", function(e){
        ISNLogger.log("clicked on the empty email");
        $("#empty_mail").hide();
        $("#emailRegistrationInput").show().focus();
    });

    $("#notvalid_mail").bind("click", function(e){
        ISNLogger.log("clicked on the not valid email");
        $("#notvalid_mail").hide();
        $("#emailRegistrationInput").show().focus();
    });

    //added ability to enter a different email address if the first one is taken
    $("#existing_mail").bind("click", function(e){
        ISNLogger.log("clicked on the already existing email");
        $("#existing_mail").hide();
        $("#emailRegistrationInput").show().focus();
    });


    $("#empty_password").bind("click", function(e){
        ISNLogger.log("clicked on the empty password");
        $(this).hide();
        $("#passwordRegistrationInput").show();
    });

    $("#short_password").bind("click", function(e){
        ISNLogger.log("clicked on the empty password");
        $(this).hide();
        $("#passwordRegistrationInput").show();
    });

    $("#empty_confirmPassword").bind("click", function(e){
        ISNLogger.log("clicked on the empty password");
        $(this).hide();
        $("#passwordRegConfirmInput").show();
    });

    /**
     * Colorization of password and confirmation password fields
     * during the completeness of the confirmation password field
     */
    $("#passwordRegConfirmInput").keyup(function(e){
        ISNLogger.log("enter focus in confirm password field");

        var new_password = $("#passwordRegistrationInput").text();

        var confirm_password = $("#passwordRegConfirmInput").text();


        ISNLogger.log("new password is" +new_password);
        ISNLogger.log("confirm password is" +confirm_password);
        if (new_password !== confirm_password){

            ISNLogger.log("the two fields are not matching with each other");
            $("#pd_reg_password_confirm_label").css('background-color', 'red');
            $("#pd_reg_password_confirm_label").css('color', '#fff');
        }

        if (new_password == confirm_password){
            ISNLogger.log("the two fields match with each other");
            $("#pd_reg_password_confirm_label").css('background-color', '#0089CF');
            $("#pd_reg_password_confirm_label").css('color', '#fff');
        }


    });

    /**
     * clean any background color from labels of fields
     *
     */
    $("#registrationContainer").bind("click", function(e){
        $("#pd_registration_email_label").css('background-color', '#ebedee');
        $("#pd_registration_email_label").css('color', '#4C5160');
    });



    $("#submit_confirmation").bind("click", function(e){
        ISNLogger.log("clicked submit confirmation");
        // assure that the user's title is stored even if the title is never explicitly selected.
        var value_title = $("#titleRegistrationInput option:selected").text();
        self.userModel.setUserTitle(value_title);

        var value_password = $("#passwordRegistrationInput").text();
        self.controller.models.user.register(value_password);

        //clean any background color of the label
        $("#pd_registration_password_label").css('background-color', '#ebedee');
        $("#pd_registration_password_label").css('color', '#4C5160');
        $("#pd_reg_password_confirm_label").css('background-color', '#ebedee');
        $("#pd_reg_password_confirm_label").css('color', '#4C5160');
    });

}

RegistrationView.prototype.openDiv= openView;

RegistrationView.prototype.open = function(){
    this.update();
    this.openDiv();
};

RegistrationView.prototype.update = function(){

};


//RegistrationView.prototype.refreshCapcha = function(){
//  ISNLogger.log("empty CAPCHA");
//  $("#capchaContainer").empty();
//  var script=$("<script/>", {
//      "type":"text/javascript",
//      "src": "http://www.google.com/recaptcha/api/challenge?k=6LfmWesSAAAAACG80Y8-X7VXC-ElpXkqnfFWf4Ry"
//  }).appendTo("#capchaContainer");
//
//
////    var script = document.createElement("script");
////    script.setAttribute("type","text/javascript");
////    script.setAttribute("src","http://www.google.com/recaptcha/api/challenge?k=6LfmWesSAAAAACG80Y8-X7VXC-ElpXkqnfFWf4Ry/javascript");
////    script.src ="http://www.google.com/recaptcha/api/challenge?k=6LfmWesSAAAAACG80Y8-X7VXC-ElpXkqnfFWf4Ry"
////    $("#capchaContainer").append(script);
//
//
//  var noscript=script=$("<noscript/>", {
//        }).appendTo("#capchaContainer");
//
//  var iFrame=$("<iframe/>", {
//      "src":"http://www.google.com/recaptcha/api/noscript?k=6LfmWesSAAAAACG80Y8-X7VXC-ElpXkqnfFWf4Ry",
//      "height": "100",
//      "width": "150",
//      "frameborder": "0"
//    }).appendTo(noscript);
//
//  var br=$("<br/>", {}).appendTo(noscript);
//
//  var textarea=$("<textarea/>", {
//      "name":"recaptcha_challenge_field",
//      "rows": "3",
//      "cols": "40"
//  }).appendTo(noscript);
//
//  var input=$("<input/>", {
//      "type":"hidden",
//      "name": "recaptcha_response_field",
//      "value": "manual_challenge"
//  }).appendTo(noscript);
//
//};

RegistrationView.prototype.closeDiv=closeView;


RegistrationView.prototype.close = function(){
    ISNLogger.log("close welcome view");
    this.closeDiv();
};


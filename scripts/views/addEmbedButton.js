/**
 * @class AddEmbedButton
 *
 * View class for the embed code.
 */

/*jslint vars: true, sloppy: true */

function AddEmbedButton(controller){
	ISNLogger.log("enter add embed button");
	var self = this;
	self.controller = controller;
	self.tagID      = "embedView";
	self.dossierId  = self.controller.getActiveDossier();

	$("#addEmbedBtn").bind("click", function(e){
		ISNLogger.log("clicked the add Embed button");
		if ($("#dropdown_embed").is(":visible")){
			$("#dropdown_embed").hide();
		}
		else{
			self.update();
			$("#inputContainer").select();
			$("#dropdown_embed").show();
		}
	});

	$("#inputContainer").bind("focus", function(){
		$("#inputContainer").select();
	});

	$("#inputContainer").bind("click", function(){
		$("#inputContainer").select();
	});

	$("#contentEmbed").bind("click", function(e){
		$("#inputContainer").attr("value", self.generateEmbedCode('full'));
		$("#badgeStyle").removeClass("pd_activeBadge");
		$("#contentEmbed").addClass("pd_activeBadge");
	});

	$("#badgeStyle").bind("click", function(e){
		$("#inputContainer").attr("value", self.generateEmbedCode('badge'));
		$("#contentEmbed").removeClass("pd_activeBadge");
		$("#badgeStyle").addClass("pd_activeBadge");
	});
}

AddEmbedButton.prototype.openDiv=openView;
AddEmbedButton.prototype.closeDiv=closeView;

AddEmbedButton.prototype.open = function(){
    if ( !this.controller.models.bookmark.dossierForbidden ) {
	   ISNLogger.log("open add embed View");
	   this.openDiv();
    }
    else {
        $('#embedView').hide();
    }
};

/**
 * @method update()
 *
 * this function displays the drop-down box that contains
 * all the information and links to the embedded pages
 * by default the link to the content embed is displayed
 *
 */
AddEmbedButton.prototype.update = function(){
    if ( !this.controller.models.bookmark.dossierForbidden ) {
        ISNLogger.log("enter update in addEmbedd button");
        var self=this;
        var dossierId=this.controller.getActiveDossier();
        $("#inputContainer").attr("value",this.generateEmbedCode('full'));

        $("#inputContainer").focus();

        $("#drop_info").show();
    }
};

/**
 * @method embedURL(embedType, embedOptions)
 *
 * @param String embedType ('badge'|'full')
 * @param Object embedObject
 *
 * generates the embedURL for the different embed types.
 */
AddEmbedButton.prototype.embedURL = function(embedType, options) {
    return baseURL() + 'embed.js?type=' + (embedType === 'badge'? 'Badge' : 'PageBig') + '&id=' + this.dossierId;
};

/**
 * @method embedStyle(embedType)
 *
 * @param String embedType ('badge'|'full')
 *
 * generates the style for the embedded iframe.
 */
AddEmbedButton.prototype.embedStyle = function(embedType) {
    var cssStyle = {
        'width'   : '100%',
        'height'  : (embedType === 'badge' ? '450px' : '900px'),
        'border'  : 'none',
        'overflow': 'hidden',
    };
    return $.map(cssStyle, function(v,k){return k+ ': '+ v+ ';';}).join(' ');
};

/**
 * @method generateEmbedCode(embedType)
 *
 * @param String embedType ('badge'| 'full')
 *
 * generates the embedstring for the requested embed type.
 */
AddEmbedButton.prototype.generateEmbedCode = function(embedType) {
    return '<script type="text/javascript" src="' + this.embedURL(embedType) + '"></script>';
};

AddEmbedButton.prototype.close = function(){
	ISNLogger.log("close add embed view");
	this.closeDiv();
};

/*jslint vars: true, sloppy: true */

/**
 * @class AdminDossierModel
 * 
 * This class handles the server interaction for the dossier adminstration
 */

function AdminDossierModel(controller) {
    this.controller = controller;

    this.resetData();
    this.loadData();
}

AdminDossierModel.prototype.loadData = function () {
    var self = this;
    
    var url = self.controller.baseURL +'service/dossieradmin.php/list/' + self.page;
    
    $.ajax({
            url:  url,
            type : 'GET',
            dataType : 'json',
            success: cbSuccessHandler,
            error: cbErrorHandler,
            beforeSend : setHeader
    });
    
    function cbErrorHandler(request) {
        if (request.status === 403 || 
            request.status === 401) {
            
            self.controller.redirectToHome();
        }
        else {
            self.lastpage = true;
        }
    }

    function cbSuccessHandler(data) {
        ISNLogger.log( 'dossierlist data ' + data );
        self.prepareModelData(data);
        self.controller.views.dossiers.continueList();
    }

    function setHeader(xhr){
	   var header_request = self.controller.oauth.oauthHeader('GET', url);
	   xhr.setRequestHeader('Authorization', header_request);
    }
};

AdminDossierModel.prototype.nextPage = function() {
    if (!this.lastpage) {
        this.page++;
        this.loadData();
    }
};

AdminDossierModel.prototype.resetData = function() {
    this.page = 1;
    this.dossierid = -1;
    this.lastpage = false;
    this.dossiers = [];
    this.users    = {};
};

AdminDossierModel.prototype.prepareModelData = function(data) {
    if (data.objects < data.limit) {
        this.lastpage = true;
    }
    var di, ui;
    for (di = 0; di < data.dossiers.length; di++) {
        this.dossiers.push(data.dossiers[di]);
        this.users[data.dossiers[di].id] = [];
    }

    for (ui = 0; ui < data.users.length; ui++) {
        this.users[data.users[ui].dossier_id].push(data.users[ui]);
    }
};

AdminDossierModel.prototype.next = function() {
    this.dossierid++;
    if ( this.dossierid < this.dossiers.length ) {
        return true;
    }
    this.dossierid = this.dossiers.length - 1;
    return false;
};

AdminDossierModel.prototype.reset = function() {
    this.dossierid = -1;
};

AdminDossierModel.prototype.dossierId = function() {
    return this.dossiers[this.dossierid].id;
};

AdminDossierModel.prototype.dossierTitle = function() {
    return this.dossiers[this.dossierid].title;
};

AdminDossierModel.prototype.dossierDescription = function() {
    return this.dossiers[this.dossierid].description;
};

AdminDossierModel.prototype.dossierUserNames = function() {
    var du, retval = [];
    var dulist = this.users[this.dossierId()];
    for (du = 0; du < dulist.length; du++) {
        retval.push(dulist[du].name);
    }
    return retval.join(", ");
};

AdminDossierModel.prototype.dossierPrivateFlag = function() {
    return this.dossiers[this.dossierid].private_flag;
};

AdminDossierModel.prototype.dossierImageUrl = function() {
    return this.dossiers[this.dossierid].image;
};

AdminDossierModel.prototype.deactivateDossier = function(dID) {
    var self = this;
    var url = self.controller.baseURL +'service/dossieradmin.php/dossier/' + dID;
    var theDossier = dID;
    var bPrivate = false;
    
    if (dID && dID > 0) {
        // verify that the dossier is in the model
        var bID = false, i = 0;
        for( i; i < self.dossiers.length; i++) {
            if (self.dossiers[i].id === dID) {
                ISNLogger.log('found dossier');
                bID = true;
                if (self.dossiers[i].private_flag === '1') {
                    bPrivate = true;
                }
                break;
            }
        }
        
        var myData = JSON.stringify({'private_flag': bPrivate ? 0: 1});
        
        // send the request to the backend
        if (bID) {
            ISNLogger.log('update dossier');
            $.ajax({
                url:  url,
                type : 'POST',
                data: myData,
                dataType : 'json',
                beforeSend : setHeader
            }).done(cbSuccess).fail(cbError);
        }
        else {
            ISNLogger.log('dossier not in model');
        }
    }
    else {
        ISNLogger.log('no dossier id passed');
    }
    
    function setHeader(xhr){
	   var header_request = self.controller.oauth.oauthHeader('POST', url);
	   xhr.setRequestHeader('Authorization', header_request);
    }
    
    function cbSuccess(data) {
        for( var j = 0; j < self.dossiers.length; j++) {
            if (self.dossiers[j].id === theDossier) {
                ISNLogger.log('found dossier to update' + (bPrivate ? 0: 1));
                self.dossiers[j].private_flag = bPrivate ? "0": "1";
                break;
            }
        }
        ISNLogger.log("trigger PD-ITEMUPDATE");
        $(document).trigger('PD-ITEMUPDATE', [theDossier, bPrivate ? 0: 1]);
    }
    
    function cbError(xhr) {
        ISNLogger.log('server error ' + xhr.status);
       // self.controller.redirectToHome();
    }
};

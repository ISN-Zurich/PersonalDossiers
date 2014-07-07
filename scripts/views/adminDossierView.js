/*jslint vars: true, sloppy: true */

/**
 * @class AdminDossierView
 * 
 * View class for displaying the dossier list
 */

function AdminDossierView(controller) {
    this.controller = controller;
    var self = this;
    
    $('#content').bind('click', cbClick);
    // BRUTE FORCE UPDATE, we should be more subtle than that.
    $(document).bind('PD-ITEMUPDATE', function() {self.update();});
    
    function cbClick(e) {
        if (e.target.id === 'loadmoredossiers') {
            self.controller.models.dossiers.nextPage();
        }
        else if ($(e.target).hasClass('dossierprivate')) {
            ISNLogger.log('toggle private flag');
            var id = $(e.target).parents('.dossier')[0].id.substring(7);
            ISNLogger.log('toggle dossier id ' + id);
            // inform the model that it should update
            self.controller.models.dossiers.deactivateDossier(id);
        }
    }
}

AdminDossierView.prototype.open = function () {
    this.update();
};

AdminDossierView.prototype.close = function () {};

AdminDossierView.prototype.update = function () {
    $('#dossierlist').html('');
    this.refreshList();
};

AdminDossierView.prototype.renderItem = function () {
    var container = $('<div/>', {
        'id': 'dossier'+this.controller.models.dossiers.dossierId(),
        'class': 'dossier'
    });
    
    var bc = $('<div/>', {
        'class': "buttonContainer"
    }).appendTo(container);
    
    var act = this.controller.models.dossiers.dossierPrivateFlag() === '1' ? 'active' : 'inactive';
    
    $('<div/>', {
        'class': 'dossierprivate icon-key button ' + act
    }).appendTo(container);
    
    
    var t = $('<div/>', {
        'class': 'dossiertitle',
    }).appendTo(container);
    
    $('<a/>', {
        'href': this.controller.baseURL + 'index.html?id=' + this.controller.models.dossiers.dossierId(),
        'text': this.controller.models.dossiers.dossierTitle(),
        'target': '_blank'
    }).appendTo(t);
    
    $('<div/>', {
        'class': 'dossierusers',
        'text': this.controller.models.dossiers.dossierUserNames()
    }).appendTo(container);
    
    $('<div/>', {
        'class': 'dossierdescription',
        'text': this.controller.models.dossiers.dossierDescription()
    }).appendTo(container);
    
    container.appendTo('#dossierlist');
};

AdminDossierView.prototype.refreshList = function () {
    this.controller.models.dossiers.reset();
    this.continueList();
};

AdminDossierView.prototype.continueList = function () {
    while (this.controller.models.dossiers.next()) {
        this.renderItem();
    }
    if (this.controller.models.dossiers.lastpage) {
        ISNLogger.log('Last page stop showing load more button');
        $('#loadmoredossiers').addClass('hide');
    }
    else {
        ISNLogger.log('More pages keep showing load more button');
        $('#loadmoredossiers').removeClass('hide');
    }
};

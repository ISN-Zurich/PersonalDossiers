/*jslint vars: true, sloppy: true */
function LibraryBookmarkModel( controller ) {

	var self = this;
	self.controller = controller;
	self.bookmarkedDossierList = [];
	self.library_item_id = self.controller.getUrlId();
	ISNLogger.log( "library item id in library bookmark models is " + self.library_item_id );

	// this was previously bound in bookmarkview in order to open it
	// now we need one step more in order to load the bookmarked dossiers list
	$(document).bind('DossierListUpdate', function(){

		ISNLogger.log( "bound dossier list update in library bookmark model" );
		self.getUserBookmarkedDossiers();
	});
}



/**
 * Get the list of dossiers for a specific user, that already contain a specific dossier item.
 * Argument: library_item_id. It is the id of the library item that we pass from isn website to the iframe
 */
LibraryBookmarkModel.prototype.getUserBookmarkedDossiers = function(){

	var self = this;
	var library_item_id = self.library_item_id;
	var url = self.controller.baseURL + 'service/dossier.php/dossiers/' + library_item_id;
	var method = 'GET';
	ISNLogger.log( 'request to load bookmarked dossier list for specific item' );

	if (self.controller.oauth) {

		ISNLogger.log( 'load bookmarked dossier list because there is oauth' );
		$.ajax({
			url : url,
			type : method,
			dataType : 'json',
			success : success,
			error : function( request ) {

				ISNLogger.log( "Error while getting the user bookmarked dossiers" );
				showErrorResponses( request );
			},
			beforeSend : setHeader
		});
	} //should we include any else case?


	function success( data ) {

		self.bookmarkedDossierList = data.dossiers;
		ISNLogger.log( "self.bookmarked list is " + self.bookmarkedDossierList );

		// inform all dossier views that they need to update
		$(document).trigger('BookmarkedDossierListUpdate'); // for the views (bookmark view)
	}


	function setHeader( xhr ) {

		var header_request = self.controller.oauth.oauthHeader( method , url );
		ISNLogger.log( "oauth header: " + header_request );
		xhr.setRequestHeader( 'Authorization' , header_request );
	}
	//	trigger bookmarked list update
};



LibraryBookmarkModel.prototype.addItem = function( dossierID ) {

	ISNLogger.log( "enter addItem in library bookmark model" );
	var self = this;
	var id = self.library_item_id;
	var url = self.controller.baseURL + 'service/dossier.php/' + dossierID;
	var method = "PUT";
	var pdata = JSON.stringify({'id': id });

	ISNLogger.log( 'addItem: data is ' + pdata );
	if ( dossierID && id ) {

		ISNLogger.log( "before AJAX" );
		$.ajax({
			url : url,
			type : method,
			data : pdata,
			dataType : 'json',
			success : success,
			error : error,
			beforeSend : setHeader
		});
	}


	function success(){

		// great! well done!
		ISNLogger.log( "great the insertion of the bookmark was succesfull" );
		self.getUserBookmarkedDossiers(); //the will colorize and upate the view
	}


	function error( request ) {

		// the server rejected the request!
		ISNLogger.log( "the server rejected the request of adding an item" );
		ISNLogger.log( "ERROR status text: " + request.statusText );
		ISNLogger.log( "ERROR status code: " + request.statusCode() );
		ISNLogger.log( "ERROR status code is : " + request.status );
		ISNLogger.log( "ERROR responsetext: " + request.responseText );
        if ( request.status == 401 ) {

            // access keys have been rejected
            self.controller.keysRejected();
        }
	}

	function setHeader( xhr ) {

		var header_request = self.controller.oauth.oauthHeader( method , url );
		xhr.setRequestHeader( 'Authorization' , header_request );
	}
};



LibraryBookmarkModel.prototype.removeItem = function( dossierID ) {

	ISNLogger.log( "enter removeItem in library bookmark model" );
	var self = this;
	var id = self.library_item_id;
	var url = self.controller.baseURL + 'service/dossier.php/' + dossierID + '/' + id ;
	var method = "DELETE";

	ISNLogger.log( 'removeItem: url is ' + url );
	if ( dossierID && id ) {

		ISNLogger.log( "before AJAX" );
		$.ajax({
			url : url,
			type : method,
			dataType : 'json',
			success : success,
			error : error,
			beforeSend : setHeader
		});
	}


	function success(){

		// great! well done!
		ISNLogger.log( "great! the removal of the bookmark was succesfull" );
		self.getUserBookmarkedDossiers(); //the will colorize and upate the view
	}


	function error( request ) {

		// the server rejected the request!
		ISNLogger.log( "the server rejected the request of removing an item" );
		ISNLogger.log( "ERROR status text: " + request.statusText );
		ISNLogger.log( "ERROR status code: " + request.statusCode() );
		ISNLogger.log( "ERROR status code is : " + request.status );
		ISNLogger.log( "ERROR responsetext: " + request.responseText );
        if ( request.status == 401 ) {

            // access keys have been rejected
            self.controller.keysRejected();
        }
	}

	function setHeader( xhr ) {

		var header_request = self.controller.oauth.oauthHeader( method , url );
		xhr.setRequestHeader( 'Authorization' , header_request );
	}
};



/**
 * The dossier id
 * @param id
 * @returns {Boolean}
 */
LibraryBookmarkModel.prototype.hasItem = function( id ) {

	if ( this.bookmarkedDossierList && !this.bookmarkedDossierList.length ) {

		return false;
	}

	ISNLogger.log( "enter hasItem" );
	var retval = false, i = 0;
	if ( this.bookmarkedDossierList && this.bookmarkedDossierList.length && id ) {

		for ( i; i < this.bookmarkedDossierList.length; i++ ) {

			ISNLogger.log( "existing library id is " + this.bookmarkedDossierList[i] );
			ISNLogger.log( "comparable id " + id );

			if ( this.bookmarkedDossierList[i] === id ) {

				retval = true;
				break;
			}
		}
	}
	return retval;
};
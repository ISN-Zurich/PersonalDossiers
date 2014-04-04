/**
 *  This views contains mostly the event handlers of :
 *  - facebook icon
 *  - twitter icon
 *  - google plus icon
 * */

function ShareButtonView(controller){
    ISNLogger.log("enter sharebuttonView");
    var self=this;
    self.controller=controller;
    self.tagID="#shareButton";
    		
	var bookmarkModel=self.controller.models['bookmark'];
	var shared_title=encodeURIComponent(bookmarkModel.getDossierTitle());
	var shared_url=encodeURIComponent(self.getPublicLink());

	//Rewriting the page link for social media, taking care of different forms
	selfURL = self.getPublicLink();
	if(selfURL.indexOf("ch/?id=") != -1)
		{
			//URL is in the form of "lab.isn.ethz.ch/?id=35"
			var shared_socialURL = selfURL.replace("lab.isn.ethz.ch/?id=","lab.isn.ethz.ch/share.php/");
			var trim_url=whole_image_string.substring(0, whole_image_string.indexOf('?id='));
		}
	else
		{
			//URL is in the form of "lab.isn.ethz.ch/index.html?id=35"
			var shared_socialURL = selfURL.replace("lab.isn.ethz.ch/index.html?id=","lab.isn.ethz.ch/share.php/");	
			var trim_url=whole_image_string.substring(0, whole_image_string.indexOf('index.html'));
		}
	
	var shared_description=encodeURIComponent(bookmarkModel.getDossierDescription());
	var whole_image_string=window.location.href;
	var shared_image= encodeURIComponent(trim_url+'/'+bookmarkModel.getDossierImageURL());

 /*
	Facebook
 */       	
	$("#st_facebook").bind("click", function(e){
		ISNLogger.log("click facebook button in ");

		window.open('http://www.facebook.com/sharer.php?title='+ shared_title + '&summary=' + shared_description + '&u='+ shared_socialURL +'&images='+shared_image, 
				 'facebook-share-dialog', 
				 'width=626,height=436'		
		);
		
	});
	
	/*
		Twitter
	*/
	$("#st_twitter").bind("click", function(e){
		ISNLogger.log("clicked the twitter icon");
		var url1='http://twitter.com/home?status=';
		ISNLogger.log("final twitter url is "+url1+self.getPublicLink());
		$("#st_twitter").attr("href",url1+self.getPublicLink());
	}
	);  
	
	/*
		Google plus
	*/
	
	$("#st_googleplus").bind("click", function(e){
		ISNLogger.log("clicked the google plus icon");
		var url='https://plus.google.com/share?url=' + shared_socialURL '';
		
		ISNLogger.log("final google plus url is "+url+self.getPublicLink());
		$("#st_googleplus").attr("href",url+self.getPublicLink());
	}
	);   
}//end of constructor



ShareButtonView.prototype.getPublicLink=function(){

    var self=this;
    var url= window.location.href;
    if (self.controller.hashed){
        var hashedUrl= url;
    }
    else{
        var hashedUrl= url + "?id=" + this.controller.getActiveDossier();
        ISNLogger.log("hashedUrl so far is "+hashedUrl);
    }
  return hashedUrl;

};

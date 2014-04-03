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

       	
	$("#st_facebook").bind("click", function(e){
		ISNLogger.log("click facebook button in ");
		var bookmarkModel=self.controller.models['bookmark'];
		var shared_title=encodeURIComponent(bookmarkModel.getDossierTitle());
		var shared_url=encodeURIComponent(self.getPublicLink());
		//Prepping the FB link
		selfURL = self.getPublicLink();
		
		//Rewriting the link for facebook, taking care of different forms
		
		if(selfURL.indexOf(ch/?id=) != -1)
			{
				//URL is in the form of "lab.isn.ethz.ch/?id=35"
				var shared_url_fb = selfURL.replace("lab.isn.ethz.ch/?id=","lab.isn.ethz.ch/share.php/");	
			}
		else
			{
				//URL is in the form of "lab.isn.ethz.ch/index.html?id=35"
				var shared_url_fb = selfURL.replace("lab.isn.ethz.ch/index.html?id=","lab.isn.ethz.ch/share.php/");	
			}
		

		var shared_description=encodeURIComponent(bookmarkModel.getDossierDescription());
		
		var whole_image_string=window.location.href;
		var trim_url=whole_image_string.substring(0, whole_image_string.indexOf('index.html'));
		ISNLogger.log("trimmed url is "+trim_url);
		
		var shared_image= encodeURIComponent(trim_url+'/'+bookmarkModel.getDossierImageURL());
		ISNLogger.log("sharedimage is "+shared_image);

		window.open('http://www.facebook.com/sharer.php?title='+ shared_title + '&summary=' + shared_description + '&u='+ shared_url_fb +'&images='+shared_image, 
				 'facebook-share-dialog', 
				 'width=626,height=436'		
		);
		
	});
	
	$("#st_twitter").bind("click", function(e){
		ISNLogger.log("clicked the twitter icon");
		var url1='http://twitter.com/home?status=';
		ISNLogger.log("final twitter url is "+url1+self.getPublicLink());
		$("#st_twitter").attr("href",url1+self.getPublicLink());
	}
	);  
	
	
	$("#st_googleplus").bind("click", function(e){
		ISNLogger.log("clicked the twitter icon");
		var url='https://plus.google.com/share?url=';
		$('meta[property="og:description"]').attr('content',"$modified_desc" );
		
		ISNLogger.log("final twitter url is "+url+self.getPublicLink());
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

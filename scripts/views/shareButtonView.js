
/**
 *  This views contains mostly the event handlers of :
 *  - facebook icon
 *  - twitter icon
 *  - google plus icon
 * */

function ShareButtonView(controller){
    console.log("enter sharebuttonView");
    var self=this;
    self.controller=controller;
    self.tagID="#shareButton";

       	
	$("#st_facebook").bind("click", function(e){
		console.log("click facebook button in ");
		var bookmarkModel=self.controller.models['bookmark'];
		var shared_title=encodeURIComponent(bookmarkModel.getDossierTitle());
		var shared_url=encodeURIComponent(self.getPublicLink());
		var shared_description=encodeURIComponent(bookmarkModel.getDossierDescription());
		
		var whole_image_string=window.location.href;
		var trim_url=whole_image_string.substring(0, whole_image_string.indexOf('index.html'));
		console.log("trimed url is "+trim_url);
		
		var shared_image= encodeURIComponent(trim_url+'/'+bookmarkModel.getDossierImageURL());
		console.log("sharedimage is "+shared_image);

		window.open('http://www.facebook.com/sharer.php?s=100&p[title]='+ shared_title + '&p[summary]=' + shared_description + '&p[url]=' + shared_url + '&p[images][0]='+shared_image, 
				 'facebook-share-dialog', 
				 'width=626,height=436'		
		);
		
	});
	
	$("#st_twitter").bind("click", function(e){
		console.log("clicked the twitter icon");
		var url1='http://twitter.com/home?status=';
		console.log("final twitter url is "+url1+self.getPublicLink());
		$("#st_twitter").attr("href",url1+self.getPublicLink());
	}
	);  
	
	
	$("#st_googleplus").bind("click", function(e){
		console.log("clicked the twitter icon");
		var url='https://plus.google.com/share?url=';
		console.log("final twitter url is "+url+self.getPublicLink());
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
        console.log("hashedUrl so far is "+hashedUrl);
    }
  return hashedUrl;

};

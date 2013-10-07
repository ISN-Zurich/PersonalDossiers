function landingView(controller){
	var self=this;
	self.controller=controller;
	self.tagID = 'landingView';
	
	$(document).bind('UserProfileUpdate', function(){
		console.log("user profile update binded in landing view");
      self.update();
  });
	   $(document).bind('DossierListUpdate', function(){
	        self.update();
	    });
	    
}

landingView.prototype.open = function(){
	this.update();
};

landingView.prototype.update = function(){
	 var self= this;
	 var hashTag = self.controller.getHash();
	 self.controller.chooseView(hashTag);
};

landingView.prototype.close = function(){
	$('#'+this.tagID).addClass("hidden");
};
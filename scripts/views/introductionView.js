/*jslint vars: true, sloppy: true */

function IntroductionView(controller){
	
	var self=this;
	self.controller=controller;
	self.tagID="introductionView"; 
	

}

IntroductionView.prototype.openDiv=openView;

IntroductionView.prototype.open = function(){
	this.update();
	this.openDiv();
};


IntroductionView.prototype.update = function(){
	
};

IntroductionView.prototype.closeDiv=closeView;

IntroductionView.prototype.close = function(){
	ISNLogger.log("close introduction view");
	this.closeDiv();
	
};

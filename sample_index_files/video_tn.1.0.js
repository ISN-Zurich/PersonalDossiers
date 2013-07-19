//jQuery on document loaded
$(document).ready(function() { 

	//vimeo thumbnails
	$('.vimeo_thumb').each(function(index){
	
		var idString = $(this).attr('id');
		var strParts = idString.split('_');
		var videoID = strParts[1];
		$.getJSON('http://vimeo.com/api/v2/video/'+videoID+'.json?callback=?', function(data) {
			
			$('#vimeo_'+videoID).attr('src',data[0].thumbnail_medium);
		});
	});

	//ustream thumbnails
	$('.ustream_thumb').each(function(index){
	
		var idString = $(this).attr('id');
		var strParts = idString.split('_');
		var videoID = strParts[1];
		$.getJSON('http://api.ustream.tv/json/video/'+videoID+'/getInfo?callback=?', function(data) {
			
			$('#ustream_'+videoID).attr('src',data.imageUrl.medium);
		});
	});
});

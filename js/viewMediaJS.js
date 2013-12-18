start();

function start(){
	$('#viewMedia').on("submit", function(e){		
		e.preventDefault();
		loadMedia();
	});
	stopLoad();
}

function loadMedia(){

	startLoad();

	var mediaType = $("#typeDropdown").val();
	
	$.ajax({
		url: "server.php",
		data: {action: "getMedia", type: mediaType},
		dataType: "json"
	}).done(function(data){
		$("#resultList").html("");
		
		var files = data.files;
		for(var i = 0; i < files.length; i++){
			if(files[i].type == "photo"){
				$("#resultList").append("<li>"+files[i].title+"<br><img src='"+files[i].path+"' id='photoImage'></li>");
			}else if(files[i].type == "video"){
				$("#resultList").append("<li>"+files[i].title+"<br><video id='video' controls> <source src='"+files[i].path+"' type='video/mp4'> <source src='"+files[i].path+"' type='video/ogg'> Your browser does not support the video tag. </video></li>");
			}else if(files[i].type == "audio"){
				$("#resultList").append("<li>"+files[i].title+"<br><audio controls><source src='"+files[i].path+"' type='audio/ogg'> <source src='"+files[i].path+"' type='audio/mpeg'> Your browser does not support the audio tag. </audio></li>");
			}
		}
		
		stopLoad();
	}).fail(function(){
	});
}
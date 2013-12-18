start();

function start(){
	stopLoad();
	loadCharacters();
}
 
//Saves the input data from the user if it's not empty.
function loadCharacters(){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	
	startLoad();
	
	$.ajax({
		url: "server.php",
		data: {key: keyID, code: vCode},
		dataType: "xml"
	}).done(function(data){
		$(data).find('row').each(function(){
			var characterName 		= $(this).attr('name');
			var characterID 		= $(this).attr('characterID');
			var corporationName 	= $(this).attr('corporationName');
			var corporationID 		= $(this).attr('corporationID');
			
			var imageID = "http://image.eveonline.com/character/"+characterID+"_256.jpg";
			
			$("#content > ul").append("<li class='characterItem'>"+
				"<span>"+characterName+"<img src='"+imageID+"' alt='No Image' style='width:128px; height:128px;'/></span>"+
				"<div style='display:none;'>Corporation Name: "+corporationName+
				"<br>Corporation ID: "+corporationID+"<br>Character ID: "+characterID+"</div></li>");
		});
		
		$(".characterItem").on("click", showCharacterInfo); 
		
		stopLoad();
	}).fail(function(){
		alert("Misslyckades att hämta konto information.");
	});	
}

var previousToggle = null;

//Shows character information.
function showCharacterInfo(){	
	var imgHeight = 128;
	var imgWidth  = 128;
	
	$(".characterItem").children("div").each(function(){
		$(this).hide();
	});
	
	$(".characterItem").find('img').each(function(){
		$(this).animate({
		"width": imgWidth,
		"height": imgHeight
	}, 0);
	});
	
	if(previousToggle != $(this)){
		$(this).children("div").slideToggle(200);	
		
		imgHeight = 256;
		imgWidth  = 256;

		$(this).find('img').animate({
			"width": imgWidth,
			"height": imgHeight
		}, 200);
	}
	previousToggle = $(this);
}
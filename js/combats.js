start();

function start(){
	stopLoad();
	loadCharacters();
	
	$('#characterForm').on("submit", function(e){		
		e.preventDefault();
		loadCharacterFights();
	});
}

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
			
			$("#characterDropdown").append("<option value='"+characterID+"'>"+characterName+"</option>");
		});
		stopLoad();
	}).fail(function(){
		alert("Misslyckades att hämta konto information.");
	});	
}

function loadCharacterFights(){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	var characterID	= $("#characterDropdown").val();
	
	startLoad();
	$.ajax({
		url: "server.php",
		data: {type: "combat", key: keyID, code: vCode, character: characterID},
		dataType: "xml"
	}).done(function(data){
		$(data).find('row').each(function(){
			alert($(this));
		});
		stopLoad();
	}).fail(function(){
		alert("Misslyckades att hämta konto information.");
	});	
}
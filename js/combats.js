start();

function start(){
	loadCharacters();
	
	$('#characterForm').on("submit", function(e){		
		e.preventDefault();
		loadCharacterFights();
	});
}

function loadCharacters(){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");

	var characters = JSON.parse(localStorage.getItem("characters"));
	alert(characters);
	
	var mySelect = document.getElementById("characterDropdown");
	for (var i = 0; i < characters.length; i++) {
		var option = document.createElement("option");
		option.text = characters[i].Name;
		option.value = characters[i].Id;
		mySelect.appendChild(option);
	}
	
	/*
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
	*/
}

function loadCharacterFights(){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	var characterID	= $("#characterDropdown").val();

	$.ajax({
		url: "server.php",
		data: {type: "combat", key: keyID, code: vCode, char: characterID},
		dataType: "xml"
	}).done(function(data){
		$(data).find('row').each(function(){
			alert($(this));
		});
	}).fail(function(){
		alert("Misslyckades att hämta konto information.");
	});	
}

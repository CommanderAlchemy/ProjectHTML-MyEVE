start();

/*
* Denna funktion använder sig av "Kill log"-api:t.
*/

function start(){
	localStorage.cacheXML = "";
	
	loadCharacters();
	
	loadCharacterFights($('#characterDropdown :selected').val());
	$('#characterDropdown').on("change", function(e){
		loadCharacterFights($('#characterDropdown :selected').val());
	});
}

function loadCharacters(){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");

	var characters = JSON.parse(localStorage.getItem("characters"));
	
	var mySelect = document.getElementById("characterDropdown");
	for (var i = 0; i < characters.length; i++) {
		var option = document.createElement("option");
		option.text = characters[i].Name;
		option.value = characters[i].Id;
		mySelect.appendChild(option);
	}
}

function loadCharacterFights(charId){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	
	var URL = "https://zkillboard.com/api/kills/characterID/" + charId;
	
	$('#content > ul').html('');
	$.ajax({
		url: URL,
		dataType:"json"
	}).done(function(data){
		if (data.length == 0)
			$('#content > ul').html('Mördarloggen är tom');
		for (var i = 0; i < data.length; i++) {			
			var d = data[i];
			var killer = "";
			var killTime = d.killTime;
			var victimName = d.victim.characterName;
			var victimCorp = d.victim.corporationName;
			
			for (var j = 0; j < d.attackers.length; j++) {
				if (d.attackers[j].finalBlow == 1) {
					killer = d.attackers[j].characterName;
					break;	
				}
			}
			
			if (victimName === "")
				victimName = "Other";
			
			$('#content > ul').append(
				'<li>' +
				'<div>' +
				'<h1> Killer: ' + killer + '</h1>' +
				'<h1>Victim: ' + victimName + '</h1>' +
				'<p>Corporation: ' + victimCorp + '</p>' +
				killTime +
				'</div>' +
				'</li>'
			);
		}
	}).fail(function() {
		alert("Misslyckades att hämta konto information.");
	});
}

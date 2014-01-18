start();

/*
* Denna funktion använder sig av "Assets" & "Eve-Central"-api:t.
*/

function start(){
	loadCharacters();
	
	
}

/*
* Load characters from localStorage
*/
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
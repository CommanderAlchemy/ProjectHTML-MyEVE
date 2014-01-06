start();

function start(){
	loadSettings();
	$("#settings").on("submit", function(e){
		e.preventDefault();
		loadUserData();
	});

    $("#clearButton").on("click", function(e){
        alert("Rensat inställningar");
        localStorage.clear();
        clearForm();

    });
}

//Saves the input data from the user if it's not empty.
function loadUserData(){
	var name 		= $("#name").val();
	var keyID	 	= $("#keyID").val();
	var vCode	 	= $("#vCode").val();
	
	$.ajax({
		url: "server.php",
		data: {type: "getAccountCharacter", key: keyID, code: vCode},
		dataType: "xml"
	}).done(function(data){
		saveSettings(name, keyID, vCode);
		alert("Success! MyEve is now connected.");
	}).fail(function(){
		alert("Misslyckades att hämta konto-information.");
	});	
}

function saveSettings(name, keyID, vCode){
	localStorage.setItem("vCode", vCode);
	localStorage.setItem("keyID", keyID);
	localStorage.setItem("name", name);
}

function loadSettings(){
	if(localStorage.getItem("vCode") !== null){
		$("#vCode").val(localStorage.getItem("vCode"));
	}
	
	if(localStorage.getItem("keyID") !== null){
		$("#keyID").val(localStorage.getItem("keyID"));
	}
	
	if(localStorage.getItem("name") !== null){
		$("#name").val(localStorage.getItem("name"));
	}
}

function clearForm() {
    $("#settings").reset();
}

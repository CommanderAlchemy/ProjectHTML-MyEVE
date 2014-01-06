getAccountStatus();

function getAccountStatus(){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	var characterID	= $("#characterDropdown").val();

	$.ajax({
		url: "server.php",
		data: {type: "combat", key: keyID, code: vCode, char: characterID},
		dataType: "xml"
	}).done(function(data){
		$(data).find('result').each(function(){
			alert($(this));
		});
	}).fail(function(){
		alert("Misslyckades att hämta konto information.");
	});
}

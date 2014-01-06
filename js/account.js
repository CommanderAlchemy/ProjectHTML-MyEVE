getAccountStatus();

function getAccountStatus(){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	var characters = JSON.parse(localStorage.getItem("characters"));
    var accountStatus = [];



    /* Create loop that loops through all characters in localstorage and get information
     * $.each(characters)
     */

    alert(characters[i].Name + " " + characters[i].Id);
	$.ajax({
		url: "server.php",
		data: {type: "getAccountStatus", key: keyID, code: vCode, char: characters[i].Id},
		dataType: "xml"
	}).done(function(data){
		$(data).find('result').each(function(){

            // Query information
            var paidUntil 		= $(this).find("paidUntil").text(),
				createDate 		= $(this).find("createDate").text(),
				logonCount 	    = $(this).find("logonCount").text(),
				logonMinutes    = $(this).find("logonMinutes").text(),
                cachedUntil     = $(this).find("cachedUntil").text();

            // Create object for each character
            var accountObject   = { "CharID"        :   characters[i].Id,
                                    "paidUntil"     :   paidUntil,
                                    "createDate"    :   createDate,
                                    "logonCount"    :   logonCount,
                                    "logonMinutes"  :   logonMinutes,
                                    "cachedUntil"   :   cachedUntil };

            accountStatus.push(accountObject);
    });

    }).fail(function(){
		alert("Misslyckades att hämta konto information.");
	});

    /*
     * Create JSON object and put into localstorage
     */
    var accounts = JSON.stringify(accountStatus);
    localStorage.setItem('Accounts', accounts);
    alert(chars);

}

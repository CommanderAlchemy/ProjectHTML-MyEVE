getAccountStatus(0);
/*
 Get character information for each account.
 This uses EVE - API : https://api.eveonline.com/account/AccountStatus.xml.aspx?
    paidUntil       how long the account is paid for.
    createDate      what date the account was created.
    logonCount      how many times the account was logged in to the eve account.
    logonMinutes    how many minutes the account has been logged in.
*/

// Array that get stored in local storage.
var accountStatus = [];

/*
    This function gets accountinformation using the API above and stores the data
    into a JSON object and then into local storage.

    This function will itterate through all characters located in local storage

    feature: Make application query accounts instead of characters to have information about several accounts.
*/
function getAccountStatus(index){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	var characters = JSON.parse(localStorage.getItem("characters"));

	$.ajax({
		url: "server.php",
		data: {type: "getAccountStatus", key: keyID, code: vCode, char: characters[index].Id},
		dataType: "xml"
	}).done(function(data){
        var cachedUntil         = $(data).find("cachedUntil").text();

		$(data).find("result").each(function(){
            // Query information per character in account
            var paidUntil 		= $(this).find("paidUntil").text(),
				createDate 		= $(this).find("createDate").text(),
				logonCount 	    = $(this).find("logonCount").text(),
				logonMinutes    = $(this).find("logonMinutes").text();

            // Create object for each character
            var accountObject   = { "CharID"        :   characters[index].Id,
                                    "paidUntil"     :   paidUntil,
                                    "createDate"    :   createDate,
                                    "logonCount"    :   logonCount,
                                    "logonMinutes"  :   logonMinutes,
                                    "cachedUntil"   :   cachedUntil };

            // Push caracter object into the accountStatus array
            var character = JSON.stringify(accountObject);
            accountStatus.push(accountObject);

            // If there are more characters left itterate
            if (index < characters.length -1){
                getAccountStatus(++index);
            } else {
                // When the itteration is done store the whole array in localstorage.
                var accounts = JSON.stringify(accountStatus);
                localStorage.setItem("accounts", accounts);
                //lert("accounts" + accounts);
                loadAccountStatus();
            }
    });

    }).fail(function(){
		alert("Misslyckades att hämta karaktär information för kontot");
	});
}

/*
    Load accountinformation into webpage
*/
function loadAccountStatus(){
    var accounts = JSON.parse(localStorage.getItem("accounts"));
    var totalPlayTime,
        paidUntil,
        expires,
        logonCount;

/*    for (var i = accounts.length -1; i > 0; i--){
        totalPlayTime += parseInt(accounts[i].logonMinutes);
    }*/

    totalPlayTime = parseInt(accounts[0].logonMinutes);
    paidUntil = accounts[0].paidUntil;
    logonCount = accounts[0].logonCount;


    var currentDate = new Date();
    expires = new Date(paidUntil);
    currentDate_unixtime = parseInt(currentDate.getTime() / 1000);
    expires_unixtime = parseInt(expires.getTime() / 1000);

    // Difference
    var timeDiffSec = expires_unixtime - currentDate_unixtime;
    var timeDiffHours = timeDiffSec / 60 / 60;
    var timeDiffDays = timeDiffHours  / 24;

    // Convert from minutes to...
    var years = Math.floor(totalPlayTime / 525600);
    totalPlayTime -= (years*525600);

    var months = Math.floor(totalPlayTime / 43800);
    totalPlayTime -= (months*43800);

    var weeks = Math.floor(totalPlayTime / 10080);
    totalPlayTime -= (weeks*10080);

    var days = Math.floor(totalPlayTime / 1440)
    totalPlayTime -= (days*1440);

    var hours = Math.floor(totalPlayTime / 60);
    totalPlayTime -= (hours*60);

    var minutes = totalPlayTime;

    $("#accountExpire").append("om " + Math.floor(timeDiffDays) + " dagar (" + paidUntil + ")");
    $("#logonCount").append(logonCount);
    $("#gametime").append(years + " År, " +
                          months + " Månader, " +
                          weeks + " Veckor, " +
                          days + " Dagar, " +
                          hours + " Timmar, " +
                          minutes + " Minuter");
}






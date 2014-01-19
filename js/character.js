var loadCharSettings = {keyID:localStorage.getItem("keyID"), vCode:localStorage.getItem("vCode"),failMsg:"Misslyckades med att hämta karaktär information"}; 	
/* The loadCharSettings object contains the settings for loadCharacters function.
	- keyID - the keyId stored in localStorage("keyId")
	- vCode - the vCode stored in localStorage("vCode")
	- failMsg - the message to show if the ajax call fails.
*/
var showCharSettings = {previousToggle:null, milliSec:200,imgHeight:128,imgWidth:128, defaultHideSize:128, defaultShowSize:256}; 	
/* The showCharSettings object contains the settings for showCharacterInfo function.
	- milliSec - the milliseconds it takes to toggle the character information.
	- imgHeight - the height of the image.
	- imgWidth  - the width of the image.
	- defaultHideSize  - the default hide size of the image.
	- defaultShowSize  - the default show size of the image.
*/

// Array that get stored in local storage.
var charactersObjects = [];

start();

/*
 * Start function.
*/
function start(){
	loadCharacters();
}
 
/*
 * The function using ajax to retrieve information about the characters on the account.
 */
function loadCharacters(){
	$.ajax({
		url: "server.php",
		data: {type: "getAccountCharacter", key: loadCharSettings.keyID, code: loadCharSettings.vCode},
		dataType: "xml"
	}).done(function(data){
		$(data).find('row').each(function(){
			var characterName 		= $(this).attr('name'),
				characterID 		= $(this).attr('characterID'),
				corporationName 	= $(this).attr('corporationName'),
				corporationID 		= $(this).attr('corporationID'),
				imageID = "http://image.eveonline.com/character/"+characterID+"_256.jpg";
			
			$("#content > ul").append("<li class='characterItem' data-rowId='"+characterID+"'>"+
				"<span>"+characterName+"<img src='"+imageID+"' alt='No Image' style='width:128px; height:128px;'/></span>"+
				"<div style='display:none;'>Corporation Name: "+corporationName+
				"<br>Corporation ID: "+corporationID+"<br>Character ID: "+characterID+"</div></li>");
		});
		$(".characterItem").on("click", showCharacterInfo);
        alert("NuKörVi");
        getCharacterSheet(0);
	}).fail(function(){
		alert(loadCharSettings.failMsg);
	});	
}

function loadCharacterSheet(){
    alert("LoadCharacterSTUB");
}


/*
 * The function shows information about the character the user clicked on.
 */
function showCharacterInfo(){	
	//Sets default image size.
	showCharSettings.imgHeight = showCharSettings.defaultHideSize, 
	showCharSettings.imgWidth  = showCharSettings.defaultHideSize;

	$(".characterItem").children("div").each(function(){
		$(this).slideUp(showCharSettings.milliSec);
	});
	
	//Using animate if wanted.
	$(".characterItem").find('img').each(function(){
		$(this).animate({"width": showCharSettings.imgHeight,"height": showCharSettings.imgWidth}, showCharSettings.milliSec);
	});
	
	if(showCharSettings.previousToggle != $(this).attr('data-rowId')){
		$(this).children("div").slideToggle(showCharSettings.milliSec);	
		
		//If mobile view isn't active defaultShowSize will be used as image size. Else image size won't change.
		if(!mobileMode){
			showCharSettings.imgHeight = showCharSettings.defaultShowSize,
			showCharSettings.imgWidth  = showCharSettings.defaultShowSize;
		}

		//Using animate if wanted.
		$(this).find('img').animate({"width": showCharSettings.imgHeight,"height": showCharSettings.imgWidth}, showCharSettings.milliSec);
		
		//Setting previous toggled row id.
		showCharSettings.previousToggle = $(this).attr('data-rowId');
	}else
		showCharSettings.previousToggle = null;
	
}

function getCharacterSheet(index){
    alert("Getting sheets " + index);
    var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	var characters = JSON.parse(localStorage.getItem("characters"));

	$.ajax({
		url: "server.php",
		data: {type: "getCharacterSheet", key: keyID, code: vCode, char: characters[index].Id},
		dataType: "xml"
	}).done(function(data){
        var cachedUntil             = $(data).find("cachedUntil").text();

		$(data).find("result").each(function(){
            // Query information per character in account
            var name                = $(this).find("name").text(),
				race                = $(this).find("race").text(),
				bloodLine           = $(this).find("bloodLine").text(),
                ancestry            = $(this).find("ancestry").text(),
				gender              = $(this).find("gender").text(),
                corporationName     = $(this).find("corporationName").text(),
                allianceName        = $(this).find("allianceName").text(),
                cloneName           = $(this).find("cloneName").text(),
                cloneSkillPoints    = $(this).find("cloneSkillPoints").text(),
                balance             = $(this).find("balance").text();

            // Create object for each character
            var charObject   = {    "CharID"            :   characters[index].Id,
                                    "name"              :   name,
                                    "race"              :   race,
                                    "bloodLine"         :   bloodLine,
                                    "ancestry"          :   ancestry,
                                    "corporationName"   :   corporationName,
                                    "allianceName"      :   allianceName,
                                    "cloneName"         :   cloneName,
                                    "cloneSkillPoints"  :   cloneSkillPoints,
                                    "balance"           :   balance };

            // Push caracter object into the accountStatus array
            var character = JSON.stringify(charObject);
            alert(character);
            charactersObjects.push(charObject);

            // If there are more characters left itterate
            if (index < characters.length -1){
                getCharacterSheet(++index);
            } else {
                // When the itteration is done store the whole array in localstorage.
                var accounts = JSON.stringify(charactersObjects);
                localStorage.setItem("characterSheet", accounts);
                loadCharacterSheet();
            }
    });

    }).fail(function(){
		alert("Misslyckades att hämta karaktär information för kontot");
	});
}

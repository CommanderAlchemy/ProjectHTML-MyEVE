start();

/*
* Denna funktion använder sig av "Assets" & "Eve-Central"-api:t.
*/

function start(){
	loadCharacters();
	
	loadCharacterAssets($('#characterDropdown :selected').val());
	$('#characterDropdown').on("change", function(e){
		loadCharacterAssets($('#characterDropdown :selected').val());
	});
}

/*
* Load characters from localStorage
*/
function loadCharacters(){
	$("#value").text("(Loading...)");
	
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

/*
* Load character assets
*/
function loadCharacterAssets(charId) {
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");
	
	var items = new Array();
	
	$.ajax({
		url: "server.php",
		data: {type: "getAssets", 
				key: keyID, 
				code: vCode, 
				char: charId},
		dataType: "xml"
	}).done(function(data){
		$(data).find('row').each(function(){
			var type = $(this).attr('typeID');
			var quantity = Number($(this).attr('quantity'));
			
			var itemType = {type: type, quantity: quantity, price: "0"};
			
			items.push(itemType);
		});
		
		var str = JSON.stringify(items);
		localStorage.items = str;
		alert(items.length);
		loadAssetValues(items);
	}).fail(function(){
		alert("Failed to contact API!");
	});
}

function loadAssetValues(items) {
	//var itemType = items[counter].type;
    var searchType = undefined;
    for ( var i = 0; i <= items.length -1; i++ ) {
        if ( i > 0 )
            searchType += "&typeid=" + items[i].type;
        else
            searchType = items[i].type;
    }
   alert(searchType);

	$.ajax({
		type: 'GET',
		url: "server.php",
		data: {type: "getMarket", 
				typeid: searchType},
		dataType: "xml",
		timeout: 10000
	}).done(function(data){
		var array = new Array();
		$(data).find("type").each(function(){
            var typeID  =  $(this).attr("id"),
                price;

             $(this).find("sell").each(function(){
                price   = $(this).find("volume").text();
                alert(price);
             });

            alert(typeID + ", " + price);
        });





/*		items[counter].price = Number(array[array.length - 1]);
		
		if (counter < items.length - 1) {
			loadAssetValues(items, counter + 1);
		} else {
			localStorage.items = JSON.stringify(items);
			calcAssetsValue(items);	
		}*/
	}).fail(function(e){
		alert("Failed to contact API! loadAssets");
	});
}

function calcAssetsValue(items) {
	var value = 0;
	for (var i = 0; i < items.length; i++) {
		value += (items[i].quantity * items[i].price);
	}
	$("#value").text(value.toFixed(2) + " ISK");
}

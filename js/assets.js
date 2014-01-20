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
		type: 'POST',
		url: "server.php",
		data: {type: "getMarket", 
				typeid: searchType},
		dataType: "xml",
		timeout: 10000
	}).done(function(data){
        console.log(data);
        var prices = [];
		$(data).find("type").each(function(){
            var typeID  =  $(this).attr("id"),
                price;

             $(this).find("sell").each(function(){
                price   = $(this).find("median").text();
             });
            console.log(typeID + ", " + price);

            var priceObject   = {   "typeID"    :   typeID,
                                    "price"      :   price };

            prices.push(priceObject);

        });
        localStorage.setItem("prices", JSON.stringify(prices));

        for (var i = 0; i <= prices.length -1; i++){
            var typeID  = prices[i].typeID,
                price   = prices[i].price;

            for(var j = 0; j <= items.length -1; j++) {
                if (typeID == items[j].type)
                    items[j].price = Number(price);
            }
        }
        localStorage.items = JSON.stringify(items);
        calcAssetsValue(items);






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

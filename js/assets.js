var prices = [];
var temp = [];
var size = 0;
var requests = 0,
    arrays = 0,
    loops = 0;

start();

/*
* Denna funktion använder sig av "Assets" & "Eve-Central"-api:t.
*/

function start(){
    localStorage.items = null;
    prices = [];
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
		console.log("Char got " + items.length + " items");
        size = items.length;
        prices = [];
        temp = $.extend(true, [],items);

        loops = 0,
            arrays = 0,
            requests = 0;


		loadAssetValues(items);
	}).fail(function(){
		alert("Failed to contact API!");
	});
}

function loadAssetValues(items) {
    arrays++;
    console.log("ITEMS: " + items.length + " " + JSON.stringify(items));
	//var itemType = items[counter].type;
    var searchType = "";
   while(items.length > 1){
       loadAssetValues(items.splice(0,1));
   }

    for ( var i = 0; i <= items.length -1; i++ ) {
        if ( i > 0 )
            searchType += "&typeid=" + items[i].type;
        else
            searchType = items[i].type;
    }
/*   alert(searchType);*/
	$.ajax({
		type: 'post',
		url: "server.php",
		data: {type: "getMarket", 
				typeid: searchType},
		dataType: "xml",
		timeout: 800000
	}).done(function(data){
        requests++;
		$(data).find("type").each(function(){


            loops++;

            var typeID  =  $(this).attr("id"),
                price;



             $(this).find("sell").each(function(){
                price   = $(this).find("median").text();
             });

            var priceObject   = {   "typeID"    :   typeID,
                                    "price"      :   price };

            prices.push(priceObject);

        });

        console.log("Prices storage is " + prices.length);
        console.log("Contents " + JSON.stringify(prices));
        console.log("Requests completed: " + requests);
        console.log("Arrays created: " + arrays);
        console.log("Data IDs parsed: " + loops);
        if(prices.length == size){
        localStorage.setItem("prices", JSON.stringify(prices));

        for (var i = 0; i <= prices.length -1; i++){
            var typeID  = prices[i].typeID,
                price   = prices[i].price;

            for(var j = 0; j <= temp.length -1; j++) {
                if (typeID == temp[j].type)
                    temp[j].price = Number(price);
            }
        }
        localStorage.items = JSON.stringify(temp);
        console.log(JSON.stringify(temp));
        calcAssetsValue(temp);
        }






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
    console.log(temp.length + " went to calculate quantity");
	var value = 0;
	for (var i = 0; i < items.length; i++) {
		value += (items[i].quantity * items[i].price);
	}
	$("#value").text(value.toFixed(2) + " ISK");
}

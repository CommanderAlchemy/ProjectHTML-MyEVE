var map;
start();
initializeDistanceFields();
	
function start(){
	$("#calculate").on("click", calculate);
	startLoad();
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(initialize, showError, {enableHighAccuracy: true});;				
	}else{
		alert("Din webbläsare stödjer inte geolocation");
	}
}

function initialize(position) {
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var markers = [];
	
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(latitude, longitude),
		new google.maps.LatLng(latitude, longitude));
	map.fitBounds(defaultBounds);

	// Create the search box and link it to the UI element.
	var input = /** @type {HTMLInputElement} */(document.getElementById('pac-input'));
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var searchBox = new google.maps.places.SearchBox(/** @type {HTMLInputElement} */(input));

	// Listen for the event fired when the user selects an item from the
	// pick list. Retrieve the matching places for that item.
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		var places = searchBox.getPlaces();
		for (var i = 0, marker; marker = markers[i]; i++) {
			marker.setMap(null);
		}

		// For each place, get the icon, place name, and location.
		markers = [];
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++) {
			var image = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			var marker = new google.maps.Marker({
				map: map,
				icon: image,
				title: place.name,
				position: place.geometry.location
			});

			markers.push(marker);

			bounds.extend(place.geometry.location);
		}

		map.fitBounds(bounds);
	});
	
	var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        title: 'You'
    });

	// Bias the SearchBox results towards places that are within the bounds of the
	// current map's viewport.
	google.maps.event.addListener(map, 'bounds_changed', function() {
		var bounds = map.getBounds();
		searchBox.setBounds(bounds);
	});
	stopLoad();
}

google.maps.event.addDomListener(window, 'load', initialize);

var fieldOneLatLon;
var fieldTwoLatLon;

function initializeDistanceFields() {
	fieldOne = new google.maps.places.Autocomplete(/** @type {HTMLInputElement} */(document.getElementById('fieldOne')),{ types: ['geocode'] });
	
	google.maps.event.addListener(fieldOne, 'place_changed', function() {
		fieldOneLatLon = new google.maps.LatLng(fieldOne.getPlace().geometry.location.lat(), fieldOne.getPlace().geometry.location.lng());
		autocompleteField(fieldOne);
	});
	
	fieldTwo = new google.maps.places.Autocomplete(/** @type {HTMLInputElement} */(document.getElementById('fieldTwo')),{ types: ['geocode'] });
	
	google.maps.event.addListener(fieldTwo, 'place_changed', function() {
		fieldTwoLatLon = new google.maps.LatLng(fieldTwo.getPlace().geometry.location.lat(), fieldTwo.getPlace().geometry.location.lng());
		autocompleteField(fieldTwo);
	});
}

function autocompleteField(field) {
	var place = field.getPlace();
	
	for (var component in componentForm) {
		document.getElementById(component).value = '';
		document.getElementById(component).disabled = false;
	}

	for (var i = 0; i < place.address_components.length; i++) {
		var addressType = place.address_components[i].types[0];
		if (componentForm[addressType]) {
			var val = place.address_components[i][componentForm[addressType]];
			document.getElementById(addressType).value = val;
		}
	}
}

function calculate(){
	$("#result").html("Avståndet mellan de två angivna platserna är: "+(google.maps.geometry.spherical.computeDistanceBetween(fieldOneLatLon, fieldTwoLatLon) / 1000).toFixed(2)+"km.");
}

function showError(error){
	alert("Något är fel...");
}
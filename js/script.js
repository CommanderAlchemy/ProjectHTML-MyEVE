$(document).on("ready", start);
//Variables.
var mobileMode =false;
var mobileSize = 500;
var menuOpen = false;
var loading = false;

//Shows loading message.
function startLoad(){
	$('#loading').show();
	loading = true;
    console.log("START: Loading...");
}

//Hides loading message.
function stopLoad(){
	$("#loading").hide();
	loading = false;
    console.log("STOP: Loading...");
}

//Shows loading information when ajax is used.
function setAjaxLoadingListener(){
	$('#loading').hide();

	$(document).ajaxStart(function () {
		startLoad();
        console.log("Ajax: START");
	});

	$(document).ajaxComplete(function () {
		stopLoad();
        console.log("Ajax: Complete");
	});

    $(document).ajaxError(function (e, xhr, options, error) {
        stopLoad();
        console.log("\n\nAjax: Error BEGIN \n>>>>>>>>>>>>>>>>>\n\n" + error + "\n");
        console.log(e);
        console.log(xhr);
        console.log(options);
        console.log("\n\n<<<<<<<<<<<<<<< \nAjax: Error END\n\n");
    });
}

//Start function. Initiates the functions of the site.
function start(){
	checkWidth();
	isLocalStorageSupported();
	initMenuListener();
	checkSettings();
	setAjaxLoadingListener();
	
	//$(body).on(ajaxLoading);
	
	$("#menuButton").on("click", toggleMenu);
	$(window).resize(checkWidth);
}

function checkSettings(){
	if(localStorage.getItem("vCode") == null || localStorage.getItem("keyID") == null){
		loadPage("ajax/settings.html");
	}else{
		loadUserCharacters();
		loadPage("ajax/character.html");
	}
}

//Loading characters from current account.
function loadUserCharacters(){
	var keyID	 	= localStorage.getItem("keyID");
	var vCode	 	= localStorage.getItem("vCode");

	$.ajax({
		url: "server.php",
		data: {type: "getAccountCharacter", key: keyID, code: vCode},
		dataType: "xml"
	}).done(function(data){	
		var characters = [];
		localStorage.setItem("characters", "");
		
		//Saving characters.
		$(data).find('row').each(function(){
			var characterName 		= $(this).attr('name');
			var characterID 		= $(this).attr('characterID');
			
			var characterObject= {"Name":characterName,"Id":characterID};
			characters.push(characterObject);
		});
		var chars = JSON.stringify(characters);
		localStorage.setItem('characters', chars);	
		alert(chars);

	}).fail(function(){
		alert("Misslyckades att hämta konto-information.");
	});	
}


//Initiates the menu listener.
function initMenuListener(){
	$("nav > a").on("click", function(e){
		e.preventDefault();
		var page = $(this).attr("href");
		loadPage(page);
	});
}

//Checks the screen width.
//If the screen width is below 500 the nav will be hidden and mobileMode will be true.
function checkWidth(){
	if($(window).width() < mobileSize)
		mobileMode=true;
	else
		mobileMode=false;
	
	if(mobileMode){
		$("nav").hide();
		$("header").show();
	}else{
		$("nav").show();
		$("header").hide();
	}
}

//Checks if localStorage is available.
function isLocalStorageSupported() {
	try {
		if('localStorage' in window && window['localStorage'] !== null){
			//alert("localstorage is available");
		}
	} catch (e) {
		alert("localstorage not supported");
	}
}

//Toggles the menu. Up or down.
function toggleMenu(){
	$("nav").slideToggle();
	if(menuOpen)
		menuOpen=false;
	else
		menuOpen=true;
}

//Loads a page (content) with ajax.
function loadPage(page){
	if(!loading){
		$.ajax({
			url: page,
			async: false
		}).done(function(data){
			$('article').html(data);
			if(mobileMode==true && menuOpen)
				toggleMenu();
		}).fail(function(){
			alert("Det blev något fel");
		});
	}
	
	if(page == "ajax/character.html")
		start();
	
}

$(document).on("ready", start);

//Variables.
var mobileMode=false;
var mobileSize = 500;
var menuOpen = false;
var loading = false;

//Shows loading message.
function startLoad(){
	$('#loading').fadeIn(150);
	loading = true;
}

//Hides loading message.
function stopLoad(){
	$("#loading").fadeOut(150);
	loading = false;
}

//Start function. Initiates the functions of the site.
function start(){
	checkWidth();
	isLocalStorageSupported();
	loadSettings();
	initMenuListener();
	checkSettings();
	
	//$(body).on(ajaxLoading);
	
	$("#menuButton").on("click", toggleMenu);
	$(window).resize(checkWidth);
}

function checkSettings(){
	if(localStorage.getItem("vCode") == null || localStorage.getItem("keyID") == null){
		loadPage("ajax/settings.html");
	}else{
		loadPage("ajax/character.html");
	}
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
	
	if(mobileMode)
		$("nav").hide();
	else
		$("nav").show();
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

//Loads user information from localstorage. 
function loadSettings(){
	$("#user").html(localStorage.getItem("name"));
	$("#bestMovie").html(localStorage.getItem("bestmovie"));
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
		startLoad();
		
		$.ajax({
			url: page
		}).done(function(data){
			stopLoad();
			$('article').html(data);
			if(mobileMode==true && menuOpen)
				toggleMenu();
			
		}).fail(function(){
			alert("Det blev något fel");
		});
	}
}
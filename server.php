<?php
	if(isset($_GET['type']) && $_GET['type'] == "getAccountCharacter"){
		getAccountCharacter();
	}

	if(isset($_GET['character'])){
		header('Content-Type: text');
		$file = "http://image.eveonline.com/character/".$_GET['character'];
		$fp = fopen($file, "r");
		$data = fread($fp, 80000);
		fclose($fp);
		echo $data;
	}else if(isset($_GET['type']) and $_GET['type'] == "combat"){
		header('Content-Type: text/xml');
		$file = "https://api.eveonline.com/char/KillLog.xml.aspx?keyID=".$_GET['key']."&vCode=".$_GET['code']."characterID=".$_GET['character'];
		$fp = fopen($file, "r");
		$data = fread($fp, 80000);
		fclose($fp);
		echo $data;
	}
	
	/*
	 * Using this function to validate account keyID and vCode.
	 * This function also returns characters.
	 */
	function getAccountCharacter(){
		if(isset($_GET['key']) and isset($_GET['code'])){
			header('Content-Type: text/xml');
			$file = "http://api.eve-online.com/account/Characters.xml.aspx?keyID=".$_GET['key']."&vCode=".$_GET['code'];
			$fp = fopen($file, "r");
			$data = fread($fp, 80000);
			fclose($fp);
			echo $data;
		}
	}
?> 
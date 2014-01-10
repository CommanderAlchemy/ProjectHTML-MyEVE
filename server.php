<?php
	if(isset($_GET['type']) && $_GET['type'] == "getAccountCharacter"){
		getAccountCharacter();

	}else if(isset($_GET['type']) && $_GET['type'] == "combat"){
		getBattleLog();

	}else if(isset($_GET['type']) && $_GET['type'] == "getAccountStatus"){
		getAccountStatus();

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
	
	/*
	 * Pjär danskjävel dokumentera!
	 */
	 function getBattleLog(){
		 if(isset($_GET['key']) and isset($_GET['code']) and isset($_GET['char'])){
			header('Content-Type: text/xml');
			$file = "http://api.eve-online.com/char/KillLog.xml.aspx?keyID=".$_GET['key']."&vCode=".$_GET['code']."&characterID=".$_GET['char'];
			$fp = fopen($file, "r");
			$data = fread($fp, 80000);
			fclose($fp);
			echo $data;
		}
	 }

    /*
     * Get account information
     */
    function getAccountStatus(){
         if(isset($_GET['key']) and isset($_GET['code']) and isset($_GET['char'])){
            header('Content-Type: text/xml');
            $file = "https://api.eveonline.com/account/AccountStatus.xml.aspx?keyID=".$_GET['key']."&vCode=".$_GET['code']."&characterID=".$_GET['char'];
            $fp = fopen($file, "r");
			$data = fread($fp, 80000);
			fclose($fp);
			echo $data;
        }
    }
?>

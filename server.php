<?php
	if(isset($_GET['type']) && $_GET['type'] == "getAccountCharacter") {
		getAccountCharacter();
	}else if(isset($_GET['type']) && $_GET['type'] == "getAccountStatus") {
		getAccountStatus();
    }else if(isset($_GET['type']) && $_GET['type'] == "getAssets") {
        getCharacterSheet();
	}else if(isset($_GET['type']) && $_GET['type'] == "getAssets") {
		getAssets();
	}else if(isset($_GET['type']) && $_GET['type'] == "getCharacterSheet") {
		getMarket();	
	}

	/*if(isset($_GET['character'])){
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
	}*/
	
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
     * Get character sheet
     */
    function getCharacterSheet(){
         if(isset($_GET['key']) and isset($_GET['code']) and isset($_GET['char'])){
            header('Content-Type: text/xml');
            $file = "https://api.eveonline.com/char/CharacterSheet.xml.aspx?keyID=".$_GET['key']."&vCode=".$_GET['code']."&characterID=".$_GET['char'];
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
	
	/*
	 * Get list of assets.
	 */
	function getAssets() {
		if(isset($_GET['key']) and isset($_GET['code']) and isset($_GET['char'])){
            header('Content-Type: text/xml');
            $file = "https://api.eveonline.com/char/AssetList.xml.aspx?keyID=".$_GET['key']."&vCode=".$_GET['code']."&characterID=".$_GET['char'];
            $fp = fopen($file, "r");
			$data = '';
			while(!feof($fp)) {
				$data .= fread($fp, 20000);
			}
			fclose($fp);
			echo $data;
        }
	}
	
	/*
	<?php
$handle = fopen("http://www.example.com/", "rb");
$contents = '';
while (!feof($handle)) {
  $contents .= fread($handle, 8192);
}
fclose($handle);
?>*/
	
	/*
	 * Get sales of an item.
	 */
	function getMarket() {
		if(isset($_GET['typeid'])){
            header('Content-Type: text/xml');
            $file = "http://api.eve-central.com/api/marketstat?typeid=".$_GET['typeid'];
            $fp = fopen($file, "r");
			$data = fread($fp, 80000);
			fclose($fp);
			echo $data;
        }
	}
?>

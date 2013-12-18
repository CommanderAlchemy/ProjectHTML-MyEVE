<?php
	if(isset($_GET['key']) and isset($_GET['code'])){
		header('Content-Type: text/xml');
		$file = "http://api.eve-online.com/account/Characters.xml.aspx?keyID=".$_GET['key']."&vCode=".$_GET['code'];
		$fp = fopen($file, "r");
		$data = fread($fp, 80000);
		fclose($fp);
		echo $data;
	}
	//balbalbalblalba
	
?> 
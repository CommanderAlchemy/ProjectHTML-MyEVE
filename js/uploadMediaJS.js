start();

function start(){
	$("#typeDropdown").on("change", changeMedia);
	$("#clearButton").on("click", clearForm);
	$("#clearButton").hide();
	clearButton
	setupMediaForm();
	stopLoad();
}

function clearForm(){
	$('#mediaForm').trigger("reset");
	$("#clearButton").hide();
	$("#saveForm").removeAttr("disabled");   
	$("#saveForm").attr("value", "Ladda upp!");
	$("#mediaType").html("");
}

function setupMediaForm(){
	$('#mediaForm').on("submit", function(e){		
		e.preventDefault();
		$('#mediaForm').ajaxSubmit({
			success: function(data) { 
				$("#saveForm").attr("value", "Uppladdningen är klar!");
				$("#saveForm").attr("disabled", "disabled");
				$("#clearButton").show();
			},
			uploadProgress: function(event, position, total, percentComplete){
				$("#saveForm").attr("value", "Laddar:"+percentComplete+"%");
			}
		}); 
	});
}

function changeMedia(){
	$("#mediaType").html("");

	$("#mediaType").append("<label class='description' for='element_1'>Välj fil</label><div>");
	if ($("#typeDropdown").val() == "photo"){
		$("#mediaType").append("<input type='file' name='media' accept='image/*' class='element file' capture='camera'>");
	}else if($("#typeDropdown").val() == "audio"){
		$("#mediaType").append("<input type='file' name='media' accept='audio/*' class='element file' capture='microphone'>");
	}else if($("#typeDropdown").val() == "video"){
		$("#mediaType").append("<input type='file' name='media' accept='video/*' class='element file' capture='camcorder'>");
	}
	$("#mediaType").append("</div><div id='mediaInfo'></div>");		

	if($("#typeDropdown").val() == ""){
		$("#mediaType").html("");
	}	
}
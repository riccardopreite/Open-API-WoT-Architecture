

function closePlant(){
	$("#openPlant").attr('checked',false);
	$.ajax({
		url: "/closePlant",
		success: function(result){
			alert("plant convered!")
		}
	})

}

function openCoverPlant(){
	let urlServer = ""
	$("#spinnerDiv").show();
	$("#spinner").show();
	$("#plantRefresh").attr("disabled",true)
	$('#checkStatusTable').hide();	var isCover = false
	if(!document.getElementById("openCoverPlant").checked) {
		urlServer = "/closePlant"
		isCover = true
	}
	else{
		urlServer = "/openPlant"
		isCover = false
	}
	$.ajax({
		url: urlServer,
		success: function(result){
			
			if(result == "Motor runned"){
				document.getElementById("isCoverValue").innerHTML = isCover
				document.getElementById("openCoverPlant").checked = !isCover
				$("#spinnerDiv").hide()
				$("#spinner").hide()
				$("#plantRefresh").attr("disabled",false)
				$('#checkStatusTable').show();
				if(isCover) alert("plant covered!")
				else alert("plant opened!")
			}
			else{
				document.getElementById("isCoverValue").innerHTML = !isCover
				document.getElementById("openCoverPlant").checked = isCover
				$("#spinnerDiv").hide()
				$("#spinner").hide()
				$("#plantRefresh").attr("disabled",false)
				$('#checkStatusTable').show();
				alert(result)
		}
	}
	})
}
function populateCheckStatusModal(id) {
	$("#spinnerDiv").show();
	$("#spinner").show();
	$('#checkStatusTable').hide();
	$("#plantRefresh").attr("disabled",true)
	$('#'+id).modal('show');
	$.ajax({
		url: "/getPlantStatus",
		success: function(result){
			document.getElementById("isCoverValue").innerHTML = result["isCover"]
			document.getElementById("weatherValue").innerHTML = result["weather"].replace("type","")
			document.getElementById("lastChangeValue").innerHTML = result["lastChange"]
			document.getElementById("soilSensorValue").innerHTML = "To be implemented"
			document.getElementById("openCoverPlant").checked = !result["isCover"]
			$("#spinnerDiv").hide()
			$("#spinner").hide()
			$("#plantRefresh").attr("disabled",false)
			$('#checkStatusTable').show();
		}
	})
}

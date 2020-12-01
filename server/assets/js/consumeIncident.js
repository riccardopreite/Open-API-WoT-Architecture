var incidentText = ""
function populateIncidentStatusModal(id) {
	$("#spinnerDiv").show();
	$("#spinner").show();
	$("#incidentRefresh").attr("disabled",true)
	$('#checkIncidentTable').hide();
	$('#'+id).modal('show');
	var lat = document.getElementById("updatelat").value, lon = document.getElementById("updatelon").value
	$.ajax({
		url: "/getIncidentStatus?lat="+lat+"&lon="+lon,
		success: function(result){
			document.getElementById("bodyIncident").innerHTML = ""
			incidentText = "";
			var index = 1,toAdd ="";
			for(var key in result["incident"]){
				toAdd += '<tr><th scope="row">'+index+'</th>'
				for(var ke in result["incident"][key]){
					if(result["incident"][key] == "Error" || JSON.stringify(result["incident"][key]) === '{}'){
						
							incidentText = "Nothing has been found."
					}
					else{
						if(typeof result["incident"][key][ke] == typeof {}){
							recursiveTextIncident(result["incident"][key][ke])
							if(incidentText == "") incidentText = "Nothing has been found.";
						}
						else{
							incidentText = ke+": " +result["incident"][key][ke]+";";
						}
					}
					toAdd += '<td id="'+ke+'Value">'+incidentText+'</td>'
					incidentText=""
				}
				toAdd += '</tr></tbody>'
				index++;
			}
			console.log(toAdd)
			document.getElementById("bodyIncident").innerHTML = toAdd
			$("#spinnerDiv").hide()
			$("#spinner").hide()
			$("#incidentRefresh").attr("disabled",false)
			$('#checkIncidentTable').show();
		}
	})
}
function recursiveTextIncident(res){
	for(var key in res){
		if(typeof res[key] == typeof {}) recursiveTextIncident(res[key])
		else incidentText += "	"+key+":	"+res[key]+";\n"
	}
}

var trafficText = "",incidentText="";
function populateCheckStatusModal(id) {
	$("#spinnerDiv").show();
	$("#spinner").show();
	$("#weatherRefresh").attr("disabled",true)
	$('#checkWeatherTable').hide();
	$('#'+id).modal('show');
	$.ajax({
		url: "/getWeatherStatus",
		success: function(result){
			document.getElementById("bodyGoingOut").innerHTML = ""
			document.getElementById("bodyGoingOut").innerHTML += '<tr><th scope="row">1</th><td>Weather</td><td id="weatherValue"></td></tr><tr><th scope="row">2</th><td>Wind</td><td id="windValue"></td></tr><tr><th scope="row">3</th><td>Coat</td><td id="coatValue"></td></tr><tr><th scope="col">4</th><td>Umbrella</td><td id="umbrellaValue"></td></tr>'
			document.getElementById("weatherValue").innerHTML = result["weather"].replace("type","")
			document.getElementById("windValue").innerHTML = result["wind"]
			document.getElementById("coatValue").innerHTML = result["coat"]
			document.getElementById("umbrellaValue").innerHTML = result["umbrella"]
			trafficText = "";
			incidentText="";
			var index = 5,toAdd ="";
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
			document.getElementById("bodyGoingOut").innerHTML += toAdd
			/*for(var key in result["incident"]){
				if(result["incident"][key] == "Error"){
							incidentText = "Nothing has been found."
						}
						else{
							recursiveTextIncident(result["incident"][key])
							if(incidentText == "") incidentText = "Nothing has been found.";
						}
					document.getElementById("bodyGoingOut").innerHTML += '<tr><th scope="row">'+index+'</th><td>'+key+'</td><td id="'+key+'Value">'+incidentText+'</td></tr></tbody>'
					index++;
					incidentText=""
				for(var ke in result["incident"][key]){
					
				}
			}*/
			toAdd = ""
			for(var api in result["traffic"]){
				for(var key in result["traffic"][api]){
					toAdd += '<tr><th scope="row">'+index+'</th>'
					if(result["traffic"][api][key] == "Error" || JSON.stringify(result["traffic"][api][key]) === '{}'){
							console.log("nothing 1 ")
								trafficText = "Nothing has been found."
					}
					else{
						if(typeof result["traffic"][api][key] == typeof {}){
							recursiveTextTraffic(result["traffic"][api][key])
							if(trafficText == "") {
								console.log("nothing 2 ")
								trafficText = "Nothing has been found.";
							}
						}
						else{
							trafficText = key+": " +result["traffic"][api][key]+";";
						}
					}
					toAdd += '<td id="'+key+'Value">'+trafficText+'</td>'
					trafficText=""
					toAdd += '</tr></tbody>'
					index++;
				}
			}
			document.getElementById("bodyGoingOut").innerHTML += toAdd
			$("#spinnerDiv").hide()
			$("#spinner").hide()
			$("#weatherRefresh").attr("disabled",false)
			$('#checkWeatherTable').show();
		}
	})
}
function recursiveTextTraffic(res){
	for(var key in res){
		if(typeof res[key] == typeof {}) recursiveTextTraffic(res[key])
		else trafficText += "	"+key+":	"+res[key]+";\n"
	}
}
function recursiveTextIncident(res){
	for(var key in res){
		if(typeof res[key] == typeof {}) recursiveTextIncident(res[key])
		else incidentText += "	"+key+":	"+res[key]+";\n"
	}
}

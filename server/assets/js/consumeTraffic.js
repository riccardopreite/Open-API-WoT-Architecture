var trafficText = ""
function populateTrafficStatusModal(id) {
	$("#spinnerDiv").show();
	$("#spinner").show();
	$("#trafficRefresh").attr("disabled",true)
	$('#checkTrafficTable').hide();
	$('#'+id).modal('show');
	var lat = document.getElementById("updatelat").value, lon = document.getElementById("updatelon").value
	$.ajax({
		url: "/getTrafficStatus?lat="+lat+"&lon="+lon,
		success: function(result){
			document.getElementById("bodyTraffic").innerHTML = ""
			trafficText = "";
			var index = 1,toAdd ="";
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
			document.getElementById("bodyTraffic").innerHTML = toAdd
			
			$("#spinnerDiv").hide()
			$("#spinner").hide()
			$("#trafficRefresh").attr("disabled",false)
			$('#checkTrafficTable').show();
		}
	})
}
function recursiveTextTraffic(res){
	for(var key in res){
		if(typeof res[key] == typeof {}) recursiveTextTraffic(res[key])
		else trafficText += "	"+key+":	"+res[key]+";\n"
	}
}

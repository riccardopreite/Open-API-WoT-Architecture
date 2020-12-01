var soilText = ""
function populateSoilStatusModal(id) {
	$("#spinnerDiv").show();
	$("#spinner").show();
	$("#trafficRefresh").attr("disabled",true)
	$('#checkTrafficTable').hide();
	$('#'+id).modal('show');
	var lat = document.getElementById("updatelat").value, lon = document.getElementById("updatelon").value
	$.ajax({
		url: "/getSoilStatus?lat="+lat+"&lon="+lon,
		success: function(result){
			document.getElementById("bodySoil").innerHTML = ""
			soilText = "";
			var index = 3,toAdd ="";
			toAdd += '<tr><th scope="row">'+1+'</th><td id="tempAVGValue">Soil Avg: '+result["tempAVG"]+'</td></tr>'
			toAdd += '<tr><th scope="row">'+2+'</th><td id="pollenAVGValue">Pollen Avg: '+result["pollenAVG"]+'</td></tr>'
			for(var api in result["data"]){
				for(var key in result["data"][api]){
					toAdd += '<tr><th scope="row">'+index+'</th>'
					if(result["data"][api][key] == "Error" || JSON.stringify(result["data"][api][key]) === '{}'){
							console.log("nothing 1 ")
								soilText = "Nothing has been found."
					}
					else{
						if(typeof result["data"][api][key] == typeof {}){
							recursiveTextSoil(result["data"][api][key])
							if(soilText == "") {
								console.log("nothing 2 ")
								soilText = "Nothing has been found.";
							}
						}
						else{
							soilText = key+": " +result["data"][api][key]+";";
						}
					}
					toAdd += '<td id="'+key+'Value">'+soilText+'</td>'
					soilText=""
					toAdd += '</tr></tbody>'
					index++;
				}
			}
			document.getElementById("bodySoil").innerHTML = toAdd
			$("#spinnerDiv").hide()
			$("#spinner").hide()
			$("#trafficRefresh").attr("disabled",false)
			$('#checkTrafficTable').show();
		}
	})
}
function recursiveTextSoil(res){
	for(var key in res){
		if(typeof res[key] == typeof {}) recursiveTextSoil(res[key])
		else soilText += "	"+key+":	"+res[key]+";\n"
	}
}

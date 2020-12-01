var asteroidText = ""
function populateAsteroidStatusModal(id) {
	$("#spinnerDiv").show();
	$("#spinner").show();
	$("#trafficRefresh").attr("disabled",true)
	$('#checkTrafficTable').hide();
	$('#'+id).modal('show');
	$.ajax({
		url: "/getAsteroidStatus",
		success: function(result){
			console.log(result)
			document.getElementById("bodyAsteroid").innerHTML = ""
			asteroidText = "";
			var index = 1,toAdd ="";
			for(var ind in result){
				let id = result[ind].split("neo/")
				id = id[1].split("?")
				toAdd += '<tr><th scope="row">'+index+'</th>'
				toAdd += '<td id="'+ind+'Value"><a href='+result[ind]+'>'+id[0]+'</a></td></tr>'
				index++;
			}
			document.getElementById("bodyAsteroid").innerHTML = toAdd
			$("#spinnerDiv").hide()
			$("#spinner").hide()
			$("#trafficRefresh").attr("disabled",false)
			$('#checkTrafficTable').show();
		}
	})
}
function recursiveTextAsteroid(res){
	for(var key in res){
		if(typeof res[key] == typeof {}) recursiveTextAsteroid(res[key])
		else asteroidText += "	"+key+":	"+res[key]+";\n"
	}
}

var cloudText = ""
async function loadWeatherIcon(){
	$.ajax({url: "/loadWeatherIcon", success: function(result){
		console.log("UPDATE ICON WEATHER");
		$(document).ready(function () {
			let icon = "",i = document.getElementById("consumeWeatherIcon")
			switch(result["weather"]){
				case "typeSunny":
				icon = 'fas fa-sun'
				break;
			case "typeCloudy":
				icon = 'fas fa-cloud'
				break;
			case "typeRain":
				icon = 'fas fa-cloud-showers-heavy'
				break;
			case "typeHail":
				icon = 'fas fa-snowflake'
				break;
			case "typeFog":
				icon = 'fas fa-smog"'
				break;
			case "typeSnow":
				icon = 'fas fa-snowflake'
				break;
			}
			i.className = icon;
		})
	  }
	});
}

async function loadTempIcon(){
	$.ajax({
		url: "/loadTempIcon",
		success: function(result){
			console.log("UPDATE ICON TEMPERATURE");
			let icon = "";
			switch(true){
				case result["temp"] == 0:
				icon = "fas fa-thermometer-empty"
				break;
			case result["temp"] > 0 && result["temp"] < 6:
				icon = "fas fa-temperature-low"
				break;
			case result["temp"] >= 6 && result["temp"] < 15:
				icon = "fas fa-thermometer-quarter"
				break;
			case result["temp"] >= 16 && result["temp"] < 25:
				icon = "fas fa-thermometer-half"
				break;
			case result["temp"]>= 25 && result["temp"] < 28:
				icon = "fas fa-thermometer-three-quarters"
				break;
			case result["temp"] >= 28:
				icon = "fas fa-temperature-high"
				break;
			default:
				
			}
			$("#consumeTemperatureIcon").attr("class",icon)
	  }
	});
}

function populateCheckStatusModal(requested,hidden1,hidden2,hidden3) {
	$("#spinnerDiv").show();
	$("#spinner").show();
	$('#checkWeatherTable').hide();
	$("#weatherRefresh").attr("disabled",true)
	$("#checkStatusWeather").modal('show');


	$.ajax({
		url: "/get"+requested+"Status",
		success: function(result){
			let type = ""
			$("#spinnerDiv").hide()
			$("#spinner").hide()
			$("#weatherRefresh").attr("disabled",false)
			$("#weatherRefresh").attr("onclick","populateCheckStatusModal("+requested+","+hidden1+","+hidden2+","+hidden3+")")
			switch(requested){
				case "tempBody":
					type = "Temperature";
					$('#tempRow').show();
					$('#weatherRow').hide();
					$('#windRow').hide();
					document.getElementById("tempHead").innerHTML = 1
					requested = "weatherBody";
					hidden2 = "cloudBody";
					document.getElementById("tempValue").innerHTML = result["temp"]
					break;
				case "weatherBody":
					type = "Weather";
					$('#weatherRow').show();
					$('#tempRow').show();
					$('#windRow').show();
					document.getElementById("tempHead").innerHTML = 3
					document.getElementById("weatherValue").innerHTML = result["weather"].replace("type","")
					document.getElementById("windValue").innerHTML = result["wind"]
					document.getElementById("tempValue").innerHTML = result["temp"]
					break;
				case "cloudBody":
					type = "Cloud";
					cloudText = ""
					document.getElementById("cloudBody").innerHTML = ""
					var index = 1
					for(var api in result){
						if(result[api] == "Error"){
							cloudText = "Nothing has been found."
						}
						else{
							recursiveCloudText(result[api])
							if(cloudText == "") cloudText = "Nothing has been found.";
						}
						document.getElementById("cloudBody").innerHTML += '<tr><th scope="row">'+index+'</th><td>'+api+'</td><td id="'+api+'Value">'+cloudText+'</td></tr></tbody>'
						index++
						cloudText = ""
					}
					break;
				case "windBody":
					type = "Wind";
					$('#weatherRow').hide();
					$('#tempRow').hide();
					$('#windRow').show();
					requested = "weatherBody";
					hidden2 = "cloudBody";
					document.getElementById("windValue").innerHTML = result["wind"]
					break;
				default:
					break;

			}
			$('#checkWeatherTable').show();
			document.getElementById("consumeWeatherCaption").innerHTML = type + " Detection."
			$('#'+requested).show();
			$('#'+hidden1).hide();
			$('#'+hidden2).hide();
			$('#'+hidden3).hide();
		}
	})
}
function recursiveCloudText(res){
	for(var key in res){
		if(typeof res[key] == typeof {}) recursiveCloudText(res[key])
		else cloudText += "	"+key+":	"+res[key]+";\n"
	}
}

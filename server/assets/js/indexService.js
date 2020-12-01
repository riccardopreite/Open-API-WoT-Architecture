async function loadWeatherIcon(){
	$.ajax({url: "/loadWeatherIcon", success: function(result){
		$(document).ready(function () {
			let icon = "",i = document.getElementById("goingOutControlIcon")
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

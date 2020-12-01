var path = require('path');
var __dirname = path.resolve();
var axios = require("axios")
const fs = require('fs');
var jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/apiDict.json'));
var apiJson = JSON.parse(jsonFile);

var jsonWeather = fs.readFileSync(path.join(__dirname, '/ontology/ontologyWeatherType.json'));
var weatherJson = JSON.parse(jsonWeather);

var actionUtils, ontology, arduino,prop, crawler, servientIP;
var Servient = require("@node-wot/core").Servient
var Helpers = require("@node-wot/core").Helpers

var WoT,WoTHelpers;

var CoapClientFactory = require("@node-wot/binding-coap").CoapClientFactory
let servient = new Servient();
servient.addClientFactory(new CoapClientFactory(null));
WoTHelpers = new Helpers(servient);
    // RENAME TO UTILS
module.exports = {
	setVar: async function setVar(wot){
    WoT = wot
		crawler = require(path.join(__dirname, '/crawler/crawler.js'))
    arduino = require(path.join(__dirname, '/microcontroller/arduino.js'))
    prop = require(path.join(__dirname, '/thingUtils/propertiesUtils.js'))
    ontology = require(path.join(__dirname, '/ontology/ontology.js'))
    actionUtils = require(path.join(__dirname, '/thingUtils/actionUtils.js'))
		servientIP = crawler.getServientIp()

  },
  checkWeatherTrafficIncidentMoving: async function checkWeatherTrafficIncidentMoving(lat,lon){
	return new Promise(async (resolve, reject) => {
		let json = {}
		if(lat == "" || lon == "" || lat == null || lon == null || lat == undefined || lon == undefined) {
			lat = 44;
			lon = 11;
		}
		let split = [lat,lon,1]
		var end = new Date();
		var start = new Date(end.getDate() - 1);
		let temp = await actionUtils.getIncidents(null,apiJson,start,end);
		json["incident"] = await getIncidentFilteredInSquare(split,temp);
		json["traffic"] = await actionUtils.getTrafficFiltered(split,apiJson,null)
		json["weather"] = await getWeatherJson();
		arduino.communicateWeatherToArduinoMoving(json)
		resolve(json)
	});

  },
  checkWeatherMotor: async function checkWeatherMotor(){
	  return new Promise(async (resolve, reject) => {
		let json = await getWeatherJson();
		resolve(json)
	});
    //arduino.communicateWeatherToArduinoMotor(json["weather"],json["wind"])
  },
  checkPlantStatus: async function checkPlantStatus(){
	  return new Promise(async (resolve, reject) => {
		WoTHelpers.fetch("coap://"+servientIP+":5683/DC_Motor_For_Plant_Cover").then(async (td) => {
			var thing = await WoT.consume(td);
			var toResolve = {}
			let json = await getWeatherJson();
			toResolve["weather"] = json["weather"]
			await thing.readMultipleProperties(["isCover","lastChange"]).then(async (prop) => {
				toResolve["isCover"] = prop["isCover"]
				toResolve["lastChange"] = prop["lastChange"]
				resolve(toResolve)
			})
		}).catch((err) => { console.error("Fetch error moving:", err.message); });

	  });
  }
}

function getWeatherJson(){
return new Promise(async (resolve, reject) => {
    WoTHelpers.fetch("coap://"+servientIP+":5683/General_Weather_misuration_from_weather_properties_with_general_scheme").then(async (td) => {
				try {
				  var thing = await WoT.consume(td);
				  var weatherVect = {},windowsJson = {};
				  for ( let property in thing.properties ) {
					if (thing.properties.hasOwnProperty(property)) {
						if(property.includes("end")){
							await thing.readProperty(property).then(async (end) => {
								var split = property.split("endpoint_");
								let name = split[1]
								let json = await ontology.getFilteredData(2,end,"ontology/weather/weather",name)
								let wJson = await ontology.getFilteredData(2,end,"ontology/weather/wind",name)
								weatherVect[name] = await divideWeather(json,name)
								windowsJson[name] = await divideWind(wJson,name);
							});
						}
					}
				  }
				  //check for the max of weather in vect
				  let meteoType = checkMode(weatherVect);
				  let windSpeed = checkWind(windowsJson);
				  let toResolve = {}
				  toResolve["weather"] = meteoType
				  toResolve["wind"] = windSpeed
				  resolve(toResolve)
				}
				catch(e){
					console.log("ERROR FROM FETCH MOVING")
					console.log(e)
					reject(e)

				}
			}).catch((err) => { console.error("Fetch error moving:", err.message); });
	})
}

function checkMode(weatherVect){
	var maxJson = {};
	for(var api in weatherVect){
		maxJson[api] = {}
		for(var type in weatherVect[api]){
			let temp = Object.keys(weatherVect[api][type]).length
			if(temp != 0){
				maxJson[api] = type
				break;
			}
		}
	}
	var max = 0,typeWeather = "";
	for(var type in weatherJson){
		let count = 0;
		for(var x in maxJson){
			if (maxJson[x] == type){
				count++;
			}
		}
		if(max < count){
			typeWeather = type
			max = count
		}
	}
	return typeWeather
}

function checkWind(windJ){
	//check wind avg in windJ with getFilteredWindSpd
	var tempSpd = 0,count = 0
	for(var api in windJ){
		for(var key in windJ[api]){
			tempSpd = tempSpd + windJ[api][key]
		}
		count = count + 1;
	}
	if(count > 0)	return tempSpd/count
}

async function divideWeather(json,name){
	return new Promise(async (resolve, reject) => {
		var filteredJson = {}
		for(var type in weatherJson){
			ontology.resetjsonToResolveSub(name,type)
			filteredJson[type] = await ontology.getFilteredWeather(json,"ontology/typeWeather/"+type,name)
		}
		resolve(filteredJson)
	});
}

async function divideWind(json,name){
	return new Promise(async (resolve, reject) => {
		var filteredJson = {}
		ontology.resetjsonToResolveSub(name,"speed")
		filteredJson = await ontology.getFilteredWindSpd(json,"ontology/traffic/speed",name)
		resolve(filteredJson)
	});
}

async function getIncidentFilteredInSquare(split,incidentJson){
	return new Promise(async (resolve, reject) => {
		var filteredJson = {},descriptionJson = {}, toResolve = {}
		for(var api in apiJson){
			if(apiJson[api][2] == "incidents"){
				for(var key in incidentJson[api]){
					let id = Object.keys(descriptionJson).length + 1

					/*if(api == "bingAPI"){
						id = incidentJson[api][key]["TRAFFIC_ITEM_ID"]
					}
					else if(api =="hereIncidentAPI"){
						id = incidentJson[api][key]["incidentId"]
					}*/
					var slat,nlat,elon,wlon,passed ={};
					slat = parseInt(split[0])-parseInt(split[2])
					nlat = parseInt(split[0])+parseInt(split[2])
					elon = parseInt(split[1])+parseInt(split[2])
					wlon = parseInt(split[1])-parseInt(split[2])
					filteredJson[id] = await actionUtils.checkSquare(slat,nlat,elon,wlon,incidentJson[api][key],passed)
					ontology.resetjsonToResolveSub(api,"description")
					if(filteredJson[id] != {} && filteredJson[id] != undefined) {
						descriptionJson[id] = await ontology.getFilteredData(5,incidentJson[api][key],"ontology/incidents/description",api)
						descriptionJson[id]["coordinate"] = filteredJson[id]
					}
				}
			}
		}
		resolve(descriptionJson)
	});
  }

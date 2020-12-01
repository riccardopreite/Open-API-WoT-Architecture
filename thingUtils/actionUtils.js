var axios = require("axios")
var path = require('path');
var __dirname = path.resolve();
const fs = require('fs');
var actualUnits = {
  openAPI:0,
  weatherAPI:0,
  bitAPI:0,
  underAPI:0,
  accuAPI:0
}
var stop = {
  openAPI:1,
  weatherAPI:1,
  bitAPI:1,
  underAPI:1,
  accuAPI:1
}
var isPaused = 0,index = 0
var rawOntology = fs.readFileSync(path.join(__dirname, '/ontology/ontology.json'));
var onto = JSON.parse(rawOntology);
const tConverter = require('@khanisak/temperature-converter').default;
const ontology = require(path.join(__dirname, '/ontology/ontology.js'))
const arduino = require(path.join(__dirname, '/microcontroller/arduino.js'))
const crawler = require(path.join(__dirname, '/crawler/crawler.js'))
const prop = require(path.join(__dirname, '/thingUtils/propertiesUtils.js'))
var pusherServer = require(path.join(__dirname, '/server/pusher/pusherServer.js'));

module.exports = {
  createRefreshAction:  function createRefreshAction(thing,apiJson,name) {
    thing.setActionHandler("refresh", async (params, options) => {
      return new Promise(async (resolve, reject) => {
        var url = apiJson[4]
        var headers = apiJson[3]
        try{
          var splittedProperty = []
          var splitted = []
          if(apiJson[5].length > 0) {
            splittedProperty = params.split("!!")
            splitted = splittedProperty[1].split("@@")
          }
          else splittedProperty[0] = params
          var replace  = apiJson[5]
          var i = 0
          for(var togo in replace){
            try{
              url = url.replace(String(replace[togo]),String(splitted[i]))
              i++
            }
            catch(e){
              console.log("errore ee " + e);
              reject("input must be of the form of: " + apiJson[6])
            }
          }
        }
        catch(e){
          url = url.replace("replace",params)
          reject("input must be of the form of: " + apiJson[6])
        }
        try{
          var mode
          switch (apiJson[2]) {
            case "weather":
              mode = 0
            break;
            case "soil":
              mode = 1
            break;
            case "pollen":
              mode = 2
            break;
            case "water_wapor":
              mode = 3
            break;
            case "traffic":
              mode = 4
            break;
            case "incidents":
              mode = 5
            break;
            case "international_space_station":
              mode = 6
            break;
            case "asteroid":
              mode = 7
            break;
            default:
              mode = 8
          }
          var result = await axios.get(url,{headers:headers})
          var vect = apiJson[1]
          var json = {}
          json = result.data
          for (var key in vect){
            json = json[vect[key]]
          }
            thing.setPropertyReadHandler(splittedProperty[0], () => {
                return new Promise(async (resolve, reject) =>  {
                  try{
                    var result = await axios.get(url,{headers:apiJson[3]})
                    var vect = apiJson[1]
                    var json = {}
                    json = result.data
                    for (var ke in vect){
                      json = json[vect[ke]]
                    }
                    if(splittedProperty[0] != "endpoint") {
                      var temp = {},resolved = {};
                      temp = await ontology.getFilteredData(mode,json,apiJson[2]+"/"+splittedProperty[0],name)
                      if(JSON.stringify(temp) !== '{}'){
                        resolved = Object.assign({}, resolved, temp);
                      }
                      temp = {}
                      json = resolved
                    }
                    resolve(json)
                  }
                  catch(e){
                    var erre = "This error occured "+ e
                    var j = {err: erre}
                    resolve(j)
                    console.log("some error read handler of actionUtils" + e.message);
                  }
                });
                ontology.createPropertiesWeather()
            });
          resolve(json)
        }
        catch(e){
          reject("input must be of the form of: " + apiJson[6])
          console.log("some errore from action utils" + e);
        }
      });
    });
  },
  createWeatherGeneralAction: function createWeatherGeneralAction(thing,apiJson){
    thing.setActionHandler("GetAvg", async (params, options) => {
      return new Promise(async (resolve, reject) => {
		var temp = await this.getAvg(thing,apiJson)
        resolve(temp)
      });
    });
  },
  getAvg: async function getAvg(thing,apiJson){
    return new Promise(async (resolve, reject) => {
      var tempFullJson = {}
      let to = 0,modeF = 0,modeS = 0
      switch (crawler.unit) {
        case "c":
          to = 0
          break;
        case "f":
          to = 1
        case "k":
          to = 2
        default:
      }
      switch (crawler.notUnitF) {
        case "c":
          modeF = 0
          break;
        case "f":
          modeF = 1
        case "k":
          modeF = 2
        default:
      }
      switch (crawler.notUnitS) {
        case "c":
          modeS = 0
          break;
        case "f":
          modeS = 1
        case "k":
          modeS = 2
        default:
      }
      for(var api in apiJson){
        if(apiJson[api][2] == "weather"){
          await thing.readProperty("endpoint_"+api).then(async (end) => {
            for(var key in end){
              let json = await ontology.checkTempOntology(end,key,api,to,modeF,modeS)
              let temp = 0
              for(var x in json){
                temp += json[x]
              }
              if(Object.keys(json).length != 0) tempFullJson[api] = temp/Object.keys(json).length
              else tempFullJson[api] = {}
            }
          });
        }
      }
      let tempFin = 0
      for(var key in tempFullJson){
        tempFin += tempFullJson[key]
      }
      if(Object.keys(tempFullJson).length != 0) tempFin = tempFin/Object.keys(tempFullJson).length
      else tempFin = {}
      try{
        await thing.writeProperty("Temperature_Average", tempFin);
        await thing.writeProperty("lastChange", (new Date()).toISOString());
      }
      catch(e){
        console.log("ERROR FROM GET AVG ACTION UTILS");
        console.log(e);
      }
      resolve(tempFin)
    })
  },
  createWeatherGeneralTempChangeAction: function createWeatherGeneralTempChangeAction(thing,apiJson){
    thing.setActionHandler("Change_Unit", async (params, options) => {
		//CONVERT TEMP AVG TOO
      return new Promise(async (resolve, reject) => {
        var unite = "",indexOfUnit = 0
        params = params.replace("_","")
        params = params.replace("-","")
        params = params.replace(" ","")
        var splitted = params.split("||")
        var choosen = splitted[0].toLowerCase()
        if(choosen[0] == "m" || choosen[0] == "metrical"){
          unite = "metrical"
          indexOfUnit = 0
          crawler.unit = "c"
          crawler.notUnitF = "f"
          crawler.notUnitS = "k"
        }
        else if(choosen[0] == "s" || choosen[0] == "scientific"){
          unite = "scientific"
          indexOfUnit = 1
          crawler.unit = "f"
          crawler.notUnitF = "c"
          crawler.notUnitS = "k"
        }
        else if(choosen[0] == "i" || choosen[0] == "imperial"){
          unite = "imperial"
          indexOfUnit = 2
          crawler.unit = "k"
          crawler.notUnitF = "c"
          crawler.notUnitS = "f"
        }
        for(var api in apiJson){
          if(apiJson[api][2] == "weather"){
            for(var ke in apiJson[api][5]){
              if(apiJson[api][5][ke].includes("unit")){
                let key = api
                thing.setPropertyReadHandler("endpoint_"+key, () => {
                  return new Promise(async (resolve, reject) =>  {
                    var url = apiJson[key][0]
                    let temp = url.split(/(unit+\w*=\w*&*)/);
                    temp[1] = temp[1].replace(/=\w*/,"="+apiJson[key][7][indexOfUnit])
                    url = url.replace(/(unit+\w*=\w*&*)/,temp[1])
                    resolve(prop.readProp(url,apiJson[key][3],apiJson[key][1]))
                  });
                });
                break
              }
            }
          }
        }
        thing.writeProperty("lastUnit",unite)
        thing.writeProperty("lastUnitChange",(new Date()).toISOString())
        resolve("CIAO")
      });
    });
  },
  createFilterAction: function createFilterAction(thing){
    thing.setActionHandler("filter", async (params, options) => {
      return new Promise(async (resolve, reject) => {
        resolve(this.getFiltered(params.split(","),thing))
      });
    });
  },
  getFiltered: async function getFiltered(split,thing){
    return new Promise(async (resolve, reject) => {
		await thing.readProperty("coordinate").then(async (coordinateJson) => {
				var newJson = {}
				var slat,nlat,elon,wlon;
				slat = parseInt(split[0])-parseInt(split[2])
				nlat = parseInt(split[0])+parseInt(split[2])
				elon = parseInt(split[1])+parseInt(split[2])
				wlon = parseInt(split[1])-parseInt(split[2])
				console.log(split[0])
				console.log(split[1])
				console.log(split[2])
				newJson = await this.checkSquare(slat,nlat,elon,wlon,coordinateJson,newJson)
				resolve(newJson)
			});
	});
  },

  createIncidentsTimedAction: function createIncidentsTimedAction(thing,apiJson){
    thing.setActionHandler("Get_Incidents_Timed_Relevation", async (params, options) => {
      return new Promise(async (resolve, reject) => {
        var splitted = params.split("@@")
        var start = new Date(splitted[0]),end = new Date(splitted[1]);
        if(start.getTime() >= end.getTime()) {
          start = new Date(splitted[1])
          end = new Date(splitted[0])
        }
        resolve(this.getIncidents(thing,apiJson,start,end))
      });
    });
  },
  getIncidents: async function getIncidents(thing,apiJson,start,end){
    var fullJson = {}
    for(var api in apiJson){
      if(apiJson[api][2] == "incidents"){
        ontology.resetjsonIncidentToResolve(api)
        var url = apiJson[api][0],tempJson = {}
        if(end !== "" && end !== "Invalid date") url += "&startTime="+end
        //if(end !== "" && end !== "Invalid date") url += "&endTime="+end
        try{
          ontology.resetjsonIncidentToResolveSub(api,"time")
          if(!Object.keys(apiJson[api][5]).includes("start") && !Object.keys(apiJson[api][5]).includes("end")){
            tempJson = await ontology.checkIncidentJson(api,"ontology/incidents/time",start.getTime(),end.getTime())
          }
          else tempJson = await prop.readProp(url,apiJson[api][3],apiJson[api][1])
          fullJson[api] = tempJson
        }
        catch(e){
          tempJson = await ontology.checkIncidentJson(api,"ontology/incidents/time",start.getTime(),end.getTime())
          fullJson[api] = tempJson
          console.log("Got this error in getIncidents in actionUtils.js "+ e.message);
        }
      }
    }
    if(thing !== undefined && thing !== null){
		thing.writeProperty("Incidents_Timed_Relevation", fullJson);
		thing.writeProperty("lastChange", (new Date()).toISOString());
	}
    return fullJson;
  },
  createTrafficFilteredAction: async function createTrafficFilteredAction(thing,apiJson){
    thing.setActionHandler("Get_Traffic_Filtered_Relevation", async (params, options) => {
      return new Promise(async (resolve, reject) => {
        var split = params.split("@@")
        resolve(this.getTrafficFiltered(split,apiJson,thing))
      });
    });
  },
  getTrafficFiltered: async function getTrafficFiltered(split,apiJson,thing){
    var fullJson = {}
    for(var api in apiJson){
      if(apiJson[api][2] == "traffic"){
        let json = await prop.readProp(apiJson[api][0],apiJson[api][3],apiJson[api][1])
        var newJson = {}
        var slat,nlat,elon,wlon;
        slat = parseInt(split[0])-parseInt(split[2])
        nlat = parseInt(split[0])+parseInt(split[2])
        elon = parseInt(split[1])+parseInt(split[2])
        wlon = parseInt(split[1])-parseInt(split[2])
		newJson = await this.checkSquare(slat,nlat,elon,wlon,json,newJson)


        fullJson[api] = Object.assign({}, {}, newJson);
      }
    }
    if(thing !== undefined && thing !== null){
		thing.writeProperty("Traffic_Filtered_Relevation",fullJson)
		thing.writeProperty("lastChange",(new Date()).toISOString())
	}
    return fullJson;
  },
  createEnviromentDetectionAction: async function createEnviromentDetectionAction(thing,apiJson){
    thing.setActionHandler("Get_Enviroment_Detection", async (params, options) => {
      return new Promise(async (resolve, reject) => {
		  var split;
		  try{
			split = params.split("@@")
		}
		catch(e){
			split = [44,11]
		}
        resolve(await this.getEnviromentDetection(split,thing,apiJson))
      });
    });
  },
  getEnviromentDetection: async function getEnviromentDetection(split,thing,apiJson){
	return new Promise(async (resolve, reject) => {
		var endJson = {}
		var fullJson = {}
		for(var api in apiJson){
		  var i = 0
		  if(apiJson[api][2] == "soil" || apiJson[api][2] == "pollen" || apiJson[api][2] == "water_vapor"){
			var url = apiJson[api][4]
			for(var key in apiJson[api][5]){
				try{
				  url = url.replace(String(apiJson[api][5][key]),String(split[i]))
				  i++
				}
				catch(e){
				  console.log("errore ee " + e);
				  reject("input must be of the form of: " + apiJson[6])
				}
			}
			let json = await prop.readProp(url,apiJson[api][3],apiJson[api][1])
			fullJson[api] = Object.assign({}, {}, json);
		  }
		}

		endJson["data"] = {}
		for(var api in apiJson){
		  var rawdata,ontologyJson,mode,dataKey = ""
		  switch (apiJson[api][2]) {
			case "soil":
			  mode = 1
			  rawdata = fs.readFileSync(path.join(__dirname, '/ontology/'+onto[mode]+'.json'));
			  ontologyJson = JSON.parse(rawdata);
			  dataKey = "soil"

			  break;
			case "pollen":
			  mode = 2
			  rawdata = fs.readFileSync(path.join(__dirname, '/ontology/'+onto[mode]+'.json'));
			  ontologyJson = JSON.parse(rawdata);
			  dataKey = "pollen"
			  break;
			case "water_vapor":
			  mode = 3
			  rawdata = fs.readFileSync(path.join(__dirname, '/ontology/'+onto[mode]+'.json'));
			  ontologyJson = JSON.parse(rawdata);
			  dataKey = "water_vapor"
			  break;
			default:
		  }
		  if(dataKey != ""){
			endJson["data"][api] = {}
			ontology.resetjsonEnviromentToResolve(api)
			for(var key in ontologyJson){
			  ontology.resetjsonEnviromentToResolveSub(api,key)
			  let temp = await ontology.getFilteredDataEnviroment(mode,fullJson[api],"ontology/"+dataKey+"/"+key,api)
			  endJson["data"][api][dataKey] = Object.assign({}, endJson["data"][api][dataKey], temp);
			}
		  }
		}
		endJson["tempAVG"] = await getSoilTempAvg(fullJson,thing,apiJson,mode)
		endJson["pollenAVG"] = await getPollenAvg(fullJson,thing,apiJson,mode)
		if(thing !== undefined && thing !== null){
			thing.writeProperty("Enviroment_Detection",endJson)
			thing.writeProperty("lastChange",(new Date()).toISOString())
		}
		resolve(endJson)
	});
  },
  checkSquare: function checkSquare(slat,nlat,elon,wlon,json,passed){
	  return new Promise(async (resolve, reject) => {
		  for(var key in json){
			if(typeof json[key] == typeof {}) { checkSquare(slat,nlat,elon,wlon,json[key],passed)}
			else{
			  try{
				let key2 = "",key1 = ""
				switch (key) {
				  case "latitude" || "longitude":
					key1 = "latitude"
					key2 = "longitude"

				  break;
				  case "Latitude" || "Longitude":
					key = "Latitude"
					key2 = "Longitude"

				  break;
				  case "LATITUDE" || "LONGITUDE":
					key1 = "LATITUDE"
					key2 = "LONGITUDE"

				  break;
				  case "lat" || "lon":
					key1 = "lat"
					key2 = "lon"

				  break;
				  case "Lat" || "Lon":
					key1 = "Lat"
					key2 = "Lon"

				  break;
				  case "LAT" || "LON":
					key1 = "LAT"
					key2 = "LON"

				  break;
				  case "coordinates":
					key1 = 0
					key2 = 1
				  break;
				  default:
				}
				if(key2 != "") {
					var index = Object.keys(passed).length;
					passed[index] = positionCheck(slat,nlat,elon,wlon,json,key1,key2);
				}
			  }
			  catch(e){
			  }
			}
		  }
		  resolve(passed)
	  });
},
createLedOn : async function createLedOn(thing){
	thing.setActionHandler("turnOn", async (params, options) => {
      return new Promise(async (resolve, reject) => {
		thing.readProperty("pin").then(async (pin) => {
			let  on = arduino.turnOnLed(pin)
			if(on) thing.emitEvent("turnedOn", on);
			resolve(on)
		});
      });
    });
},
createLedOff : async function createLedOff(thing){
	thing.setActionHandler("turnOff", async (params, options) => {
      return new Promise(async (resolve, reject) => {
		  thing.readProperty("pin").then(async (pin) => {
			let  off = arduino.turnOffLed(pin)
			if(off) thing.emitEvent("turnedOff", off);
			resolve(off)
		  });
		});
	});
},
createLedBlink : async function createLedBlink(thing){
	thing.setActionHandler("blink", async (params, options) => {
	  thing.readProperty("pin").then(async (pin) => {
		return new Promise(async (resolve, reject) => {
			let  blink = arduino.blinkLed(pin,params)
			if(blink) thing.emitEvent("turnedOn", blink);
			resolve(blink)
		});
	  });
    });
},
openPlant: function openPlant(thing){
	thing.setActionHandler("openPlant", async (params, options) => {
      return new Promise(async (resolve, reject) => {
		 let open = await thing.readProperty("isCover").then(async (isCover) => {
				return new Promise(async (resolve, reject) => {
					if(isCover) resolve(await arduino.openPlant(thing))
					else resolve(0)
				})
			})
			if(open == 1){
				thing.emitEvent("opened", (new Date()).toISOString());
				thing.writeProperty("lastChange", (new Date()).toISOString());
				thing.writeProperty("isCover", false);
			}
			resolve(open)
      });
    });
},
closePlant: function closePlant(thing){
	thing.setActionHandler("coverPlant", async (params, options) => {
      return new Promise(async (resolve, reject) => {
		let close = await thing.readProperty("isCover").then(async (isCover) => {
				return new Promise(async (resolve, reject) => {
					if(!isCover) resolve(await arduino.coverPlant(thing))
					else resolve(0)
				})
			})
			if(close == 1){
				thing.emitEvent("covered", (new Date()).toISOString());
				thing.writeProperty("lastChange", (new Date()).toISOString());
				thing.writeProperty("isCover", true);
			}
			resolve(close)
      });
    });
},
runMotor: function runMotor(thing){
	thing.setActionHandler("run", async (params, options) => {
      return new Promise(async (resolve, reject) => {
        resolve(await arduino.runMotor(thing))
			// if(close == 1){
			// 	thing.emitEvent("covered", (new Date()).toISOString());
			// 	thing.writeProperty("lastChange", (new Date()).toISOString());
			// }
			// resolve(close)
      });
    });
},
print: function print(thing){
	thing.setActionHandler("print", async (params, options) => {
      return new Promise(async (resolve, reject) => {
        resolve(await arduino.print(params,thing))
			// if(close == 1){
			// 	thing.emitEvent("covered", (new Date()).toISOString());
			// 	thing.writeProperty("lastChange", (new Date()).toISOString());
			// }
			// resolve(close)
      });
    });
}

  //,
  //
  // createUnitConversionWeatherAction:  function createUnitConversionWeatherAction(thing,apiJson,json,name) {
  //   thing.setActionHandler("toCelsius", async (params, options) => {
  //       for(var prop in json){
  //         isPaused = await (json,prop,thing, actualUnits[name], 0,name)
  //       }
  //     updateThing(json,thing,name,0)
  //   })
  //   thing.setActionHandler("toFahrenheit", async (params, options) => {
  //       for(var prop in json){
  //         isPaused = await checkOntology(json,prop,thing, actualUnits[name], 1,name)
  //       }
  //     updateThing(json,thing,name,1)
  //   })
  //   thing.setActionHandler("toKelvin", async (params, options) => {
  //     //OLD
  //     if(actualUnits[name] == 1) {
  //       for(var prop in json){
  //         isPaused = await checkOntology(json,prop,thing,1, 2,name)
  //       }
  //     }
  //     else if(actualUnits[name] == 0) {
  //       for(var prop in json){
  //         isPaused = await checkOntology(json,prop,thing, 0, 2,name)
  //       }
  //     }
  //     updateThing(json,thing,name,2)
  //   })
  // },
  // createIncidentsAction:  function createIncidentsAction(thing,apiJson,json,name) {
  //   thing.setActionHandler("filter", async (params, options) => {
  //     var newJson = {}
  //     newJson = checkFilter(json,params.toLowerCase(),newJson)
  //     index = 0
  //     return newJson
  //   })
  // },
  // createTrafficAction: function createTrafficAction(thing,apiJson,json,name) {
  //   thing.setActionHandler("filter", async (params, options) => {
  //     var newJson = {}
  //     var split = params.split(",")
  //     var slat,nlat,elon,wlon;
  //     slat = parseInt(split[0])-split[2]
  //     nlat = parseInt(split[0])+split[2]
  //     elon = parseInt(split[1])+split[2]
  //     wlon = parseInt(split[1])-split[2]
  //     newJson = checkSquare(slat,nlat,elon,wlon,json,newJson)
  //     console.log(newJson);
  //     return newJson
  //   })
  // }
}

/* Traffic Utils Function*/

function positionCheck(slat,nlat,elon,wlon,json,lat,lon){
  pusherServer = require(path.join(__dirname, '/server/pusher/pusherServer.js'));
	let temp = {}
  if(slat <= json[lat] && json[lat] <= nlat && wlon <= json[lon] && json[lon] <= elon){
    console.log("checking lat: " + json[lat] + "lon: " + json[lon]);
    pusherServer.filterCheckingLatLon(json[lat],json[lon])
	  temp[lat] = json[lat]
	  temp[lon] = json[lon]
  }
  return temp
}


/*End Traffic Utils Function*/


/*Enviroment Utils Function*/


async function getSoilTempAvg(fullJson,thing,apiJson,mode){
  var resolved = {}
  var tot = 0
  var temp = 0
  for(var api in fullJson){
    var tempJson = {}
    if(apiJson[api][2] == "soil"){
      tempJson[api] = await ontology.getFilteredDataEnviromentInt(mode,fullJson[api],"ontology/soil/soil_temperature",api)
      let prova = await calculateAVG(tempJson,resolved)
      for(var ke in prova){

        try{
          let k = parseInt(prova[ke])
          temp = temp + k
          tot = tot + 1
        }
        catch(e){
          console.log("NaN");
          console.log(k);
        }
      }
    }
  }
  if(tot != 0) return temp/tot
  else return {}


}

async function calculateAVG(temp,resolved){
  for(var ke in temp){
    if(typeof temp[ke] == typeof {}) resolved = await calculateAVG(temp[ke],resolved)
    else{
      if(isNumber(temp[ke])){
        var index = Object.keys(resolved).length
        let c = parseInt(temp[ke])
        resolved[index] = c
      }
    }
  }
  return resolved
}

async function getPollenAvg(fullJson,thing,apiJson,mode){
  rawdata = fs.readFileSync(path.join(__dirname, '/ontology/ontologyPollenJson.json'));
  ontologyJson = JSON.parse(rawdata);
  var resolved = {}
  var tot = 0
  var temp = 0
  var tempJson = {}
  for(var api in fullJson){
    tempJson[api] = {}
    if(apiJson[api][2] == "pollen"){
      for (var key in ontologyJson){
        tempJson[api][key] = await ontology.getFilteredDataEnviromentInt(mode,fullJson[api],"ontology/pollen/"+key,api)
      }
    }
  }
  let prova = await calculateAVG(tempJson,resolved)
  for(var ke in prova){

    try{
      let k = parseInt(prova[ke])
      temp = temp + k
      tot = tot + 1
    }
    catch(e){
      console.log("NaN");
      console.log(k);
    }
  }
  if(tot != 0) return temp/tot
  else return {}
}


/*End Enviroment Utils Function*/




function updateThing(json,thing,name,type){
  if (!isPaused) {
    setTimeout(function(){updateThing(json,thing)},1000);
  }
  else {
    for (var key in json){
      thing.writeProperty(key,json[key])
    }
    var unit = ""
    switch(type){
      case 0:
      unit = "celsius"
      break;
      case 1:
      unit = "fahrenheit"
      break;
      case 2:
      unit = "kelvin"
      break;
      default:
      unit = ""
    }
    var text = "refreshed data at " + (new Date()).toISOString() + ". Actual Unit: " + unit
    thing.writeProperty("lastChangeUnit", text);
    thing.emitEvent("changedUnit", text);
    isPaused = 0
    stop[name] = 1
    actualUnits[name] = type
  }
}

function checkFilter(json,params,filtered){
  for(var key in json){
    if(typeof json[key] == typeof {}) filtered = checkFilter(json[key],params,filtered)
    else{
      try{
        var value = json[key]
        value = value.toLowerCase()
        if(value === params){
          filtered[index] = json
          index++
        }
      }
      catch(e){
      }
    }
  }
  return filtered
}

function isNumber(value) {
  return !isNaN(value)
}

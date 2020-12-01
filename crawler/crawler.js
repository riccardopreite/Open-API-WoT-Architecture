/********************
  Form of dictionary:
  name: link API,key to access data, type of api, header request, new uri to refresh data, vect with the key to be replaced, input type, unit misuration vector for api
********************/
/*
"0"-> "ontologyWeatherJson",
"1"-> "ontologySoilJson",
"2"-> "ontologyPollenJson",
"3"-> "ontologyWaterJson",
"4"-> "ontologyTrafficJson",
"5"-> "ontologyIncidentJson",
"6"-> "ontologySpaceJson",
"7"-> "ontologyAsteroidJson"
*/

//split on ? to find endpoint
var path = require('path');
var __dirname = path.resolve();
var axios = require("axios")
const fs = require('fs');
var jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/apiDict.json'));
var apiJson = JSON.parse(jsonFile);
var endPointJson = {}
var WoT;

const properties = require(path.join(__dirname, '/thingUtils/propertiesUtils.js'))
const ontology = require(path.join(__dirname, '/ontology/ontology.js'))
const actionUtils = require(path.join(__dirname, '/thingUtils/actionUtils.js'))
const exposer = require(path.join(__dirname, '/crawler/exposer.js'))
const ddnsName = "://YourDdns:"
const servientIp = "YourLocalIp"
const serverIp = "YourServerIp"
module.exports.unit = "c"; //metrical 0
module.exports.notUnitF = "f"; //scientific 1
module.exports.notUnitS = "k"; //imperial 2

module.exports = {
  getDdns: function getDdns(){
    return ddnsName;
  },
  getServientIp: function getServientIp(){
    return servientIp;
  },
  getserverIp: function getserverIp(){
    return serverIp;
  },
  BootCrawler: async function BootCrawler(wot){
    WoT = wot
    exposer.setVariable(WoT,apiJson)
    await exposer.createWeatherGeneral()
    await exposer.createIncidentsGeneral()
    await exposer.createTrafficGeneral()
    await exposer.createEnviromentGeneral()
    for(var api in apiJson){
	  initJsonAction(api)
      createJson(api,apiJson[api][2])
    }
  }
}
async function createJson(name,type){
  //check for a tool to translate instantly
  var produce = {
    title: type+"_misuration_from_"+name+"_with_general_scheme",
    titles: {
      "en": type+" misuration from "+name,
      "de": type+" misuration",
      "it": "misurazioni "+type+" da "+name
    },
    description: " misuration from an API web used to create thing description",
    descriptions: {
      "en": type + " misuration from an API web used to create thing description",
      "de": type + " misuration",
      "it": "misurazioni "+type+" da una web API usata per create thing description"
    },
    support: "git://github.com/eclipse/thingweb.node-wot.git",
    "@context": ["https://www.w3.org/2019/wot/td/v1", { "iot": "http://example.org/iot" }],
    properties:{},
    actions: {},
    events: {}
  }
  if(apiJson[name][2] == "weather"){
    produce["properties"] = await properties.createProperties(name,0)
  }
  else if(apiJson[name][2] == "soil"){
    produce["properties"] = await properties.createProperties(name,1)
  }
  else if(apiJson[name][2] == "pollen"){
    produce["properties"] = await properties.createProperties(name,2)
  }
  else if(apiJson[name][2] == "water_vapor"){
    produce["properties"] = await properties.createProperties(name,3)
  }
  else if(apiJson[name][2] == "traffic"){
    produce["properties"] = await properties.createProperties(name,4)
  }
  else if(apiJson[name][2] == "incidents"){
    produce["properties"] = await properties.createProperties(name,5)
  }
  else if(apiJson[name][2] == "international_space_station"){
    produce["properties"] = await properties.createProperties(name,6)
  }
  else if(apiJson[name][2] == "asteroid"){
    produce["properties"] = await properties.createProperties(name,7)

  }
  produce["properties"]["endpoint"] = {
    type: "Uri string",
    description: "endpoint api",
    descriptions: {
      "en": "endpoint api",
      "de": "endpoint api",
      "it": "endpoint api"
    },
    observable: true,
    readOnly: true
  }

  if(apiJson[name][4] != ""){
    produce["actions"]["refresh"] = {
      description: "Refresh data",
      descriptions: {
        "en": "Refresh data",
        "de": "Refresh data",
        "it": "Aggiorna dati"
      },
      input: {
        type: "string"
      },
      form:{
        type: apiJson[name][6]
      }
    }
  }
  if(apiJson[name][2] == "traffic" || apiJson[name][2] == "incidents"){
    produce["actions"]["filter"] = {
      description: "filter coordinate",
      descriptions: {
        "en": "filter coordinate",
        "de": "filter coordinate",
        "it": "filter coordinate"
      },
      input: {
        type: "object"
      },
      form:{
        type: "lat,lon,radius"
      }
    }
  }
  WoT.produce(produce).then(async (thing) => {
    thing.writeProperty("endpoint", endPointJson[name]);
    if(name !== "asteroidNearImpactTodayAPI"){
       thing.setPropertyReadHandler("endpoint", () => {
         return new Promise(async (resolve, reject) =>  {
           try{
             var result = await axios.get(apiJson[name][0],{headers:apiJson[name][3]})
             var vect = apiJson[name][1]
             var json = {}
             json = result.data
             for (var key in vect){
               json = json[vect[key]]
             }
             resolve(json)
           }
           catch(e){
             var erre = "This error occured "+ e.message
             var j = {err: erre}
             resolve(j)
             console.log("some error from crawler " + e);
           }
         });
       });
    }
    switch(apiJson[name][2]){
		case "weather":
			properties.setPropertyReader(name,thing,0,"weather")
			break;
		case "soil":
			properties.setPropertyReader(name,thing,1,"soil")
			break;
		case "pollen":
			properties.setPropertyReader(name,thing,2,"pollen")
			break;
		case "water_vapor":
			properties.setPropertyReader(name,thing,3,"water_vapor")
			break;
		case "traffic":
			properties.setPropertyReader(name,thing,4,"traffic")
			break;
		case "incidents":
			properties.setPropertyReader(name,thing,5,"incidents")
			break;
		case "international_space_station":
			properties.setPropertyReader(name,thing,6,"international_space_station")
			break;
		case "asteroid":
			properties.setPropertyReader(name,thing,7,"asteroid")
			break;
		default:

	}

	if(apiJson[name][2] == "traffic" || apiJson[name][2] == "incidents"){
		actionUtils.createFilterAction(thing)
	  }
    // if(apiJson[name][4] != ""){
      actionUtils.createRefreshAction(thing,apiJson[name],name)
    // }

    thing.expose().then(() => {
      // console.info(thing.getThingDescription().title + " ready")
    });
  })
  .catch((e) => {
    console.log(e);
  });
}
function initJsonAction(api){
	//make modular for all types
	var rawdata,jsondata,jsonWeather;
	switch(apiJson[api][2]){
		case "weather":
		  ontology.resetjsonToResolve(api)
		  rawdata = fs.readFileSync(path.join(__dirname, '/ontology/ontology.json'));
		  ontologyJson = JSON.parse(rawdata);
		  for(var key in ontologyJson){
			rawdata = fs.readFileSync(path.join(__dirname, '/ontology/'+ontologyJson[key]+'.json'));
			jsondata = JSON.parse(rawdata);
			for(var ke in jsondata){
			  ontology.resetjsonToResolveSub(api,ke)
			  var temp = ontology.getjsonToResolve()
			}
		  }
		  jsonWeather = fs.readFileSync(path.join(__dirname, '/ontology/ontologyWeatherType.json'));
		  ontologyJson = JSON.parse(jsonWeather);
		  for(var key in ontologyJson){
			rawdata = fs.readFileSync(path.join(__dirname, '/ontology/typeWeather'+ontologyJson[key]+'.json'));
			jsondata = JSON.parse(rawdata);
			for(var ke in jsondata){
			  ontology.resetjsonToResolveSub(api,ke)
			  var temp = ontology.getjsonToResolve()
			}
		  }
          break;
        case "soil":
          ontology.resetjsonEnviromentToResolve(api)
		  rawdata = fs.readFileSync(path.join(__dirname, '/ontology/ontology.json'));
		  ontologyJson = JSON.parse(rawdata);
		  for(var key in ontologyJson){
			rawdata = fs.readFileSync(path.join(__dirname, '/ontology/'+ontologyJson[key]+'.json'));
			jsondata = JSON.parse(rawdata);
			for(var ke in jsondata){
			  ontology.resetjsonEnviromentToResolveSub(api,ke)
			  var temp = ontology.getjsonToResolve()
			}
		  }
       //   mode = "soil"
          break;
        case "pollen":
         // mode = "pollen"
          break;
        case "water_wapor":
      //    mode = "water_wapor"
          break;
        case "traffic":
      //    mode = "traffic"
          break;
        case "incidents":
          ontology.resetjsonIncidentToResolve(api)
          rawdata = fs.readFileSync(path.join(__dirname, '/ontology/ontology.json'));
		  ontologyJson = JSON.parse(rawdata);
		  for(var key in ontologyJson){
			rawdata = fs.readFileSync(path.join(__dirname, '/ontology/'+ontologyJson[key]+'.json'));
			jsondata = JSON.parse(rawdata);
			for(var ke in jsondata){
			  ontology.resetjsonIncidentToResolveSub(api,ke)
			}
		  }
      //    mode = "incidents"
          break;
        case "international_space_station":
      //    mode = "international_space_station"
          break;
        case "asteroid":
      //    mode = "asteroid"
          break;
        default:
      //    mode = 8
	}
}

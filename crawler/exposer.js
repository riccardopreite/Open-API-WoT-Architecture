var path = require('path');
var axios = require('axios');
var fs = require('fs');
var __dirname = path.resolve();
var jsonFile, exposerJson
var action = require(path.join(__dirname, '/thingUtils/actionUtils.js'))
var prop = require(path.join(__dirname, '/thingUtils/propertiesUtils.js'))
var crawler = require(path.join(__dirname, '/crawler/crawler.js'))
var arduino = require(path.join(__dirname, '/microcontroller/arduino.js'))
var moving = require(path.join(__dirname, '/microcontroller/clientMoving.js'))
var createService = require(path.join(__dirname, '/createService/createServiceServer.js'));

var WoT,apiJson;
module.exports = {
  setVariable: function setVariable(wot,json){
    WoT = wot;
    apiJson = json
    action = require(path.join(__dirname, '/thingUtils/actionUtils.js'))
    prop = require(path.join(__dirname, '/thingUtils/propertiesUtils.js'))
    crawler = require(path.join(__dirname, '/crawler/crawler.js'))
    arduino = require(path.join(__dirname, '/microcontroller/arduino.js'))
    moving = require(path.join(__dirname, '/microcontroller/clientMoving.js'))
  },
  createWeatherGeneral: function createWeatherGeneral(){
    jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/generalThing/generalWeather.json'));
    exposerJson = JSON.parse(jsonFile);
    createProperties("weather")
    WoT.produce(exposerJson).then(async (thing) => {
      thing.writeProperty("lastUnit",crawler.unit)
      thing.writeProperty("lastUnitChange",(new Date()).toISOString())
      produceWeather(thing)
    })
    .catch((e) => {
      console.log(e);
    });
  },
  createIncidentsGeneral: function createIncidentsGeneral(){
    jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/generalThing/generalIncidents.json'));
    exposerJson = JSON.parse(jsonFile);
    createProperties("incidents")
    WoT.produce(exposerJson).then(async (thing) => {
      produceIncidents(thing)
    })
    .catch((e) => {
      console.log(e);
    });
  },
  createTrafficGeneral: function createTrafficGeneral(){
    jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/generalThing/generalTraffic.json'));
    exposerJson = JSON.parse(jsonFile);
    createProperties("traffic")
    WoT.produce(exposerJson).then(async (thing) => {
      produceTraffic(thing)
    })
    .catch((e) => {
      console.log(e);
    });
  },
  createEnviromentGeneral: function createEnviromentGeneral(){
    jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/generalThing/generalEnviroment.json'));
    exposerJson = JSON.parse(jsonFile);
    createProperties("soil")
    createProperties("pollen")
    createProperties("water_vapor")
    WoT.produce(exposerJson).then(async (thing) => {
      produceEnviroment(thing)
    })
    .catch((e) => {
      console.log(e);
    });
  },
  createComponentThing: async function createComponentThing(pin,jsonToOpen,colour = null){
    var componentJsonFile, componentJson;
    jsonComponentFile = fs.readFileSync(path.join(__dirname, '/thingUtils/microControllerThing/'+jsonToOpen+'.json'));
    componentJson = JSON.parse(jsonComponentFile);
    if(jsonToOpen == "led"){
      componentJson["title"] = componentJson["title"]+"_Pin_"+pin
    }
    WoT.produce(componentJson).then(async (thing) => {
      thing.writeProperty("pin",pin)

      switch(jsonToOpen){
        case "led":
        produceLed(thing,colour)
        break;
        case "motorPlant":
        produceMotorPlant(thing)
        break;
        case "lcd":
        produceLcd(thing)
        break;
        case "humanBodySensor":
        produceHuman(thing,pin)
        break;
        default:

      }
    })
    .catch((e) => {
      console.log(e);
    });
  }

}

async function createProperties(type){
  for(var api in apiJson){
    if(apiJson[api][2] == type){
      exposerJson["properties"]["endpoint_"+api] = {
        "type": "Uri string",
        "description": "endpoint api_"+api,
        "descriptions": {
          "en": "endpoint api_"+api,
          "de": "endpoint api_"+api,
          "it": "endpoint api_"+api
        },
        "observable": true,
        "readOnly": true
      }
    }
  }
}


/*PRODUCING THE EXPOSERS*/


//Weather exposer
async function produceWeather(thing){
  await action.createWeatherGeneralAction(thing,apiJson)
  await action.createWeatherGeneralTempChangeAction(thing,apiJson)
  for(var api in apiJson){
    if(apiJson[api][2] == "weather"){
      let url = apiJson[api][0]
      let headers = apiJson[api][3]
      let vect = apiJson[api][1]
      let ke = api
      var endpoint = apiJson[api][0].split("?")
      thing.writeProperty("endpoint_"+api, endpoint[0]);
      thing.setPropertyReadHandler("endpoint_"+api, () => {
        return new Promise(async (resolve, reject) =>  {
          resolve(prop.readProp(url,headers,vect))
        });
      });
    }
  }
  // var exposed = await action.getAvg(thing,apiJson)
  // console.log("RESOLVED TEMP AVG");
  // console.log(exposed);
  thing.expose().then(async () => {

    // console.info(thing.getThingDescription().title + " ready")
  });
}


//Incidents exposer
async function produceIncidents(thing){
  await action.createIncidentsTimedAction(thing,apiJson)
  for(var api in apiJson){
    if(apiJson[api][2] == "incidents"){
      let url = apiJson[api][0]
      let headers = apiJson[api][3]
      let vect = apiJson[api][1]
      let ke = api
      var endpoint = apiJson[api][0].split("?")
      thing.writeProperty("endpoint_"+api, endpoint[0]);
      thing.setPropertyReadHandler("endpoint_"+api, () => {
        return new Promise(async (resolve, reject) =>  {
          resolve(prop.readProp(url,headers,vect))
        });
      });
    }
  }
  var start = new Date();
  var end = new Date();
  start.setDate(start.getDate() - 2);
  // var exposed = await action.getIncidents(thing,apiJson,start,end)
  // console.log("RESOLVED INCIDENTS");
  // console.log(exposed);
  thing.expose().then(() => {
    // console.info(thing.getThingDescription().title + " ready")
  });
}


//Traffic exposer
async function produceTraffic(thing){
  await action.createTrafficFilteredAction(thing,apiJson)
  for(var api in apiJson){
    if(apiJson[api][2] == "traffic"){
      let url = apiJson[api][0]
      let headers = apiJson[api][3]
      let vect = apiJson[api][1]
      let ke = api
      var endpoint = apiJson[api][0].split("?")
      thing.writeProperty("endpoint_"+api, endpoint[0]);
      thing.setPropertyReadHandler("endpoint_"+api, () => {
        return new Promise(async (resolve, reject) =>  {
          resolve(prop.readProp(url,headers,vect))
        });
      });
    }
  }
  var split = [44,11,1]
  // var exposed = await action.getTrafficFiltered(split,apiJson,thing)
  // console.log("RESOLVED TRAFFIC");
  // console.log(exposed);
  thing.expose().then(() => {
    // console.info(thing.getThingDescription().title + " ready")
  });
}


//Enviroment exposer
async function produceEnviroment(thing){
  await action.createEnviromentDetectionAction(thing,apiJson)
  for(var api in apiJson){
    if(apiJson[api][2] == "soil" || apiJson[api][2] == "pollen" || apiJson[api][2] == "water_vapor"){
      let url = apiJson[api][0]
      let headers = apiJson[api][3]
      let vect = apiJson[api][1]
      let ke = api
      var endpoint = apiJson[api][0].split("?")
      thing.writeProperty("endpoint_"+api, endpoint[0]);
      thing.setPropertyReadHandler("endpoint_"+api, () => {
        return new Promise(async (resolve, reject) =>  {
          resolve(prop.readProp(url,headers,vect))
        });
      });
    }
  }
  var split = ["44.2938","11.2034"]
  var exposed = await action.getEnviromentDetection(split,thing,apiJson)
  thing.expose().then(() => {
    // console.info(thing.getThingDescription().title + " ready")
  });
}

//LED exposer
async function produceLed(thing,colour){
  thing.writeProperty("isOn",false)
  thing.writeProperty("colour",colour)
  await action.createLedOn(thing)
  await action.createLedOff(thing)
  await action.createLedBlink(thing)
  thing.expose().then(async () => {
    console.info(thing.getThingDescription().title + " LED")
  });
}

//Motor exposer\
async function produceMotorPlant(thing){
  thing.writeProperty("voltage",5)
  thing.writeProperty("isCover",false)
  thing.writeProperty("lastChange",(new Date()).toISOString())
  await action.openPlant(thing)
  await action.closePlant(thing)
  await action.runMotor(thing)
  thing.expose().then(async () => {
    createService = require(path.join(__dirname, '/createService/createServiceServer.js'));
    createService.setMotor(WoT)
    console.info(thing.getThingDescription().title + " MOTOR")
  });
}

//LCD exposer
async function produceLcd(thing){
  await action.print(thing)

  thing.writeProperty("lastChange",(new Date()).toISOString())
  thing.writeProperty("text","Hello")
  thing.expose().then(async () => {
    createService = require(path.join(__dirname, '/createService/createServiceServer.js'));
    createService.setLcd(WoT)
    console.info(thing.getThingDescription().title + " LCD")
  });
}
//MOTION SENSOR exposer
async function produceHuman(thing,pin){
  //let calibrated = await arduino.calibrateSensor(thing)
  //thing.writeProperty("calibrated",calibrated)
  thing.writeProperty("lastDetection",null)
  thing.expose().then(async () => {
    console.info(thing.getThingDescription().title + " HUMANSENSOR")
  });
}

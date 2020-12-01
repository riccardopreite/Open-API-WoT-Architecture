var serviceTD = {}, serviceProp = {}, serviceCondition = {},WoT;
const path = require("path");
var lcd, motor;
var Servient = require("@node-wot/core").Servient
var Helpers = require("@node-wot/core").Helpers
var crawler,servientIP,pusherServer;
var WoT,WoTHelpers;

var CoapClientFactory = require("@node-wot/binding-coap").CoapClientFactory
let servient = new Servient();
servient.addClientFactory(new CoapClientFactory(null));
WoTHelpers = new Helpers(servient);
module.exports = {
  setWOT : async function setWOT(wot){
    WoT = wot;
    crawler = require(path.join(__dirname, '../crawler/crawler.js'));
    servientIP = crawler.getServientIp()
    console.log("IP");
    console.log(servientIP);
    await WoTHelpers.fetch("coap://"+servientIP+":5683/DC_Motor_For_Plant_Cover").then(async (td) => {
		  console.log("CONSUMATO motor")
          let thing = await WoT.consume(td);
          motor = thing
        }).catch((err) => { console.error("Fetch error motor create service:", err.message); });
    await WoTHelpers.fetch("coap://"+servientIP+":5683/LCD_For_Arduino").then(async (td) => {
		  console.log("CONSUMATO lcd")
          let thing = await WoT.consume(td);
          lcd = thing
        }).catch((err) => { console.error("Fetch error lcd create service:", err.message); });
  },
  setLcd : async function setLcd(wot){
    WoT = wot;
    crawler = require(path.join(__dirname, '../crawler/crawler.js'));
    pusherServer = require(path.join(__dirname, '../server/pusher/pusherServer.js'));
    pusherServer.startService()
    servientIP = crawler.getServientIp()

    console.log("IP");
    console.log(servientIP);
    await WoTHelpers.fetch("coap://"+servientIP+":5683/LCD_For_Arduino").then(async (td) => {
		  console.log("CONSUMATO lcd")
          let thing = await WoT.consume(td);
          lcd = thing
        }).catch((err) => { console.error("Fetch error lcd create service:", err.message); });
  },
  setMotor : async function setMotor(wot){
    WoT = wot;
    crawler = require(path.join(__dirname, '../crawler/crawler.js'));
    pusherServer = require(path.join(__dirname, '../server/pusher/pusherServer.js'));
    pusherServer.startService()
    servientIP = crawler.getServientIp()
    console.log("IP");
    console.log(servientIP);
    await WoTHelpers.fetch("coap://"+servientIP+":5683/DC_Motor_For_Plant_Cover").then(async (td) => {
		  console.log("CONSUMATO motor")
          let thing = await WoT.consume(td);
          motor = thing
        }).catch((err) => { console.error("Fetch error motor create service:", err.message); });
  },
  getLcd : function getLcd(){
	  return lcd;
  },
  getMotor : function getMotor(){
	  return motor;
  },
  getServiceTD : function getServiceTD(){
    return serviceTD;
  },
  updateTDsub : async function updateTDsub(serviceName,urlThingJson){
    return new Promise(async (resolve, reject) => {
      serviceTD[serviceName] = {}
      for(var apiKey in urlThingJson){
        await WoTHelpers.fetch(urlThingJson[apiKey]).then(async (td) => {
		  //console.log("CONSUMATO")
          let thing = await WoT.consume(td);
          serviceTD[serviceName][apiKey] = thing
        }).catch((err) => { console.error("Fetch error update TD:", err.message); });
      }
      resolve("finished updating TD for " + serviceName);
    //
    });
  },
  getServiceProp : function getServiceProp(){
    return serviceProp;
  },
  setServicePropsub : function setServicePropsub(serviceName,apiProp){
    serviceProp[serviceName] = apiProp;
  },
  printLcd : async function printLcd(toPrint){
	  return new Promise(async (resolve, reject) => {
		  console.log("ENTRATO IN PRINT")
      pusherServer.executingService("Lcd")
		  let printed = await lcd.invokeAction("print",toPrint)
      pusherServer.executedService("Lcd")
      if(printed) resolve("Printed " + toPrint)
      else resolve("Not printed")
	  });
  },
  startMotor : async function startMotor(){
	  return new Promise(async (resolve, reject) => {
		  console.log("ENTRATO IN MOTOR")
      pusherServer.executingService("Motor")
  		let runned = await motor.invokeAction("run")
      pusherServer.executedService("Motor")
      if(runned) resolve("Motor runned")
      else resolve("Motor not runned")
	  });
  },
  filterPosition : async function filterPosition(userLat,userLon,userRadius,serviceName,apiKey){
	  return new Promise(async (resolve, reject) => {
      pusherServer.executingService("Filter")
		  let param = {}
		  param = userLat + "," + userLon + "," + userRadius
		  console.log("ENTRATO IN FILTER")
		  console.log(param)
		  console.log(serviceName)
		  console.log(apiKey)
		  let filtered = await serviceTD[serviceName][apiKey].invokeAction("filter",param)
      pusherServer.executedService("Filter")
		  console.log("RESOLVING FILTER")
		  console.log(filtered)
		  resolve(filtered)
	  });
  },
  createVariableForService: async function createVariableForService(serviceName){
	  return new Promise(async (resolve, reject) => {

		  for(var apiKey in serviceTD[serviceName]){
			  for(var index in serviceProp[serviceName][apiKey]){
				let toSplit = serviceProp[serviceName][apiKey][index].split("API")
				let prop = toSplit[1]
				let properties = await serviceTD[serviceName][apiKey].readProperty(prop).then(async (properties) => {
					return new Promise(async (resolveProp, reject) => {
						resolveProp(properties)
					})
				});
				let name = String(serviceProp[serviceName][apiKey][index])
				let value = ""
				if(typeof properties === "object"){
					for(var key in properties){
						value = properties[key]
						break;
					}
				}
				else value = properties
				try{
					eval(""+name+"=''")
					name = value
				}
				catch(e){console.log(e)}
			  }
		  }
		  resolve("CREATED VARIABLE")
	  });
  },
  getFunc: function getFunc(){
	  return this.createVariableForService
  }
}

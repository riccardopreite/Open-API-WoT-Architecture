const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
var https = require("https");
const multer = require("multer");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const upload = multer();
var arduino = require(path.join(__dirname, '../microcontroller/arduino.js'));
var moving = require(path.join(__dirname, '../microcontroller/clientMoving.js'));
var ontology = require(path.join(__dirname, '../ontology/ontology.js'));
var actionUtils = require(path.join(__dirname, '../thingUtils/actionUtils.js'));
var prop = require(path.join(__dirname, '../thingUtils/propertiesUtils.js'));
var createService = require(path.join(__dirname, '../createService/createServiceServer.js'));
var crawler,servientIP,pusherServer;
var jsonFile = fs.readFileSync(path.join(__dirname, '../thingUtils/apiDict.json'));
var apiJson = JSON.parse(jsonFile);
var Servient = require("@node-wot/core").Servient
var Helpers = require("@node-wot/core").Helpers

var WoT,WoTHelpers;
var serviceTD, serviceProp;
var CoapClientFactory = require("@node-wot/binding-coap").CoapClientFactory
let servient = new Servient();
servient.addClientFactory(new CoapClientFactory(null));
WoTHelpers = new Helpers(servient);

var weatherJson = {}
module.exports = {
  startWebServer : function startWebServer(wot){
	WoT = wot
	createService = require(path.join(__dirname, '../createService/createServiceServer.js'));
  crawler = require(path.join(__dirname, '../crawler/crawler.js'));
  pusherServer = require(path.join(__dirname, 'pusher/pusherServer.js'));
  pusherServer.startService()
  servientIP = crawler.getServientIp()
    var oas3Tools = require('oas3-tools');

    // swaggerRouter configuration

    var options = {
        controllers: path.join(__dirname, '/controllers')
    };
    var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, '/api/openapi.yaml'), options);
    expressAppConfig.addValidator();
    var app = expressAppConfig.getApp();
    //weatherJson = await arduino.checkWeatherMotor()
    app.listen(80, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', 80, 80);
        console.log('Swagger-ui is available on http://localhost:%d/docs', 80);
        console.log("Consumer Server is Running on port 8081 - "+crawler.getServerIP+"!");
    });


    app.get("/getServerIP", async (req, res) => {
      res.send(crawler.getServerIP)
    });
	  
    app.get("/loadWeatherIcon", async (req, res) => {
      let json = await moving.checkWeatherMotor()
      res.send(json)
    });
    app.get("/loadTempIcon", async (req, res) => {
      console.log("SERVER TEMP")
      var temp = {}
      temp["temp"] = await getGeneralWeatherThing();
	  res.send(temp)
    });
    app.get("/getPlantStatus", async (req, res) => {
      let json = await moving.checkPlantStatus()
      res.send(json)
    });
    app.get("/getWeatherStatus", async (req, res) => {
      let json = await moving.checkWeatherTrafficIncidentMoving()
      var meteoType = json["weather"]["weather"]
      var windSpeed = json["weather"]["wind"]
      var coat = false, umbrella = false,traffic = {},incident = {};
      switch(meteoType){
		case "typeSunny":
			break;
		case "typeCloudy":
			coat = true
			break;
		case "typeRain":
			coat = true
			umbrella = true
			break;
		case "typeHail":
			coat = true
			umbrella = true
			break;
		case "typeFog":
			coat = true
			break;
		case "typeSnow":
			coat = true
			umbrella = true
			break;
	  }
	  if(windSpeed>0.5) {
		 coat = true
	  }
	  else{
		 coat = false
	  }
	  let toSend = {}
	  toSend["coat"] = coat
	  toSend["umbrella"] = umbrella
	  toSend["weather"] = meteoType
	  toSend["wind"] = windSpeed
	  toSend["traffic"] = json["traffic"]
	  toSend["incident"] = json["incident"]
      res.send(toSend)
    });
    app.get("/getTrafficStatus", async (req, res) => {
		var lat,lon,json;
		  json = await moving.checkWeatherTrafficIncidentMoving(req.query.lat,req.query.lon)

	  let toSend = {}
	  toSend["traffic"] = json["traffic"]
      res.send(toSend)
    });
    app.get("/getIncidentStatus", async (req, res) => {
		var lat,lon,json;
		  json = await moving.checkWeatherTrafficIncidentMoving(req.query.lat,req.query.lon)
			console.log("JSON MOVING")
			console.log(json)
	  let toSend = {}
	  toSend["incident"] = json["incident"]
      res.send(toSend)
    });
    app.get("/openPlant", async (req, res) => {
		console.log("ENTRATO APERTO")
      return new Promise(async (resolve, reject) => {
		WoTHelpers.fetch("coap://"+servientIP+":5683/DC_Motor_For_Plant_Cover").then(async (td) => {
			var thing = await WoT.consume(td);
			console.log("CONSUMATO APERTO")
			let solved = await thing.invokeAction("openPlant")
			if (solved) res.send("Motor runned")
			else res.send("Motor not runned")

		}).catch((err) => { console.error("Fetch error open Plant:", err.message); res.send(err.message)});
	  });
    });
	app.get("/closePlant", async (req, res) => {
      return new Promise(async (resolve, reject) => {
		  console.log("ENTRATO CHUSO")
		WoTHelpers.fetch("coap://"+servientIP+":5683/DC_Motor_For_Plant_Cover").then(async (td) => {
			var thing = await WoT.consume(td);
			let solved = await thing.invokeAction("coverPlant")
			if (solved) res.send("Motor runned")
			else res.send("Motor not runned")
		}).catch((err) => { console.error("Fetch error close Plant:", err.message); res.send(err.message) });
	  });
    });
    app.get("/getweatherBodyStatus", async (req, res) => {
	  var toSend = {}
      let json = await moving.checkWeatherMotor()
      toSend["weather"] = json["weather"]
      toSend["wind"] = json["wind"]
      toSend["temp"] = await getGeneralWeatherThing();
      console.log(toSend)
      res.send(toSend)
    });
    app.get("/gettempBodyStatus", async (req, res) => {
      var toSend = {}
      toSend["temp"] = await getGeneralWeatherThing();
      res.send(toSend)
    });
    app.get("/getcloudBodyStatus", async (req, res) => {
		var toResolve = {}
		for(var api in apiJson){
			if(apiJson[api][2] == "weather"){
				toResolve[api] = await getCloud(api)
			}
		}
      res.send(toResolve)
    });
    app.get("/getwindBodyStatus", async (req, res) => {
      var toSend = {}
      let json = await moving.checkWeatherMotor()
      toSend["wind"] = json["wind"]
      res.send(toSend)
    });


    app.get("/getSoilStatus", async (req, res) => {
      var split = [44,11]
      let json = await actionUtils.getEnviromentDetection(split,null,apiJson)
      res.send(json)
    });

    app.get("/getAsteroidStatus", async (req, res) => {
	  let toSend = {}
      let json = await prop.readProp(apiJson["asteroidTodayAPI"][0],apiJson["asteroidTodayAPI"][3],apiJson["asteroidTodayAPI"][1])
      let ind = 0;
      for(var key in json["near_earth_objects"][new Date().toISOString().slice(0,10)]){
		toSend[ind] = json["near_earth_objects"][new Date().toISOString().slice(0,10)][key]["links"]["self"]
		ind++
	  }
      res.send(toSend)
    });

    /*Create service api*/
	 app.get("/getApi", async (req, res) => {
     pusherServer.receivedGetApiRequest()
    createService.setWOT(WoT)
    pusherServer.fetchingApi()
		var jsonFile = fs.readFileSync(path.join(__dirname, '../createService/createClientService.json'));
		var clientFile = JSON.parse(jsonFile);
    pusherServer.fetchedApi()
		var toSend = {}
		toSend["endpoint"] = apiJson
		toSend["client"] = clientFile
		res.send(toSend)
	});
	 app.get("/getServices", async (req, res) => {
		var files = fs.readdirSync(path.join(__dirname, '../createService/'));
		var index = 0
		var toSend = {}
		for(var name in files){
			let ext = files[name].split(".")
			if(files[name] != "createClientService.json" && files[name] != "createServiceServer.js" && ext[1] != "json"){
				 toSend[index] = files[name];
				 index++;
			 }
		}
		res.send(toSend);
	});
	app.get("/executeService", async (req, res) => {
		var serviceName = req.query.serviceName
    pusherServer.receivedGeneralRequest(serviceName)
		var serviceModule =  require(path.join(__dirname, '../createService/',serviceName+'.js'));
		var serviceFile = fs.readFileSync(path.join(__dirname, '../createService/',serviceName+".json"));
		var service = JSON.parse(serviceFile);
    pusherServer.fetchingData(serviceName)
		await setUpService(service)
		await serviceModule.setJson(serviceName)
    pusherServer.settledUpService(serviceName)
		let text = await eval("serviceModule."+serviceName+"()")
		console.log(text)
		res.send(text);
	});

  app.delete("/deleteService", async (req, res) => {
    var serviceName = req.query.serviceName
    pusherServer.receivedDeletingRequest(serviceName)
    console.log(serviceName);
    var pathToDelete = path.join(__dirname, '../createService/')
    if(serviceName.includes(",")){
      var serviceToDelete = serviceName.split(",")
      console.log(serviceToDelete)
      for(var key in serviceToDelete){
        console.log(serviceToDelete[key])
        try {
          pusherServer.delitingService(serviceToDelete[key])
          fs.unlinkSync(pathToDelete+serviceToDelete[key]+'.js')
          fs.unlinkSync(pathToDelete+serviceToDelete[key]+'.json')
          pusherServer.delitedService(serviceToDelete[key])
        }
        catch(err) {
          console.error(err)
        }
      }
    }
    else{
      pusherServer.delitingService(serviceName)
      fs.unlinkSync(pathToDelete+serviceName+'.js')
      fs.unlinkSync(pathToDelete+serviceName+'.json')
    }
    res.send("service deleted");
  });

	app.post('/addService',jsonParser,async (req, res) => {
		let service = req.body
		const data = JSON.stringify(service);
		let serviceName = service["name"]
    pusherServer.receivedAddingRequest(serviceName)
		let pathForService = path.join(__dirname, '../createService',serviceName+'.json')
		try {
			if(fs.existsSync(pathForService)) {
				console.log("ESISTE")
				var resu = {}
				resu["res"] = "Service already exist"
				res.json(resu)
			}
			else {
				console.log("NON ESISTE")
				fs.writeFileSync(pathForService, data)
        pusherServer.creatingService(serviceName)
				createServiceUser(service,res)
			}
		}
		catch (err) {
			console.error(err);
		}
	});

	async function setUpService(service){
		return new Promise(async (resolve, reject) => {
			let properties = service["condition"]
			let serviceName = service["name"]
			let ifString = service["string"]
			let then = service["then"]
			let els = service["else"]
			let actionThen = service["then"]["action"]
			let actionElse = service["else"]["action"]
			let paramThen = service["then"]["param"]
			let paramElse = service["else"]["param"]
			var apiProp = {}
			let urlFetch = "coap://"+servientIP+":5683/type_misuration_from_name_with_general_scheme"
      let urlThingJson = {}
			for(var apiKey in apiJson){
				apiProp[apiKey] = {}
				let temp = urlFetch.replace("type",apiJson[apiKey][2])
				urlThingJson[apiKey] = temp.replace("name",apiKey)
			}
      urlThingJson["motor"] = "coap://"+servientIP+":5683/DC_Motor_For_Plant_Cover"
      urlThingJson["lcd"] = "coap://"+servientIP+":5683/LCD_For_Arduino"
      apiProp["motor"] = {}
      apiProp["lcd"] = {}
			await createService.updateTDsub(serviceName,urlThingJson)
			for(var index in properties){
				let firstOPFull = properties[index][0];
				let secondOP = properties[index][2];
				let firstOP;
				if(secondOP.includes("API")){
					let second = secondOP.split("API")
					let secondAPI = second[0] + "API"
					secondOP = second[1]
					apiProp[secondAPI][Object.keys(apiProp[secondAPI]).length] = secondAPI+secondOP
				}
        let firstAPI = ""
        console.log("FIRST OPERAND");
        console.log(firstOPFull);
        if(firstOPFull.includes("API")){
          let first = firstOPFull.split("API")
          firstAPI = first[0] + "API"
          firstOP = first[1]
        }
        else if(firstOPFull.includes("motor")){
          //case motor
          let first = firstOPFull.replace("motor","")
          firstAPI = "motor"
          firstOP = first
        }
        else if(firstOPFull.includes("lcd")){
          //case lcd
          let first = firstOPFull.replace("lcd","")
          firstAPI = "lcd"
          firstOP = first
        }
				apiProp[firstAPI][Object.keys(apiProp[firstAPI]).length] = firstAPI+firstOP
			}
			createService.setServicePropsub(serviceName,apiProp)
			resolve("settled up service")
			//createService.createVariableForService(serviceName)
			/* DO THIS IN SERVICE FILE
			serviceTD = createService.getServiceTD()
			serviceProp = createService.getServiceProp()
			let prova = createService.getFunc()
			console.log(prova)
			prova(serviceName)*/
			//console.log("API PROPERTIES")
			//let x = createService.getServiceProp()
			//console.log(x[serviceName])
			//console.log("TD JSON")
			//let c = createService.getServiceTD()
			//console.log(c[serviceName])
			//console.log(apiProp)
		});
	}
	async function createServiceUser(service,res){
		return new Promise(async (resolve, reject) => {
			let properties = service["condition"]
			let serviceName = service["name"]
			let ifString = service["string"]
			let then = service["then"]
			let els = service["else"]
			let actionThen = service["then"]["action"]
			let actionElse = service["else"]["action"]
			let paramThen = service["then"]["param"]
			let paramElse = service["else"]["param"]
			var apiProp = {}
			let urlFetch = "coap://"+servientIP+":5683/type_misuration_from_name_with_general_scheme"
			let urlThingJson = {}
			for(var apiKey in apiJson){
				apiProp[apiKey] = {}
				let temp = urlFetch.replace("type",apiJson[apiKey][2])
				urlThingJson[apiKey] = temp.replace("name",apiKey)
			}
      urlThingJson["motor"] = "coap://"+servientIP+":5683/DC_Motor_For_Plant_Cover"
      urlThingJson["lcd"] = "coap://"+servientIP+":5683/LCD_For_Arduino"
      apiProp["motor"] = {}
      apiProp["lcd"] = {}
      pusherServer.updatingTDCreating(serviceName)
			await createService.updateTDsub(serviceName,urlThingJson)
      pusherServer.updatedTDCreating(serviceName)
			for(var index in properties){
				let firstOPFull = properties[index][0];
				let secondOP = properties[index][2];
				let firstOP;
				if(secondOP.includes("API")){
					let second = secondOP.split("API")
					let secondAPI = second[0] + "API"
					secondOP = second[1]
					apiProp[secondAPI][Object.keys(apiProp[secondAPI]).length] = secondAPI+secondOP
				}
        let firstAPI = ""
        console.log("FIRST OPERAND");
        console.log(firstOPFull);
        if(firstOPFull.includes("API")){
          let first = firstOPFull.split("API")
          firstAPI = first[0] + "API"
          firstOP = first[1]
        }
        else if(firstOPFull.includes("motor")){
          //case motor
          let first = firstOPFull.replace("motor","")
          firstAPI = "motor"
          firstOP = first
        }
        else if(firstOPFull.includes("lcd")){
          //case lcd
          let first = firstOPFull.replace("lcd","")
          firstAPI = "lcd"
          firstOP = first
        }
				apiProp[firstAPI][Object.keys(apiProp[firstAPI]).length] = firstAPI+firstOP
			}
      pusherServer.settlingPropCreating(serviceName)
			createService.setServicePropsub(serviceName,apiProp)
      pusherServer.settledPropCreating(serviceName)
      var fileString = "var serviceTD={}, serviceProp={};\nconst path = require('path');\nvar createService = require(path.join(__dirname, '../createService/createServiceServer.js'));\nmodule.exports={\nsetJson: async function setJson(serviceName){\n\treturn new Promise(async (resolve, reject) => {\n\t\tserviceTD = createService.getServiceTD();\n\t\tserviceProp = createService.getServiceProp();"+"\n\t\t for(var apiKey in serviceTD[serviceName]){\n\t\t\t  for(var index in serviceProp[serviceName][apiKey]){\n\t\t\t\tif(serviceProp[serviceName][apiKey][index].includes('API')){\n\t\t\t\t\ttoSplit = serviceProp[serviceName][apiKey][index].split('API');\n\t\t\t\t\tprop = toSplit[1];\n\t\t\t\t}\n\t\t\t\telse if(serviceProp[serviceName][apiKey][index].includes('motor')){\n\t\t\t\t\tprop = serviceProp[serviceName][apiKey][index].replace('motor','')\n\t\t\t\t}\n\t\t\t\telse if(serviceProp[serviceName][apiKey][index].includes('lcd')){\n\t\t\t\t\tprop = serviceProp[serviceName][apiKey][index].replace('lcd','')\n\t\t\t\t} \n\t\t\t\t	let properties = await serviceTD[serviceName][apiKey].readProperty(prop).then(async (properties) => {\n\t\t\t\t\t		return new Promise(async (resolveProp, reject) => {\n\t\t\t\t\t\t			resolveProp(properties);\n\t\t\t\t\t		});\n\t\t\t\t	});\n\t\t\t\t	let name = String(serviceProp[serviceName][apiKey][index]);\n\t\t\t\t	let value = '';\n\t\t\t\t	if(typeof properties === 'object'){\n\t\t\t\t\t		for(var key in properties){\n\t\t\t\t\t\t			value = properties[key];\n\t\t\t\t\t\t			break;\n\t\t\t\t\t		}\n\t\t\t\t	}\n\t\t\t\t	else value = properties;\n\t\t\t\t	try{console.log('VALUE');console.log(value)\n\t\t\t\t\tif(apiKey == 'lcd'){\n\t\t\t\t\t\teval(''+name+'=' " + ' +' + '"'+ "'"+  '"'+'+value+'+ '"'+ "'"+  '"'+");"+"\n\t\t\t\t\t\tname = value;\n\t\t\t\t\t}\n\t\t\t\t\telse{\n\t\t\t\t\t\teval(''+name+'='+value);\n\t\t\t\t\t\tname = value;\n\t\t\t\t\t}}\n\t\t\t\t	catch(e){console.log(e);}\n\t\t\t  }\n\t\t  }"+"\n\t\tresolve('created var');\n\t}); \n},\n"
      console.log("ACTION THEN");
      let actionThenString = getAction(actionThen,serviceName,paramThen,then)
			let actionElseString = "'service got else without an action inserted'"
      if(actionElse == "start_motor") actionElseString = "await "+getAction(actionElse,serviceName,paramElse,els) + ";"
			else if(actionElse != "Action" && paramElse != "Parameters") actionElseString = "await "+getAction(actionElse,serviceName,paramElse,els) + ";"
      console.log("ACTION ELSE");

			var functionString = ""
			functionString+= serviceName+": function "+serviceName+"(){\n\treturn new Promise(async (resolve, reject) => {\n\t\tif("+ifString+"){\n\t\t\tlet thenVal = await "+actionThenString+"; \n\t\t\tresolve(thenVal)\n\t\t} \n\t\telse{\n\t\t\tlet elseVal = "+actionElseString+" \n\t\t\tresolve(elseVal)\n\t\t}\n\t });\n} \n}"

			let toWrite = fileString + functionString
			let pathForService = path.join(__dirname, '../createService',serviceName+'.js')
      console.log("PRIMA CREEATE FILE")
      pusherServer.writingFileCreating(serviceName)
			fs.writeFileSync(pathForService, toWrite)
			var resu = {}
			resu["res"] = "service created"
			res.json(resu)
		});
	}
    function getAction(action,serviceName,param,json){
		let string = ""
		switch(action){
			case "print_to_Lcd":
        if(param.includes("API") || param == "lcdtext" || param.includes("motor")) string = "createService.printLcd("+param+")"
				else string = "createService.printLcd('"+param+"')"
				break;
			case "start_motor":
				string = "createService.startMotor()"
				break;
			case "filter":
				 let split = json["object"].split("API")
				 let apiKey = split[0] + "API";
				 let userPos = param
				 string = "createService.filterPosition("+userPos+",'"+serviceName+"','"+apiKey+"')"
				break;
		}
		return string;
	}
    app
    .use(express.static("public")) // for serving the HTML file
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    });
    app.get(["/index","/indexConsumer","/indexService"], (req, res) => {
      res.sendFile(path.join(__dirname, req.url+".html"));
    });
    app.get(["/index.html","/indexConsumer.html","/indexService.html"], (req, res) => {
      res.sendFile(path.join(__dirname, req.url));
    });

    app.get("*", (req, res) => {
      var ext = path.extname(req.url);
      if (
        ext === ".css" ||
        ext === ".html" ||
        ext === ".js" ||
        ext === ".jpg" ||
        ext === ".png" ||
        ext === ".woff" ||
        ext === ".woff2" ||
        ext === ".ttf" ||
        ext === ".svg" ||
        ext === ".eot"
      ) {
        res.sendFile(path.join(__dirname, "./" + req.url));
      } else if (ext === ".ico") {
        res.status(204).json({ nope: true });
      }
    });
  }
}
async function getGeneralWeatherThing(){
	return new Promise(async (resolve, reject) => {
		WoTHelpers.fetch("coap://"+servientIP+":5683/General_Weather_misuration_from_weather_properties_with_general_scheme").then(async (td) => {
			var thing = await WoT.consume(td);
			let temp = await thing.invokeAction("GetAvg")
			resolve(temp)
		}).catch((err) => { res.send(err.message)});
	});
}

async function getCloud(api){
	return new Promise(async (resolve, reject) => {
		WoTHelpers.fetch("coap://"+servientIP+":5683/weather_misuration_from_"+api+"_with_general_scheme").then(async (td) => {
			var toResolve = {}
			var thing = await WoT.consume(td);
			thing.readProperty("endpoint").then(async (end) => {
				toResolve = await ontology.getFilteredData(0,end,"ontology/weather/cloud",api)
				resolve(toResolve)
			});
		}).catch((err) => { resolve("Error") });
    });
}

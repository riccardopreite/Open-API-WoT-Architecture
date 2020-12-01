//create connection to ontology DB

/*
0 -> weather
1 -> traffic
2 -> incidents
3 -> space
4 -> enviroment
*/
var path = require('path');
const axios = require('axios');
var __dirname = path.resolve();
const marklogic = require('marklogic');
const fs = require('fs');
const crawler = require(path.join(__dirname, '/crawler/crawler.js'));
const ontology = require(path.join(__dirname, '/ontology/ontology.js'));
const tConverter = require('@khanisak/temperature-converter').default;
var jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/apiDict.json'));
var apiJson = JSON.parse(jsonFile);



var jsonToResolve = {},jsonTempToResolve = {},jsonIncidentToResolve = {},jsonEnviromentToResolve ={}

var rawdata,jsondata;
rawdata = fs.readFileSync(path.join(__dirname, '/ontology/ontology.json'));
var ontologyJson = JSON.parse(rawdata);
module.exports = {
  getjsonToResolve: function getjsonToResolve(){
    return jsonToResolve
  },
  resetjsonToResolve : function resetjsonToResolve(name){
    jsonToResolve[name] = {}
  },
  resetjsonToResolveSub : function resetjsonToResolveSub(name,sub){
    jsonToResolve[name][sub] = {}
  },
  getjsonTempToResolve: function getjsonTempToResolve(){
    return jsonTempToResolve
  },
  resetjsonTempToResolve : function resetjsonTempToResolve(name){
    jsonTempToResolve[name] = {}
  },
  resetjsonTempToResolveSub : function resetjsonTempToResolveSub(name,sub){
    jsonTempToResolve[name][sub] = {}
  },
  getjsonIncidentToResolve: function getjsonIncidentToResolve(){
    return jsonIncidentToResolve
  },
  resetjsonIncidentToResolve : function resetjsonIncidentToResolve(name){
    jsonIncidentToResolve[name] = {}
  },
  resetjsonIncidentToResolveSub : function resetjsonIncidentToResolveSub(name,sub){
    jsonIncidentToResolve[name][sub] = {}
  },
  getjsonEnviromentToResolve: function getjsonEnviromentToResolve(){
    return jsonEnviromentToResolve
  },
  resetjsonEnviromentToResolve : function resetjsonEnviromentToResolve(name){
    jsonEnviromentToResolve[name] = {}
  },
  resetjsonEnviromentToResolveSub : function resetjsonEnviromentToResolveSub(name,sub){
    jsonEnviromentToResolve[name][sub] = {}
  },
  BootOntology: function BootOntology(){},
  getFilteredData: function getFilteredData(mode,json,prop,name){
    return new Promise(async (resolve, reject) =>  {
      try{
        rawdata = fs.readFileSync(path.join(__dirname, '/'+prop+'.json'));
        var keyDict = JSON.parse(rawdata);
        let x = prop.split("/")
        let index = Object.keys(x).length -1
        let keyJson = x[2]
        for(var key in json){
          var text = String(key).toLowerCase()
          text = text.replace(/_/g,"")
          text = text.replace(/-/g,"")
          text = text.replace(/ /g,"")
          if(typeof json[key] === typeof {} || typeof json[key] === typeof []) {
            let check = false
            for(var ke in keyDict){
              if(text.includes(keyDict[ke])) {
                jsonToResolve[name][keyJson][key] = json[key]
                check = true
              }
            }
            if(!check){
              await getFilteredData(mode,json[key],prop,name)
            }
          }
          else{
            for(var ke in keyDict){
              if(text.includes(keyDict[ke])) {
                jsonToResolve[name][keyJson][key] = json[key]
              }
            }
          }
        }
        resolve(Object.assign({}, {}, jsonToResolve[name][keyJson]))
      }
      catch(e){
        var erre = "This error occured "+ e.message
        var j = {err: erre}
        console.log("some error from ontology.getFilteredData  ");
        console.log(e);
        reject(j)
      }
    });
  },
  getFilteredWeather: function getFilteredWeather(json,prop,name){
    return new Promise(async (resolve, reject) =>  {
      try{
        rawdata = fs.readFileSync(path.join(__dirname, '/'+prop+'.json'));
        var keyDict = JSON.parse(rawdata);
        let x = prop.split("/")
        let index = Object.keys(x).length -1
        let keyJson = x[2]
        for(var key in json){
          var text = String(json[key]).toLowerCase()
          text = text.replace(/_/g,"")
          text = text.replace(/-/g,"")
          text = text.replace(/ /g,"")
          if(typeof json[key] === typeof {} || typeof json[key] === typeof []) {
            let check = false
            await getFilteredWeather(json[key],prop,name)
          }
          else{
            for(var ke in keyDict){
              if(text.includes(keyDict[ke])) {
                jsonToResolve[name][keyJson][key] = json[key]
              }
            }
          }
        }
        resolve(Object.assign({}, {}, jsonToResolve[name][keyJson]))
      }
      catch(e){
        var erre = "This error occured "+ e.message
        var j = {err: erre}
        console.log("some error from ontology.getFilteredData  ");
        console.log(e);
        reject(j)
      }
    });
  },
  getFilteredDataEnviromentInt: function getFilteredDataEnviromentInt(mode,json,prop,name){
    return new Promise(async (resolve, reject) =>  {
      try{
        rawdata = fs.readFileSync(path.join(__dirname, '/'+prop+'.json'));
        var keyDict = JSON.parse(rawdata);
        let x = prop.split("/")
        let index = Object.keys(x).length -1
        let keyJson = x[2]
        for(var key in json){
          var text = String(key).toLowerCase()
          text = text.replace(/_/g,"")
          text = text.replace(/-/g,"")
          text = text.replace(/ /g,"")
          if(typeof json[key] === typeof {} || typeof json[key] === typeof []) getFilteredDataEnviromentInt(mode,json[key],prop,name)
          else{
            for(var ke in keyDict){
              if(text.includes(keyDict[ke])) {
                if(isNumber(json[key])){
                  let c = parseFloat(json[key])
                  jsonEnviromentToResolve[name][keyJson][key] = c
                }
              }
            }
          }
        }
        resolve(Object.assign({}, {}, jsonEnviromentToResolve[name][keyJson]))
      }
      catch(e){
        var erre = "This error occured "+ e.message
        var j = {err: erre}
        console.log("some error from ontology.getFilteredDataEnviromentInt  " + e.message);
        reject(j)
      }
    });
  },
  getFilteredDataEnviroment: function getFilteredDataEnviroment(mode,json,prop,name){
    return new Promise(async (resolve, reject) =>  {
      try{
        rawdata = fs.readFileSync(path.join(__dirname, '/'+prop+'.json'));
        var keyDict = JSON.parse(rawdata);
        let x = prop.split("/")
        let index = Object.keys(x).length -1
        let keyJson = x[2]
        for(var key in json){
			//DO WITH ALL .REPLACE()
          var text = String(key).toLowerCase()
          text = text.replace(/_/g,"")
          text = text.replace(/-/g,"")
          text = text.replace(/ /g,"")
          if(typeof json[key] === typeof {} || typeof json[key] === typeof []) {
            let check = false
            for(var ke in keyDict){
              if(text.includes(keyDict[ke])) {
                jsonEnviromentToResolve[name][keyJson][key] = json[key]
                check = true
              }
            }
            if(!check){
              await getFilteredDataEnviroment(mode,json[key],prop,name)
            }
          }
          else{
            for(var ke in keyDict){
              if(text.includes(keyDict[ke])) {
                jsonEnviromentToResolve[name][keyJson][key] = json[key]
              }
            }
          }
        }
        resolve(Object.assign({}, {}, jsonEnviromentToResolve[name][keyJson]))
      }
      catch(e){
        var erre = "This error occured "+ e.message
        var j = {err: erre}
        console.log("some error from ontology.getFilteredDataEnviroment  " + e.message);
        reject(j)
      }
    });
  },
  getFilteredWindSpd: function getFilteredWindSpd(json,prop,name){
    return new Promise(async (resolve, reject) =>  {
      try{
        rawdata = fs.readFileSync(path.join(__dirname, '/'+prop+'.json'));
        var keyDict = JSON.parse(rawdata);
        let x = prop.split("/")
        let index = Object.keys(x).length -1
        let keyJson = x[2]
        for(var key in json){
          var text = String(key).toLowerCase()
          text = text.replace(/_/g,"")
          text = text.replace(/-/g,"")
          text = text.replace(/ /g,"")
          if(typeof json[key] === typeof {} || typeof json[key] === typeof []) getFilteredWindSpd(json[key],prop,name)
          else{
            for(var ke in keyDict){
              if(text.includes(keyDict[ke])) {
                if(isNumber(json[key])){
                  let c = parseFloat(json[key])
                  jsonToResolve[name][keyJson][key] = c
                }
              }
            }
          }
        }
        resolve(Object.assign({}, {}, jsonToResolve[name][keyJson]))
      }
      catch(e){
        var erre = "This error occured "+ e.message
        var j = {err: erre}
        console.log("some error from ontology.getFilteredWindSpd  " + e.message);
        reject(j)
      }
    });
  },
  checkTempOntology : function checkTempOntology(json,prop,name,to,modeF,modeS){
    return new Promise(async (resolve, reject) =>  {
      try{
        rawdata = fs.readFileSync(path.join(__dirname, '/ontology/weather/temperature.json'));
        var temp = JSON.parse(rawdata);
        if(typeof json[prop] == typeof {}) {
          for(var ke in json[prop]){
            await checkTempOntology(json[prop],ke,name,to,modeF,modeS)
          }
        }
        else{
          var text = String(prop).toLowerCase()
          text = text.replace(/_/g,"")
          text = text.replace(/-/g,"")
          text = text.replace(/ /g,"")
          for(var key in temp){
            if(text.includes(temp[key]) && typeof json[prop] != typeof {}) {
              if(text == "temp"+crawler.unit){
                try{
                  jsonTempToResolve[prop] = json[prop]
                }
                catch(e){
                  console.log("not a number");
                  console.log(e);
                }
              }
              else if(text == "temp"+crawler.notUnitF){
                try{
                  tConverter.convert(json[prop], modeF, to)
                  jsonTempToResolve[prop] = json[prop]
                }
                catch(e){
                  console.log("not a number");
                  console.log(e);
                }
              }
              else if(text == "temp"+crawler.notUnitS){
                try{
                  tConverter.convert(json[prop], modeS, to)
                  jsonTempToResolve[prop] = json[prop]
                }
                catch(e){
                  console.log("not a number");
                  console.log(e);
                }
              }
              else {
                try{
                  jsonTempToResolve[prop] = json[prop]
                }
                catch(e){
                  console.log("not a number");
                  console.log(e);
                }
              }
            }
          }
        }
        resolve(jsonTempToResolve)
      }
      catch(e){
        var erre = "This error occured "+ e.message
        var j = {err: erre}
        console.log("some error from ontology.checkTempOntology  " + e.message);
        reject(j)
      }
    });
  },
  checkIncidentJson: async function checkIncidentJson(api,prop,start,end){
    try{
      var result = await axios.get(apiJson[api][0],{headers:apiJson[api][3]})
      var vect = apiJson[api][1]
      var json = {}
      json = result.data
      for (var ke in vect){
        json = json[vect[ke]]
      }
      var temp = {},resolved = {};
      temp = await getFilteredIncidents(5,json,prop,api,start,end)
      if(JSON.stringify(temp) !== '{}'){
        resolved = Object.assign({}, resolved, temp);
      }
      temp = {}
      return resolved
    }
    catch(e){
      var erre = "This error occured "+ e.message
      var j = {err: erre}
      console.log("some error from ontology.checkIncidentJson  " + e.message);
    }
  }
}
function getFilteredIncidents(mode,json,prop,name,start,end){
  return new Promise(async (resolve, reject) =>  {
    try{
      rawdata = fs.readFileSync(path.join(__dirname, '/'+prop+'.json'));
      var keyDict = JSON.parse(rawdata);
      
      for(var key in json){
        var text = String(key).toLowerCase()
        text = text.replace(/_/g,"")
        text = text.replace(/-/g,"")
        text = text.replace(/ /g,"")
        if(typeof json[key] === typeof {} || typeof json[key] === typeof []) {
          await getFilteredIncidents(mode,json[key],prop,name,start,end)
        }
        else{
			var date = "";
            
			for(var ke in keyDict){
			  if(text.includes(keyDict[ke])) {
				try{
					date = new Date(json[key])
					if(date == "Invalid Date"){
						let temp = json[key].split("(")
						let newtemp = temp[1].split(")")
						date = new Date(newtemp[0])
						if(date == "invalid Date"){
							date = moment(json[key]).format('MM-DD-YYYY');
						}
					}
				}
				catch(e){
				  console.log("Some error getFilteredIncidents" + e.message);
				}
				  
				if(date.getTime() <= end) {
				  var index = Object.keys(jsonIncidentToResolve[name]["time"]).length
				  jsonIncidentToResolve[name]["time"][index] = json
				}
			  }
			}  
        }
      }
      resolve(Object.assign({}, {}, jsonIncidentToResolve[name][prop.replace("ontology/incidents/","")]))
    }
    catch(e){
      var erre = "This error occured "+ e.message
      var j = {err: erre}
      console.log("some error from ontology.getFilteredIncidents  " + e.message);
      reject(j)
    }
  });
}

function isNumber(value) {
  return !isNaN(value)
}

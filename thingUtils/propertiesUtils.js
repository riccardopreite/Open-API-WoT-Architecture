//create properties
const fs = require('fs');
const axios = require('axios');
var path = require('path')
var __dirname = path.resolve();
var rawOntology = fs.readFileSync(path.join(__dirname, '/ontology/ontology.json'));
var onto = JSON.parse(rawOntology);
var jsonFile = fs.readFileSync(path.join(__dirname, '/thingUtils/apiDict.json'));
var apiJson = JSON.parse(jsonFile);

const ontology = require(path.join(__dirname, '/ontology/ontology.js'))
const properties = require(path.join(__dirname, 'thingUtils//propertiesUtils.js'))
module.exports = {
  createProperties: function createProperties(name,mode){
    var rawdata = fs.readFileSync(path.join(__dirname, '/ontology/'+onto[mode]+'.json'));
    var ontologyJson = JSON.parse(rawdata);
    var json = {}
    for(var key in ontologyJson){
      json[key] = {
        type: "Json Object",
        description: key,
        descriptions: {
          "en": key,
          "de": key,
          "it": key
        },
        observable: true,
        readOnly: true
      }
    }
    return json;
  },
  setPropertyReader: function setPropertyReader(name,thing,mode,pathToFIle){
    var rawdata = fs.readFileSync(path.join(__dirname, '/ontology/'+onto[mode]+'.json'));
    var ontologyJson = JSON.parse(rawdata);
    ontology.resetjsonToResolve(name)
    for(var key in ontologyJson){
      ontology.resetjsonToResolveSub(name,key)
      setProp(name,thing,mode,key,"ontology/"+pathToFIle+"/"+key)
    }
  },
  readProp: async function readProp(url,headers,vect){
    try{
      var result = await axios.get(url,{headers:headers})
      var json = {}
      json = result.data
      for (var key in vect){
        json = json[vect[key]]
      }
      return json
    }
    catch(e){
      var erre = "This error occured "+ e.message
      var j = {err: erre}
      return j
      console.log("some error from readProp" + e);
    }
  },
  createTodayAsteroid: async function createTodayAsteroid(name,thing){
    var urlToday = apiJson["asteroidTodayAPI"][0]
    var header = apiJson["asteroidTodayAPI"][3]
    var vect = apiJson["asteroidTodayAPI"][1]
    try{
      var result = await axios.get(urlToday,{headers:header})
      var json = {}
      json = result.data
      for (var ke in vect){
        json = json[vect[ke]]
      }
      var temp = {},resolved = {};
      temp = await getFilteredAsteroid(json,temp)
      for(var key in temp){
        var index = Object.keys(resolved).length
        var te = await callAPI("https://api.nasa.gov/neo/rest/v1/neo/sentry/"+temp[key]+"?api_key=KZvLR8BR180lH1LCc9reF4FibyBTZxD8fz1PHvBZ",apiJson["asteroidNearImpactTodayAPI"][3])
        if(JSON.stringify(te) !== '{}'){
          resolved[index] = te
        }
      }
      thing.setPropertyReadHandler("endpoint", () => {
        return new Promise(async (resolve, reject) =>  {
          resolve(resolved)
        });
      });
      temp = {}
      return resolved
    }
    catch(e){
      var erre = "This error occured "+ e.message
      var j = {err: erre}
      return j
      console.log("some error from propertiesUtils " + e.message);
    }
  }
}

async function callAPI(url,header){
  return new Promise(async (resolve, reject) =>  {
    try{
      var result = await axios.get(url,{headers:header})
      var json = {}
      json = result.data
      for (var ke in vect){
        json = json[vect[ke]]
      }
      resolve(json)
    }
    catch(e){
      resolve({})
    }
  });
}

async function getFilteredAsteroid(json,temp){
  for(var key in json){
    if(typeof json[key] === typeof {} || typeof json[key] === typeof []) getFilteredAsteroid(json[key],temp)
    else {
      if(key === "id"){
        var index = Object.keys(temp).length
        temp[index] = json[key]
      }
    }
  }
  return temp;
}


function setProp(name,thing,mode,prop,toFilter){
  thing.setPropertyReadHandler(prop, () => {
      return new Promise(async (resolve, reject) =>  {
        try{
          var json = {}
          if(name == "asteroidNearImpactTodayAPI") json = await module.exports.createTodayAsteroid(name,thing)
          else{
            var result = await axios.get(apiJson[name][0],{headers:apiJson[name][3]})
            var vect = apiJson[name][1]
            json = {}
            json = result.data
            for (var ke in vect){
              json = json[vect[ke]]
            }
          }
          var temp = {},resolved = {};
          temp = await ontology.getFilteredData(mode,json,toFilter,name)
          if(JSON.stringify(temp) !== '{}'){
            resolved = Object.assign({}, resolved, temp);
          }
          temp = {}
          resolve(resolved)
        }
        catch(e){
          var erre = "This error occured "+ e.message
          var j = {err: erre}
          resolve(j)
          console.log("some error from propertiesUtils setProp" + e.message);
        }
      });
      // ontology.createPropertiesWeather()
  });
}

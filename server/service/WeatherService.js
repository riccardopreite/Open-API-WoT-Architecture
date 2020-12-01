'use strict';


/**
 * Auto generated using Swagger Inspector
 *
 * q String  (optional)
 * appid String  (optional)
 * units String  (optional)
 * returns String
 **/
exports.data2_5WeatherGET = function(q,appid,units) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Auto generated using Swagger Inspector
 *
 * q String  (optional)
 * apikey String  (optional)
 * language String  (optional)
 * details Boolean  (optional)
 * no response value expected for this operation
 **/
exports.locationsV1CitiesSearchGET = function(q,apikey,language,details) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Auto generated using Swagger Inspector
 *
 * q String  (optional)
 * key String  (optional)
 * returns inline_response_200
 **/
exports.v1Current_jsonGET = function(q,key) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "current" : {
    "feelslike_c" : 0.8008281904610115,
    "uv" : 6.027456183070403,
    "last_updated" : "last_updated",
    "feelslike_f" : 1.4658129805029452,
    "wind_degree" : 5,
    "last_updated_epoch" : 5,
    "is_day" : 2,
    "precip_in" : 7.061401241503109,
    "wind_dir" : "wind_dir",
    "gust_mph" : 9.301444243932576,
    "temp_c" : 3.616076749251911,
    "pressure_in" : 2.027123023002322,
    "gust_kph" : 4.145608029883936,
    "temp_f" : 7.386281948385884,
    "precip_mm" : 1.2315135367772556,
    "cloud" : 1,
    "wind_kph" : 1.4894159098541704,
    "condition" : {
      "code" : 6,
      "icon" : "icon",
      "text" : "text"
    },
    "wind_mph" : 7.457744773683766,
    "vis_km" : 1.1730742509559433,
    "humidity" : 4,
    "pressure_mb" : 5.025004791520295,
    "vis_miles" : 9.965781217890562
  },
  "location" : {
    "localtime" : "localtime",
    "country" : "country",
    "localtime_epoch" : 9,
    "name" : "name",
    "lon" : 6.683562403749608,
    "region" : "region",
    "lat" : 8.762042012749001,
    "tz_id" : "tz_id"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Auto generated using Swagger Inspector
 *
 * apiKey String  (optional)
 * format String  (optional)
 * units String  (optional)
 * stationId String  (optional)
 * no response value expected for this operation
 **/
exports.v2PwsObservationsAll1dayGET = function(apiKey,format,units,stationId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Auto generated using Swagger Inspector
 *
 * city String  (optional)
 * key String  (optional)
 * returns String
 **/
exports.v2_0CurrentGET = function(city,key) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


'use strict';


/**
 * Auto generated using Swagger Inspector
 *
 * lng String  (optional)
 * lat String  (optional)
 * xApiKey String  (optional)
 * returns String
 **/
exports.latestPollenBy_lat_lngGET = function(lng,lat,xApiKey) {
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
 * lng String  (optional)
 * lat String  (optional)
 * xApiKey String  (optional)
 * returns String
 **/
exports.soilLatestBy_lat_lngGET = function(lng,lat,xApiKey) {
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
 * number_classes String  (optional)
 * lon String  (optional)
 * lat String  (optional)
 * returns inline_response_200_2
 **/
exports.soilgridsV2_0ClassificationQueryGET = function(number_classes,lon,lat) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "query_time_s" : 0.8008281904610115,
  "wrb_class_probability" : [ [ "wrb_class_probability", "wrb_class_probability" ], [ "wrb_class_probability", "wrb_class_probability" ] ],
  "coordinates" : [ 6.027456183070403, 6.027456183070403 ],
  "wrb_class_name" : "wrb_class_name",
  "type" : "type",
  "wrb_class_value" : 1
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
 * lng String  (optional)
 * lat String  (optional)
 * xApiKey String  (optional)
 * returns String
 **/
exports.waterVaporLatestBy_lat_lngGET = function(lng,lat,xApiKey) {
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


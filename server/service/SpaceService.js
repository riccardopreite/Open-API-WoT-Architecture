'use strict';


/**
 * Auto generated using Swagger Inspector
 *
 * returns inline_response_200_1
 **/
exports.iss_now_jsonGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "iss_position" : {
    "latitude" : "latitude",
    "longitude" : "longitude"
  },
  "message" : "message",
  "timestamp" : 0
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
 * end_date String  (optional)
 * api_key String  (optional)
 * start_date String  (optional)
 * no response value expected for this operation
 **/
exports.neoRestV1FeedGET = function(end_date,api_key,start_date) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


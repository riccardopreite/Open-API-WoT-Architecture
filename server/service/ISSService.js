'use strict';


/**
 * Auto generated using Swagger Inspector
 *
 * returns inline_response_200
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

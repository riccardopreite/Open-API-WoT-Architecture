'use strict';


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


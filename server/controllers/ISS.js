'use strict';

var utils = require('../utils/writer.js');
var ISS = require('../service/ISSService');

module.exports.iss_now_jsonGET = function iss_now_jsonGET (req, res, next) {
  ISS.iss_now_jsonGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

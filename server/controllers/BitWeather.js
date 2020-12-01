'use strict';

var utils = require('../utils/writer.js');
var BitWeather = require('../service/BitWeatherService');

module.exports.v2_0CurrentGET = function v2_0CurrentGET (req, res, next, city, key) {
  BitWeather.v2_0CurrentGET(city, key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

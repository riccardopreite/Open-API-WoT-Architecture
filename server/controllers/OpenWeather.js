'use strict';

var utils = require('../utils/writer.js');
var OpenWeather = require('../service/OpenWeatherService');

module.exports.data2_5WeatherGET = function data2_5WeatherGET (req, res, next, q, appid, units) {
  OpenWeather.data2_5WeatherGET(q, appid, units)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

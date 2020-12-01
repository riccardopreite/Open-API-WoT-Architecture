'use strict';

var utils = require('../utils/writer.js');
var UndergroundWeather = require('../service/UndergroundWeatherService');

module.exports.v2PwsObservationsAll1dayGET = function v2PwsObservationsAll1dayGET (req, res, next, apiKey, format, units, stationId) {
  UndergroundWeather.v2PwsObservationsAll1dayGET(apiKey, format, units, stationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

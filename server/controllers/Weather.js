'use strict';

var utils = require('../utils/writer.js');
var Weather = require('../service/WeatherService');

module.exports.data2_5WeatherGET = function data2_5WeatherGET (req, res, next, q, appid, units) {
  Weather.data2_5WeatherGET(q, appid, units)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.locationsV1CitiesSearchGET = function locationsV1CitiesSearchGET (req, res, next, q, apikey, language, details) {
  Weather.locationsV1CitiesSearchGET(q, apikey, language, details)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.v1Current_jsonGET = function v1Current_jsonGET (req, res, next, q, key) {
  Weather.v1Current_jsonGET(q, key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.v2PwsObservationsAll1dayGET = function v2PwsObservationsAll1dayGET (req, res, next, apiKey, format, units, stationId) {
  Weather.v2PwsObservationsAll1dayGET(apiKey, format, units, stationId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.v2_0CurrentGET = function v2_0CurrentGET (req, res, next, city, key) {
  Weather.v2_0CurrentGET(city, key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

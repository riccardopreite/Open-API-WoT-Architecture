'use strict';

var utils = require('../utils/writer.js');
var Environment = require('../service/EnvironmentService');

module.exports.latestPollenBy_lat_lngGET = function latestPollenBy_lat_lngGET (req, res, next, lng, lat, xApiKey) {
  Environment.latestPollenBy_lat_lngGET(lng, lat, xApiKey)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.soilLatestBy_lat_lngGET = function soilLatestBy_lat_lngGET (req, res, next, lng, lat, xApiKey) {
  Environment.soilLatestBy_lat_lngGET(lng, lat, xApiKey)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.soilgridsV2_0ClassificationQueryGET = function soilgridsV2_0ClassificationQueryGET (req, res, next, number_classes, lon, lat) {
  Environment.soilgridsV2_0ClassificationQueryGET(number_classes, lon, lat)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.waterVaporLatestBy_lat_lngGET = function waterVaporLatestBy_lat_lngGET (req, res, next, lng, lat, xApiKey) {
  Environment.waterVaporLatestBy_lat_lngGET(lng, lat, xApiKey)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

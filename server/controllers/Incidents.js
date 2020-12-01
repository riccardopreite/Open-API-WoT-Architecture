'use strict';

var utils = require('../utils/writer.js');
var Incidents = require('../service/IncidentsService');

module.exports.traffic6_3Incidents_jsonGET = function traffic6_3Incidents_jsonGET (req, res, next, apiKey, bbox, maxresult) {
  Incidents.traffic6_3Incidents_jsonGET(apiKey, bbox, maxresult)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

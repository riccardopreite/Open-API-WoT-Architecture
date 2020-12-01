'use strict';

var utils = require('../utils/writer.js');
var Traffic = require('../service/TrafficService');

module.exports.trafficServices4FlowSegmentDataAbsolute10JsonGET = function trafficServices4FlowSegmentDataAbsolute10JsonGET (req, res, next, key, point) {
  Traffic.trafficServices4FlowSegmentDataAbsolute10JsonGET(key, point)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

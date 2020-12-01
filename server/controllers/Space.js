'use strict';

var utils = require('../utils/writer.js');
var Space = require('../service/SpaceService');

module.exports.iss_now_jsonGET = function iss_now_jsonGET (req, res, next) {
  Space.iss_now_jsonGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.neoRestV1FeedGET = function neoRestV1FeedGET (req, res, next, end_date, api_key, start_date) {
  Space.neoRestV1FeedGET(end_date, api_key, start_date)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

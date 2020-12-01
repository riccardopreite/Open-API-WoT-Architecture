
/******************************
Start swagger, ontology and crawler services
******************************/

/********************
  Form of dictionary:
  name: link API,key to access data, type of api, header request, new uri to refresh data, vect with the key to be replaced, input type, unit misuration vector for api
********************/

var wot = this.WoT
var path = require('path');
var __dirname = path.resolve();
const crawler = require(path.join(__dirname, '/crawler/crawler.js'))
const arduino = require(path.join(__dirname, '/microcontroller/arduino.js'))
// const ontology = require(path.join(__dirname, '/ontology.js'))
const server = require(path.join(__dirname, '/server/server.js'))

crawler.BootCrawler(wot);
arduino.bootArduino(wot);
server.startWebServer(wot);

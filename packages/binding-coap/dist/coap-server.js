"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coap = require('coap');
var url = require("url");
const path = require("path");
var TD = require("@node-wot/td-tools");
var core_1 = require("@node-wot/core");
var crawler = require(path.join(__dirname, '../../../crawler/crawler.js'));
const ddns = crawler.getDdns()
var CoapServer = (function () {
    function CoapServer(port, address) {
        var _this = this;
        this.scheme = "coap";
        this.PROPERTY_DIR = "properties";
        this.ACTION_DIR = "actions";
        this.EVENT_DIR = "events";
        this.port = 5683;
        this.address = undefined;
        this.server = coap.createServer(function (req, res) { _this.handleRequest(req, res); });
        this.things = new Map();
        this.servient = null;
        if (port !== undefined) {
            this.port = port;
        }
        if (address !== undefined) {
            this.address = address;
        }
        coap.registerFormat(core_1.ContentSerdes.JSON_LD, 2100);
        coap.registerFormat(core_1.ContentSerdes.TD, 65100);
    }
    CoapServer.prototype.start = function (servient) {
        var _this = this;
        console.info("[binding-coap]", "CoapServer starting on " + (this.address !== undefined ? this.address + ' ' : '') + "port " + this.port);
        return new Promise(function (resolve, reject) {
            _this.servient = servient;
            _this.server.once('error', function (err) { reject(err); });
            _this.server.listen(_this.port, _this.address, function () {
                _this.server.on('error', function (err) {
                    console.error("[binding-coap]", "CoapServer for port " + _this.port + " failed: " + err.message);
                });
                resolve();
            });
        });
    };
    CoapServer.prototype.stop = function () {
        var _this = this;
        console.info("[binding-coap]", "CoapServer stopping on port " + this.getPort());
        return new Promise(function (resolve, reject) {
            _this.server.once('error', function (err) { reject(err); });
            _this.server.close(function () { resolve(); });
        });
    };
    CoapServer.prototype.getSocket = function () {
        return this.server._sock;
    };
    CoapServer.prototype.getPort = function () {
        if (this.server._sock) {
            return this.server._sock.address().port;
        }
        else {
            return -1;
        }
    };
    CoapServer.prototype.expose = function (thing, tdTemplate) {
        var title = thing.title;
        if (this.things.has(title)) {
            title = core_1.Helpers.generateUniqueName(title);
        }
        console.debug("[binding-coap]", "CoapServer on port " + this.getPort() + " exposes '" + thing.title + "' as unique '/" + title + "'");
        if (this.getPort() !== -1) {
            this.things.set(title, thing);
            for (var _i = 0, _a = core_1.Helpers.getAddresses(); _i < _a.length; _i++) {
                var address = _a[_i];
                for (var _b = 0, _c = core_1.ContentSerdes.get().getOfferedMediaTypes(); _b < _c.length; _b++) {
                    var type = _c[_b];
                    var base = this.scheme +ddns + this.getPort() + "/" + encodeURIComponent(title);
                    for (var propertyName in thing.properties) {
                        var href = base + "/" + this.PROPERTY_DIR + "/" + encodeURIComponent(propertyName);
                        var form = new TD.Form(href, type);
                        core_1.ProtocolHelpers.updatePropertyFormWithTemplate(form, tdTemplate, propertyName);
                        if (thing.properties[propertyName].readOnly) {
                            form.op = ["readproperty"];
                        }
                        else if (thing.properties[propertyName].writeOnly) {
                            form.op = ["writeproperty"];
                        }
                        else {
                            form.op = ["readproperty", "writeproperty"];
                        }
                        thing.properties[propertyName].forms.push(form);
                        console.debug("[binding-coap]", "CoapServer on port " + this.getPort() + " assigns '" + href + "' to Property '" + propertyName + "'");
                    }
                    for (var actionName in thing.actions) {
                        var href = base + "/" + this.ACTION_DIR + "/" + encodeURIComponent(actionName);
                        var form = new TD.Form(href, type);
                        core_1.ProtocolHelpers.updateActionFormWithTemplate(form, tdTemplate, actionName);
                        form.op = "invokeaction";
                        thing.actions[actionName].forms.push(form);
                        console.debug("[binding-coap]", "CoapServer on port " + this.getPort() + " assigns '" + href + "' to Action '" + actionName + "'");
                    }
                    for (var eventName in thing.events) {
                        var href = base + "/" + this.EVENT_DIR + "/" + encodeURIComponent(eventName);
                        var form = new TD.Form(href, type);
                        core_1.ProtocolHelpers.updateEventFormWithTemplate(form, tdTemplate, eventName);
                        form.op = "subscribeevent";
                        thing.events[eventName].forms.push(form);
                        console.debug("[binding-coap]", "CoapServer on port " + this.getPort() + " assigns '" + href + "' to Event '" + eventName + "'");
                    }
                }
            }
        }
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    CoapServer.prototype.handleRequest = function (req, res) {
        var _this = this;
        console.debug("[binding-coap]", "CoapServer on port " + this.getPort() + " received '" + req.method + "(" + req._packet.messageId + ") " + req.url + "' from " + core_1.Helpers.toUriLiteral(req.rsinfo.address) + ":" + req.rsinfo.port);
        res.on('finish', function () {
            console.debug("[binding-coap]", "CoapServer replied with '" + res.code + "' to " + core_1.Helpers.toUriLiteral(req.rsinfo.address) + ":" + req.rsinfo.port);
        });
        var requestUri = url.parse(req.url);
        var contentType = req.options['Content-Format'];
        if (req.method === "PUT" || req.method === "POST") {
            if (!contentType && req.payload) {
                console.warn("[binding-coap]", "CoapServer on port " + this.getPort() + " received no Content-Format from " + core_1.Helpers.toUriLiteral(req.rsinfo.address) + ":" + req.rsinfo.port);
                contentType = core_1.ContentSerdes.DEFAULT;
            }
            else if (core_1.ContentSerdes.get().getSupportedMediaTypes().indexOf(core_1.ContentSerdes.getMediaType(contentType)) < 0) {
                res.code = "4.15";
                res.end("Unsupported Media Type");
                return;
            }
        }
        var segments = decodeURI(requestUri.pathname).split("/");
        if (segments[1] === "") {
            if (req.method === "GET") {
                res.setHeader("Content-Type", core_1.ContentSerdes.DEFAULT);
                res.code = "2.05";
                var list = [];
                for (var _i = 0, _a = core_1.Helpers.getAddresses(); _i < _a.length; _i++) {
                    var address = _a[_i];
                    for (var _b = 0, _c = Array.from(this.things.keys()); _b < _c.length; _b++) {
                        var name_1 = _c[_b];
                        if(core_1.Helpers.toUriLiteral(address).includes("192.168")) list.push(this.scheme + ddns + this.getPort() + "/" + encodeURIComponent(name_1));
						else list.push(this.scheme + "://" + core_1.Helpers.toUriLiteral(address) + ":" + this.getPort() + "/" + encodeURIComponent(name_1));
                        //list.push(this.scheme + "://" + core_1.Helpers.toUriLiteral(address) + ":" + this.getPort() + "/" + encodeURIComponent(name_1));
                    }
                }
                res.end(JSON.stringify(list));
            }
            else {
                res.code = "4.05";
                res.end("Method Not Allowed");
            }
            return;
        }
        else {
            var thing_1 = this.things.get(segments[1]);
            if (thing_1) {
                if (segments.length === 2 || segments[2] === "") {
                    if (req.method === "GET") {
                        res.setOption("Content-Format", core_1.ContentSerdes.TD);
                        res.code = "2.05";
                        res.end(JSON.stringify(thing_1.getThingDescription()));
                    }
                    else {
                        res.code = "4.05";
                        res.end("Method Not Allowed");
                    }
                    return;
                }
                else if (segments[2] === this.PROPERTY_DIR) {
                    var property_1 = thing_1.properties[segments[3]];
                    if (property_1) {
                        if (req.method === "GET") {
                            if (req.headers['Observe'] === undefined) {
                                thing_1.readProperty(segments[3])
                                    .then(function (value) {
                                    var contentType = core_1.ProtocolHelpers.getPropertyContentType(thing_1.getThingDescription(), segments[3], "coap");
                                    var content = core_1.ContentSerdes.get().valueToContent(value, property_1, contentType);
                                    res.setOption("Content-Format", content.type);
                                    res.code = "2.05";
                                    res.end(content.body);
                                })
                                    .catch(function (err) {
                                    console.error("[binding-coap]", "CoapServer on port " + _this.getPort() + " got internal error on read '" + requestUri.pathname + "': " + err.message);
                                    res.code = "5.00";
                                    res.end(err.message);
                                });
                            }
                            else {
                                var oInterval = setInterval(function () {
                                    var _this = this;
                                    thing_1.readProperty(segments[3])
                                        .then(function (value) {
                                        var contentType = core_1.ProtocolHelpers.getPropertyContentType(thing_1.getThingDescription(), segments[3], "coap");
                                        var content = core_1.ContentSerdes.get().valueToContent(value, property_1, contentType);
                                        res.setOption("Content-Format", content.type);
                                        res.code = "2.05";
                                        res.write(content.body);
                                        res.on('finish', function (err) {
                                            clearInterval(oInterval);
                                            res.end();
                                        });
                                    })
                                        .catch(function (err) {
                                        console.error("[binding-coap]", "CoapServer on port " + _this.getPort() + " got internal error on read '" + requestUri.pathname + "': " + err.message);
                                        res.code = "5.00";
                                        res.end(err.message);
                                    });
                                }, 100);
                            }
                        }
                        else if (req.method === "PUT") {
                            if (!property_1.readOnly) {
                                var value = void 0;
                                try {
                                    value = core_1.ContentSerdes.get().contentToValue({ type: contentType, body: req.payload }, property_1);
                                }
                                catch (err) {
                                    console.warn("[binding-coap]", "CoapServer on port " + this.getPort() + " cannot process write data for Property '" + segments[3] + ": " + err.message + "'");
                                    res.code = "4.00";
                                    res.end("Invalid Data");
                                    return;
                                }
                                thing_1.writeProperty(segments[3], value)
                                    .then(function () {
                                    res.code = "2.04";
                                    res.end("Changed");
                                })
                                    .catch(function (err) {
                                    console.error("[binding-coap]", "CoapServer on port " + _this.getPort() + " got internal error on write '" + requestUri.pathname + "': " + err.message);
                                    res.code = "5.00";
                                    res.end(err.message);
                                });
                            }
                            else {
                                res.code = "4.00";
                                res.end("Property readOnly");
                            }
                        }
                        else {
                            res.code = "4.05";
                            res.end("Method Not Allowed");
                        }
                        return;
                    }
                }
                else if (segments[2] === this.ACTION_DIR) {
                    var action_1 = thing_1.actions[segments[3]];
                    if (action_1) {
                        if (req.method === "POST") {
                            var input = void 0;
                            try {
                                input = core_1.ContentSerdes.get().contentToValue({ type: contentType, body: req.payload }, action_1.input);
                            }
                            catch (err) {
                                console.warn("[binding-coap]", "CoapServer on port " + this.getPort() + " cannot process input to Action '" + segments[3] + ": " + err.message + "'");
                                res.code = "4.00";
                                res.end("Invalid Input Data");
                                return;
                            }
                            thing_1.invokeAction(segments[3], input)
                                .then(function (output) {
                                if (output) {
                                    var contentType_1 = core_1.ProtocolHelpers.getActionContentType(thing_1.getThingDescription(), segments[3], "coap");
                                    var content = core_1.ContentSerdes.get().valueToContent(output, action_1.output, contentType_1);
                                    res.setOption("Content-Format", content.type);
                                    res.code = "2.05";
                                    res.end(content.body);
                                }
                                else {
                                    res.code = "2.04";
                                    res.end();
                                }
                            })
                                .catch(function (err) {
                                console.error("[binding-coap]", "CoapServer on port " + _this.getPort() + " got internal error on invoke '" + requestUri.pathname + "': " + err.message);
                                res.code = "5.00";
                                res.end(err.message);
                            });
                        }
                        else {
                            res.code = "4.05";
                            res.end("Method Not Allowed");
                        }
                        return;
                    }
                }
                else if (segments[2] === this.EVENT_DIR) {
                    var event_1 = thing_1.events[segments[3]];
                    if (event_1) {
                        if (req.method === "GET") {
                            if (req.headers['Observe'] === 0) {
                                var packet = res._packet;
                                packet.code = '0.00';
                                packet.payload = '';
                                packet.reset = false;
                                packet.ack = true;
                                packet.token = new Buffer(0);
                                res._send(res, packet);
                                res._packet.confirmable = res._request.confirmable;
                                res._packet.token = res._request.token;
                                var subscription = thing_1.subscribeEvent(segments[3], function (data) {
                                    var content;
                                    try {
                                        var contentType_2 = core_1.ProtocolHelpers.getEventContentType(thing_1.getThingDescription(), segments[3], "coap");
                                        content = core_1.ContentSerdes.get().valueToContent(data, event_1.data, contentType_2);
                                    }
                                    catch (err) {
                                        console.warn("[binding-coap]", "CoapServer on port " + _this.getPort() + " cannot process data for Event '" + segments[3] + ": " + err.message + "'");
                                        res.code = "5.00";
                                        res.end("Invalid Event Data");
                                        return;
                                    }
                                    console.debug("[binding-coap]", "CoapServer on port " + _this.getPort() + " sends '" + segments[3] + "' notification to " + core_1.Helpers.toUriLiteral(req.rsinfo.address) + ":" + req.rsinfo.port);
                                    res.setOption("Content-Format", content.type);
                                    res.code = "2.05";
                                    res.write(content.body);
                                })
                                    .then(function () {
                                    console.debug("[binding-coap]", "CoapServer on port " + _this.getPort() + " completes '" + segments[3] + "' subscription");
                                    res.end();
                                })
                                    .catch(function () {
                                    console.debug("[binding-coap]", "CoapServer on port " + _this.getPort() + " failed '" + segments[3] + "' subscription");
                                    res.code = "5.00";
                                    res.end();
                                });
                                res.on('finish', function () {
                                    console.debug("[binding-coap]", "CoapServer on port " + _this.getPort() + " ends '" + segments[3] + "' observation from " + core_1.Helpers.toUriLiteral(req.rsinfo.address) + ":" + req.rsinfo.port);
                                    thing_1.unsubscribeEvent(segments[3]);
                                });
                            }
                            else if (req.headers['Observe'] > 0) {
                                console.debug("[binding-coap]", "CoapServer on port " + this.getPort() + " sends '" + segments[3] + "' response to " + core_1.Helpers.toUriLiteral(req.rsinfo.address) + ":" + req.rsinfo.port);
                                res.code = "5.01";
                                res.end("node-coap issue: no GET cancellation, send RST");
                            }
                            else {
                                console.debug("[binding-coap]", "CoapServer on port " + this.getPort() + " rejects '" + segments[3] + "' read from " + core_1.Helpers.toUriLiteral(req.rsinfo.address) + ":" + req.rsinfo.port);
                                res.code = "4.00";
                                res.end("No Observe Option");
                            }
                        }
                        else {
                            res.code = "4.05";
                            res.end("Method Not Allowed");
                        }
                        return;
                    }
                }
            }
        }
        res.code = "4.04";
        res.end("Not Found");
    };
    return CoapServer;
}());
exports.default = CoapServer;
//# sourceMappingURL=coap-server.js.map

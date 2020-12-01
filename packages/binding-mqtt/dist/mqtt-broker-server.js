"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mqtt = require("mqtt");
var url = require("url");
var TD = require("@node-wot/td-tools");
var core_1 = require("@node-wot/core");
var MqttBrokerServer = (function () {
    function MqttBrokerServer(uri, user, psw, clientId, protocolVersion) {
        this.scheme = "mqtt";
        this.port = -1;
        this.address = undefined;
        this.user = undefined;
        this.psw = undefined;
        this.clientId = undefined;
        this.protocolVersion = undefined;
        this.brokerURI = undefined;
        this.things = new Map();
        if (uri !== undefined) {
            if (uri.indexOf("://") == -1) {
                uri = this.scheme + "://" + uri;
            }
            this.brokerURI = uri;
        }
        if (user !== undefined) {
            this.user = user;
        }
        if (psw !== undefined) {
            this.psw = psw;
        }
        if (clientId !== undefined) {
            this.clientId = clientId;
        }
        if (protocolVersion !== undefined) {
            this.protocolVersion = protocolVersion;
        }
    }
    MqttBrokerServer.prototype.expose = function (thing) {
        var _this = this;
        if (this.broker === undefined) {
            return;
        }
        var name = thing.title;
        if (this.things.has(name)) {
            var suffix = name.match(/.+_([0-9]+)$/);
            if (suffix !== null) {
                name = name.slice(0, -suffix[1].length) + (1 + parseInt(suffix[1]));
            }
            else {
                name = name + "_2";
            }
        }
        console.debug("[binding-mqtt]", "MqttBrokerServer at " + this.brokerURI + " exposes '" + thing.title + "' as unique '/" + name + "/*'");
        return new Promise(function (resolve, reject) {
            _this.things.set(name, thing);
            var _loop_1 = function (propertyName) {
                var topic = "/" + encodeURIComponent(name) + "/properties/" + encodeURIComponent(propertyName);
                var property = thing.properties[propertyName];
                if (!property.writeOnly) {
                    thing.observeProperty(propertyName, function (data) {
                        var content;
                        try {
                            content = core_1.ContentSerdes.get().valueToContent(data, property.data);
                        }
                        catch (err) {
                            console.warn("[binding-mqtt]", "MqttServer cannot process data for Property '" + propertyName + "': " + err.message);
                            thing.unobserveProperty(propertyName);
                            return;
                        }
                        console.debug("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " publishing to Property topic '" + propertyName + "' ");
                        _this.broker.publish(topic, content.body, { retain: true });
                    });
                    var href = _this.brokerURI + topic;
                    var form = new TD.Form(href, core_1.ContentSerdes.DEFAULT);
                    form.op = ["readproperty", "observeproperty", "unobserveproperty"];
                    thing.properties[propertyName].forms.push(form);
                    console.debug("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " assigns '" + href + "' to property '" + propertyName + "'");
                }
                if (!property.readOnly) {
                    var href = _this.brokerURI + topic + "/writeproperty";
                    _this.broker.subscribe(topic + "/writeproperty");
                    var form = new TD.Form(href, core_1.ContentSerdes.DEFAULT);
                    form.op = ["writeproperty"];
                    thing.properties[propertyName].forms.push(form);
                    console.debug("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " assigns '" + href + "' to property '" + propertyName + "'");
                }
            };
            for (var propertyName in thing.properties) {
                _loop_1(propertyName);
            }
            for (var actionName in thing.actions) {
                var topic = "/" + encodeURIComponent(name) + "/actions/" + encodeURIComponent(actionName);
                _this.broker.subscribe(topic);
                var href = _this.brokerURI + topic;
                var form = new TD.Form(href, core_1.ContentSerdes.DEFAULT);
                form.op = ["invokeaction"];
                thing.actions[actionName].forms.push(form);
                console.debug("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " assigns '" + href + "' to Action '" + actionName + "'");
            }
            _this.broker.on("message", function (receivedTopic, rawPayload, packet) {
                var segments = receivedTopic.split("/");
                var payload;
                if (rawPayload instanceof Buffer) {
                    payload = rawPayload;
                }
                else if (typeof rawPayload === "string") {
                    payload = Buffer.from(rawPayload);
                }
                if (segments.length === 4) {
                    console.debug("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " received message for '" + receivedTopic + "'");
                    var thing_1 = _this.things.get(segments[1]);
                    if (thing_1) {
                        if (segments[2] === "actions") {
                            var action = thing_1.actions[segments[3]];
                            var value = void 0;
                            if (action) {
                                if ('properties' in packet && 'contentType' in packet.properties) {
                                    try {
                                        value = core_1.ContentSerdes.get().contentToValue({ type: packet.properties.contentType, body: payload }, action.input);
                                    }
                                    catch (err) {
                                        console.warn("MqttBrokerServer at " + _this.brokerURI + " cannot process received message for '" + segments[3] + "': " + err.message);
                                    }
                                }
                                else {
                                    try {
                                        value = JSON.parse(payload.toString());
                                    }
                                    catch (err) {
                                        console.warn("MqttBrokerServer at " + _this.brokerURI + ", packet has no Content Type and does not parse as JSON, relaying raw (string) payload.");
                                        value = payload.toString();
                                    }
                                }
                            }
                            thing_1.invokeAction(segments[3], value)
                                .then(function (output) {
                                if (output) {
                                    console.warn("MqttBrokerServer at " + _this.brokerURI + " cannot return output '" + segments[3] + "'");
                                }
                            })
                                .catch(function (err) {
                                console.error("MqttBrokerServer at " + _this.brokerURI + " got error on invoking '" + segments[3] + "': " + err.message);
                            });
                            return;
                        }
                    }
                }
                else if (segments.length === 5 && segments[4] === "writeproperty") {
                    var thing_2 = _this.things.get(segments[1]);
                    if (thing_2) {
                        if (segments[2] === "properties") {
                            var property = thing_2.properties[segments[3]];
                            if (property) {
                                if (!property.readOnly) {
                                    thing_2.writeProperty(segments[3], JSON.parse(payload.toString()))
                                        .catch(function (err) {
                                        console.error("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " got error on writing to property '" + segments[3] + "': " + err.message);
                                    });
                                    return;
                                }
                                else {
                                    console.warn("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " received message for readOnly property at '" + receivedTopic + "'");
                                    return;
                                }
                            }
                        }
                    }
                    return;
                }
                console.warn("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " received message for invalid topic '" + receivedTopic + "'");
            });
            var _loop_2 = function (eventName) {
                var topic = "/" + encodeURIComponent(name) + "/events/" + encodeURIComponent(eventName);
                var event_1 = thing.events[eventName];
                thing.subscribeEvent(eventName, function (data) {
                    var content;
                    try {
                        content = core_1.ContentSerdes.get().valueToContent(data, event_1.data);
                    }
                    catch (err) {
                        console.warn("[binding-mqtt]", "HttpServer on port " + _this.getPort() + " cannot process data for Event '" + eventName + ": " + err.message + "'");
                        thing.unsubscribeEvent(eventName);
                        return;
                    }
                    console.debug("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " publishing to Event topic '" + eventName + "' ");
                    _this.broker.publish(topic, content.body);
                });
                var href = _this.brokerURI + topic;
                var form = new TD.Form(href, core_1.ContentSerdes.DEFAULT);
                form.op = ["subscribeevent", "unsubscribeevent"];
                event_1.forms.push(form);
                console.debug("[binding-mqtt]", "MqttBrokerServer at " + _this.brokerURI + " assigns '" + href + "' to Event '" + eventName + "'");
            };
            for (var eventName in thing.events) {
                _loop_2(eventName);
            }
            _this.broker.publish("/" + name, JSON.stringify(thing.getThingDescription()), { retain: true, contentType: "application/td+json" });
            resolve();
        });
    };
    MqttBrokerServer.prototype.start = function (servient) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.brokerURI === undefined) {
                console.warn("[binding-mqtt]", "No broker defined for MQTT server binding - skipping");
                resolve();
            }
            else {
                if (_this.psw === undefined) {
                    console.debug("[binding-mqtt]", "MqttBrokerServer trying to connect to broker at " + _this.brokerURI);
                    _this.broker = mqtt.connect(_this.brokerURI);
                }
                else if (_this.clientId === undefined) {
                    console.debug("[binding-mqtt]", "MqttBrokerServer trying to connect to secured broker at " + _this.brokerURI);
                    _this.broker = mqtt.connect(_this.brokerURI, { username: _this.user, password: _this.psw });
                }
                else if (_this.protocolVersion === undefined) {
                    console.debug("[binding-mqtt]", "MqttBrokerServer trying to connect to secured broker at " + _this.brokerURI + " with client ID " + _this.clientId);
                    _this.broker = mqtt.connect(_this.brokerURI, { username: _this.user, password: _this.psw, clientId: _this.clientId });
                }
                else {
                    console.debug("[binding-mqtt]", "MqttBrokerServer trying to connect to secured broker at " + _this.brokerURI + " with client ID " + _this.clientId);
                    _this.broker = mqtt.connect(_this.brokerURI, { username: _this.user, password: _this.psw, clientId: _this.clientId, protocolVersion: _this.protocolVersion });
                }
                _this.broker.on("connect", function () {
                    console.info("[binding-mqtt]", "MqttBrokerServer connected to broker at " + _this.brokerURI);
                    var parsed = url.parse(_this.brokerURI);
                    _this.address = parsed.hostname;
                    var port = parseInt(parsed.port);
                    _this.port = port > 0 ? port : 1883;
                    resolve();
                });
                _this.broker.on("error", function (error) {
                    console.error("[binding-mqtt]", "MqttBrokerServer could not connect to broker at " + _this.brokerURI);
                    reject(error);
                });
            }
        });
    };
    MqttBrokerServer.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.broker === undefined)
                resolve();
            _this.broker.stop();
        });
    };
    MqttBrokerServer.prototype.getPort = function () {
        return this.port;
    };
    MqttBrokerServer.prototype.getAddress = function () {
        return this.address;
    };
    return MqttBrokerServer;
}());
exports.default = MqttBrokerServer;
//# sourceMappingURL=mqtt-broker-server.js.map
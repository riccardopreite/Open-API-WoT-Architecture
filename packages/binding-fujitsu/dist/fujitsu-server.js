"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
var WebSocket = require("ws");
var TD = require("@node-wot/td-tools");
var core_1 = require("@node-wot/core");
var FujitsuServer = (function () {
    function FujitsuServer(remoteURI) {
        this.scheme = "ws";
        this.things = new Map();
        var parsed = url.parse(remoteURI);
        if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") {
            throw new Error("FujitsuServer requires WebSocket URI ('ws' or 'wss')");
        }
        if (parsed.host === "") {
            throw new Error("FujitsuServer requires WebSocket URI (no host given)");
        }
        this.remote = remoteURI;
    }
    FujitsuServer.prototype.start = function (servient) {
        var _this = this;
        console.info("[binding-fujitsu]", "FujitsuServer starting for " + this.remote);
        return new Promise(function (resolve, reject) {
            _this.websocket = new WebSocket(_this.remote);
            _this.websocket.once("error", function (err) { reject(err); });
            _this.websocket.once("open", function () {
                console.debug("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " connected");
                _this.websocket.ping();
                _this.websocket.on("error", function (err) {
                    console.error("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " failed: " + err.message);
                });
                resolve();
            });
            _this.websocket.on("message", function (data) {
                _this.handle(data);
            });
        });
    };
    FujitsuServer.prototype.stop = function () {
        var _this = this;
        console.info("[binding-fujitsu]", "WebSocketServer stopping for " + this.remote);
        return new Promise(function (resolve, reject) {
            _this.websocket.once("error", function (err) { reject(err); });
            _this.websocket.once("close", function () { resolve(); });
            for (var id in _this.things) {
                _this.websocket.send(JSON.stringify({
                    version: "rev07June2018",
                    type: "UNREGISTER",
                    hardwareID: id
                }));
                _this.things.delete(id);
            }
            _this.websocket.close();
        });
    };
    FujitsuServer.prototype.getPort = function () {
        return -1;
    };
    FujitsuServer.prototype.expose = function (thing) {
        var _this = this;
        console.debug("[binding-fujitsu]", "FujitsuServer for " + this.remote + " exposes '" + thing.title + "'");
        this.things.set(thing.id, thing);
        var thingCopy = JSON.parse(JSON.stringify(thing));
        for (var propertyName in thingCopy.properties) {
            thingCopy.properties[propertyName].forms = [new TD.Form(propertyName, core_1.ContentSerdes.DEFAULT)];
            console.debug("[binding-fujitsu]", "FujitsuServer for " + this.remote + " assigns '" + propertyName + "' to Property '" + propertyName + "'");
        }
        for (var actionName in thingCopy.actions) {
            thingCopy.actions[actionName].forms = [new TD.Form(actionName, core_1.ContentSerdes.DEFAULT)];
            console.debug("[binding-fujitsu]", "FujitsuServer for " + this.remote + " assigns '" + actionName + "' to Action '" + actionName + "'");
        }
        for (var eventName in thingCopy.events) {
            thingCopy.events[eventName].forms = [new TD.Form(eventName, core_1.ContentSerdes.DEFAULT)];
            console.debug("[binding-fujitsu]", "FujitsuServer for " + this.remote + " assigns '" + eventName + "' to Action '" + eventName + "'");
        }
        return new Promise(function (resolve, reject) {
            var message = JSON.stringify({
                version: "rev07June2018",
                type: "REGISTER",
                hardwareID: encodeURIComponent(thing.id),
                thingDescription: TD.serializeTD(thingCopy)
            });
            _this.websocket.send(message, function (err) {
                if (err) {
                    console.error("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " failed to register '" + thing.title + "' as '" + thing.id + "': " + err.message);
                    reject(err);
                }
                else {
                    console.debug("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " registered '" + thing.title + "' as '" + thing.id + "'");
                    resolve();
                }
            });
        });
    };
    FujitsuServer.prototype.handle = function (data) {
        var _this = this;
        console.debug("[binding-fujitsu]", "FujitsuServer for " + this.remote + " received '" + data + "'");
        var message = JSON.parse(data);
        if (message.type === "REQUEST") {
            var thing_1 = this.things.get(decodeURIComponent(message.deviceID));
            if (thing_1) {
                if (message.method === "GET") {
                    var property_1 = thing_1.properties[message.href];
                    if (property_1) {
                        thing_1.readProperty(message.href)
                            .then(function (value) {
                            var content = core_1.ContentSerdes.get().valueToContent(value, property_1);
                            _this.reply(message.requestID, message.deviceID, content);
                        })
                            .catch(function (err) { console.error("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " cannot read '" + message.href + "' of Thing '" + thing_1.id + "': " + err.message); });
                    }
                }
                else if (message.method === "PUT") {
                    var property = thing_1.properties[message.href];
                    if (property) {
                        var value = void 0;
                        try {
                            value = core_1.ContentSerdes.get().contentToValue({ type: message.mediaType, body: Buffer.from(message.entity, "base64") }, property);
                        }
                        catch (err) {
                            console.warn("[binding-fujitsu]", "FujitsuServer for " + this.remote + " received invalid data for Property '" + message.href + "'");
                            return;
                        }
                        property.write(value)
                            .then(function () {
                            _this.reply(message.requestID, message.deviceID);
                        })
                            .catch(function (err) { console.error("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " cannot write '" + message.href + "' of Thing '" + thing_1.id + "': " + err.message); });
                    }
                }
                else if (message.method === "POST") {
                    var action_1 = thing_1.actions[message.href];
                    if (action_1) {
                        var input = void 0;
                        try {
                            input = core_1.ContentSerdes.get().contentToValue({ type: message.mediaType, body: Buffer.from(message.entity, "base64") }, action_1.input);
                        }
                        catch (err) {
                            console.warn("[binding-fujitsu]", "FujitsuServer for " + this.remote + " received invalid data for Action '" + message.href + "'");
                            return;
                        }
                        thing_1.invokeAction(message.href)
                            .then(function (output) {
                            var content;
                            if (output) {
                                content = core_1.ContentSerdes.get().valueToContent(output, action_1.output);
                            }
                            _this.reply(message.requestID, message.deviceID, content);
                        })
                            .catch(function (err) { console.error("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " cannot invoke '" + message.href + "' of Thing '" + thing_1.id + "': " + err.message); });
                    }
                }
                else {
                    console.warn("[binding-fujitsu]", "FujitsuServer for " + this.remote + " received invalid method '" + message.method + "'");
                    this.replyClientError(message.requestID, message.deviceID, "Method Not Allowed");
                    return;
                }
            }
            else {
                console.warn("[binding-fujitsu]", "FujitsuServer for " + this.remote + " received invalid Thing ID '" + decodeURIComponent(message.deviceID) + "'");
                this.replyClientError(message.requestID, message.deviceID, "Not Found");
                return;
            }
        }
        else {
            console.warn("[binding-fujitsu]", "FujitsuServer for " + this.remote + " received invalid message type '" + message.type + "'");
        }
    };
    FujitsuServer.prototype.reply = function (requestID, thingID, content) {
        var _this = this;
        var response = {
            type: "RESPONSE",
            requestID: requestID,
            deviceID: thingID
        };
        if (content) {
            response.mediaType = content.type;
            response.buffer = content.body.toString("base64");
        }
        else {
            response.buffer = "";
        }
        this.websocket.send(JSON.stringify(response), function (err) {
            if (err) {
                console.error("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " failed to reply to '" + requestID + "' for '" + thingID + "': " + err.message);
            }
            else {
                console.debug("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " replied to '" + requestID + "' " + (content ? "with payload" : ""));
            }
        });
    };
    FujitsuServer.prototype.replyClientError = function (requestID, thingID, diagnosticMessage) {
        this.replyError(false, requestID, thingID, diagnosticMessage);
    };
    FujitsuServer.prototype.replyServerError = function (requestID, thingID, diagnosticMessage) {
        this.replyError(true, requestID, thingID, diagnosticMessage);
    };
    FujitsuServer.prototype.replyError = function (server, requestID, thingID, diagnosticMessage) {
        var _this = this;
        var response = {
            type: "RESPONSE",
            requestID: requestID,
            deviceID: thingID
        };
        if (diagnosticMessage) {
            response.buffer = Buffer.from(diagnosticMessage).toString("base64");
        }
        this.websocket.send(JSON.stringify(response), function (err) {
            if (err) {
                console.error("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " failed to error '" + requestID + "' for '" + thingID + "': " + err.message);
            }
            else {
                console.debug("[binding-fujitsu]", "FujitsuServer for " + _this.remote + " errored '" + requestID + "' " + (diagnosticMessage ? "with message" : ""));
            }
        });
    };
    return FujitsuServer;
}());
exports.default = FujitsuServer;
//# sourceMappingURL=fujitsu-server.js.map
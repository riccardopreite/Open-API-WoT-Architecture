"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@node-wot/core");
var mqtt = require("mqtt");
var url = require("url");
var Subscription_1 = require("rxjs/Subscription");
var MqttClient = (function () {
    function MqttClient(config, secure) {
        var _this = this;
        if (config === void 0) { config = null; }
        if (secure === void 0) { secure = false; }
        this.user = undefined;
        this.psw = undefined;
        this.client = undefined;
        this.readResource = function (form) {
            return new Promise(function (resolve, reject) {
                throw new Error('Method not implemented.');
            });
        };
        this.writeResource = function (form, content) {
            return new Promise(function (resolve, reject) {
                throw new Error('Method not implemented.');
            });
        };
        this.invokeResource = function (form, content) {
            return new Promise(function (resolve, reject) {
                var requestUri = url.parse(form['href']);
                var topic = requestUri.pathname;
                var brokerUri = "mqtt://" + requestUri.host;
                if (_this.client == undefined) {
                    _this.client = mqtt.connect(brokerUri);
                }
                if (content == undefined) {
                    _this.client.publish(topic, JSON.stringify(Buffer.from("")));
                }
                else {
                    _this.client.publish(topic, content.body);
                }
                resolve({ type: core_1.ContentSerdes.DEFAULT, body: Buffer.from("") });
            });
        };
        this.unlinkResource = function (form) {
            var requestUri = url.parse(form['href']);
            var topic = requestUri.pathname;
            return new Promise(function (resolve, reject) {
                if (_this.client && _this.client.connected) {
                    _this.client.unsubscribe(topic);
                    console.debug("[binding-mqtt]", "MqttClient unsubscribed from topic '" + topic + "'");
                }
                resolve();
            });
        };
        this.start = function () {
            return true;
        };
        this.stop = function () {
            if (_this.client)
                _this.client.end();
            return true;
        };
        this.mapQoS = function (qos) {
            switch (qos) {
                case 2:
                    return qos = 2;
                case 1:
                    return qos = 1;
                case 0:
                default:
                    return qos = 0;
            }
        };
        this.logError = function (message) {
            console.error("[binding-mqtt]", "[MqttClient]" + message);
        };
    }
    MqttClient.prototype.subscribeResource = function (form, next, error, complete) {
        var _this = this;
        var contentType = form.contentType;
        var retain = form["mqtt:retain"];
        var qos = form["mqtt:qos"];
        var requestUri = url.parse(form['href']);
        var topic = requestUri.pathname;
        var brokerUri = "mqtt://" + requestUri.host;
        if (this.client == undefined) {
            this.client = mqtt.connect(brokerUri);
        }
        this.client.on('connect', function () { return _this.client.subscribe(topic); });
        this.client.on('message', function (receivedTopic, payload, packet) {
            console.debug("[binding-mqtt]", "Received MQTT message (topic, data): (" + receivedTopic + ", " + payload + ")");
            if (receivedTopic === topic) {
                next({ contentType: contentType, body: Buffer.from(payload) });
            }
        });
        this.client.on('error', function (error) {
            if (_this.client) {
                _this.client.end();
            }
            _this.client == undefined;
            error(error);
        });
        return new Subscription_1.Subscription(function () { _this.client.unsubscribe(topic); });
    };
    MqttClient.prototype.setSecurity = function (metadata, credentials) {
        if (metadata === undefined || !Array.isArray(metadata) || metadata.length == 0) {
            console.warn("[binding-mqtt]", "MqttClient received empty security metadata");
            return false;
        }
        var security = metadata[0];
        if (security.scheme === "basic") {
        }
        return true;
    };
    return MqttClient;
}());
exports.default = MqttClient;
//# sourceMappingURL=mqtt-client.js.map
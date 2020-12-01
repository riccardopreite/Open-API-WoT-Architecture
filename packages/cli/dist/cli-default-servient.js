"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@node-wot/core");
var binding_http_1 = require("@node-wot/binding-http");
var binding_websockets_1 = require("@node-wot/binding-websockets");
var binding_coap_1 = require("@node-wot/binding-coap");
var binding_mqtt_1 = require("@node-wot/binding-mqtt");
var binding_file_1 = require("@node-wot/binding-file");
var binding_http_2 = require("@node-wot/binding-http");
var binding_http_3 = require("@node-wot/binding-http");
var binding_coap_2 = require("@node-wot/binding-coap");
var binding_coap_3 = require("@node-wot/binding-coap");
var binding_mqtt_2 = require("@node-wot/binding-mqtt");
var DefaultServient = (function (_super) {
    __extends(DefaultServient, _super);
    function DefaultServient(clientOnly, config) {
        var _this = _super.call(this) || this;
        _this.loggers = {
            "warn": console.warn,
            "info": console.info,
            "debug": console.debug
        };
        _this.config = (typeof config === "object") ?
            mergeConfigs(DefaultServient.defaultConfig, config) :
            DefaultServient.defaultConfig;
        if (clientOnly) {
            if (!_this.config.servient) {
                _this.config.servient = {};
            }
            _this.config.servient.clientOnly = true;
        }
        _this.setLogLevel(_this.config.log.level);
        _this.addCredentials(_this.config.credentials);
        if (_this.config.credentials)
            delete _this.config.credentials;
        console.debug("[cli/default-servient]", "DefaultServient configured with");
        console.dir(_this.config);
        if (typeof _this.config.servient.staticAddress === "string") {
            core_1.Helpers.setStaticAddress(_this.config.servient.staticAddress);
        }
        if (!_this.config.servient.clientOnly) {
            if (_this.config.http !== undefined) {
                var httpServer = new binding_http_1.HttpServer(_this.config.http);
                _this.addServer(httpServer);
                _this.addServer(new binding_websockets_1.WebSocketServer(httpServer));
            }
            if (_this.config.coap !== undefined) {
                var coapServer = (typeof _this.config.coap.port === "number") ? new binding_coap_1.CoapServer(_this.config.coap.port) : new binding_coap_1.CoapServer();
                _this.addServer(coapServer);
            }
            if (_this.config.mqtt !== undefined) {
                var mqttBrokerServer = new binding_mqtt_1.MqttBrokerServer(_this.config.mqtt.broker, (typeof _this.config.mqtt.username === "string") ? _this.config.mqtt.username : undefined, (typeof _this.config.mqtt.password === "string") ? _this.config.mqtt.password : undefined, (typeof _this.config.mqtt.clientId === "string") ? _this.config.mqtt.clientId : undefined, (typeof _this.config.mqtt.protocolVersion === "number") ? _this.config.mqtt.protocolVersion : undefined);
                _this.addServer(mqttBrokerServer);
            }
        }
        _this.addClientFactory(new binding_file_1.FileClientFactory());
        _this.addClientFactory(new binding_http_2.HttpClientFactory(_this.config.http));
        _this.addClientFactory(new binding_http_3.HttpsClientFactory(_this.config.http));
        _this.addClientFactory(new binding_coap_2.CoapClientFactory(coapServer));
        _this.addClientFactory(new binding_coap_3.CoapsClientFactory());
        _this.addClientFactory(new binding_mqtt_2.MqttClientFactory());
        return _this;
    }
    DefaultServient.prototype.start = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _super.prototype.start.call(_this).then(function (myWoT) {
                console.info("[cli/default-servient]", "DefaultServient started");
                myWoT.produce({
                    "title": "servient",
                    "description": "node-wot CLI Servient",
                    properties: {
                        things: {
                            type: "object",
                            description: "Get things",
                            observable: false,
                            readOnly: true
                        }
                    },
                    actions: {
                        setLogLevel: {
                            description: "Set log level",
                            input: { oneOf: [{ type: "string" }, { type: "number" }] },
                            output: { type: "string" }
                        },
                        shutdown: {
                            description: "Stop servient",
                            output: { type: "string" }
                        },
                        runScript: {
                            description: "Run script",
                            input: { type: "string" },
                            output: { type: "string" }
                        }
                    }
                })
                    .then(function (thing) {
                    thing.setActionHandler("setLogLevel", function (level) {
                        return new Promise(function (resolve, reject) {
                            _this.setLogLevel(level);
                            resolve("Log level set to '" + _this.logLevel + "'");
                        });
                    });
                    thing.setActionHandler("shutdown", function () {
                        return new Promise(function (resolve, reject) {
                            console.debug("[cli/default-servient]", "shutting down by remote");
                            _this.shutdown();
                            resolve();
                        });
                    });
                    thing.setActionHandler("runScript", function (script) {
                        return new Promise(function (resolve, reject) {
                            console.debug("[cli/default-servient]", "running script", script);
                            _this.runScript(script);
                            resolve();
                        });
                    });
                    thing.setPropertyReadHandler("things", function () {
                        return new Promise(function (resolve, reject) {
                            console.debug("[cli/default-servient]", "returnings things");
                            resolve(_this.getThings());
                        });
                    });
                    thing.expose().then(function () {
                        resolve(myWoT);
                    }).catch(function (err) { return reject(err); });
                });
            }).catch(function (err) { return reject(err); });
        });
    };
    DefaultServient.prototype.setLogLevel = function (logLevel) {
        if (logLevel == "error" || logLevel == 0) {
            console.warn = function () { };
            console.info = function () { };
            console.debug = function () { };
            this.logLevel = "error";
        }
        else if (logLevel == "warn" || logLevel == "warning" || logLevel == 1) {
            console.warn = this.loggers.warn;
            console.info = function () { };
            console.debug = function () { };
            this.logLevel = "warn";
        }
        else if (logLevel == "info" || logLevel == 2) {
            console.warn = this.loggers.warn;
            console.info = this.loggers.info;
            console.debug = function () { };
            this.logLevel = "info";
        }
        else if (logLevel == "debug" || logLevel == 3) {
            console.warn = this.loggers.warn;
            console.info = this.loggers.info;
            console.debug = this.loggers.debug;
            this.logLevel = "debug";
        }
        else {
            console.warn = this.loggers.warn;
            console.info = this.loggers.info;
            console.debug = function () { };
            this.logLevel = "info";
        }
    };
    DefaultServient.defaultConfig = {
        servient: {
            clientOnly: false,
            scriptAction: false
        },
        http: {
            port: 8080,
            selfSigned: false
        },
        coap: {
            port: 5683
        },
        log: {
            level: "info"
        }
    };
    return DefaultServient;
}(core_1.Servient));
exports.default = DefaultServient;
function mergeConfigs(target, source) {
    var output = Object.assign({}, target);
    Object.keys(source).forEach(function (key) {
        var _a, _b;
        if (!(key in target)) {
            Object.assign(output, (_a = {}, _a[key] = source[key], _a));
        }
        else {
            if (isObject(target[key]) && isObject(source[key])) {
                output[key] = mergeConfigs(target[key], source[key]);
            }
            else {
                Object.assign(output, (_b = {}, _b[key] = source[key], _b));
            }
        }
    });
    return output;
}
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
//# sourceMappingURL=cli-default-servient.js.map
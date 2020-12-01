"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dcl = require("iotcs-csl-js");
var OracleServer = (function () {
    function OracleServer(store, password) {
        if (store === void 0) { store = "W3CWOT-GATEWAY"; }
        if (password === void 0) { password = "Eclipse1"; }
        this.scheme = "oracle";
        this.server = undefined;
        this.running = false;
        this.failed = false;
        this.devices = {};
        this.activationId = store;
        this.server = new dcl.device.GatewayDevice(store, password);
    }
    OracleServer.prototype.expose = function (thing) {
        var _this = this;
        if (thing["iotcs:deviceModel"] === undefined) {
            return new Promise(function (resolve, reject) {
                reject("OracleServer cannot expose Things without 'iotcs:deviceModel' field");
            });
        }
        return new Promise(function (resolve, reject) {
            if (_this.server.isActivated()) {
                _this.getModel(thing["iotcs:deviceModel"]).then(function (model) {
                    _this.registerDevice(thing, model).then(function (id) {
                        _this.startDevice(id, model, thing).then(function () {
                            resolve();
                        });
                    });
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    OracleServer.prototype.start = function (servient) {
        var _this = this;
        console.info("[binding-oracle]", "OracleServer starting with " + this.activationId);
        return new Promise(function (resolve, reject) {
            if (!_this.server.isActivated()) {
                _this.server.activate([], function (device, error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        _this.server = device;
                        console.dir(device);
                        if (_this.server.isActivated()) {
                            console.debug("[binding-oracle]", "OracleServer " + _this.activationId + " activated");
                            resolve();
                        }
                        else {
                            reject(new Error("Could not activate"));
                        }
                    }
                });
            }
            else {
                console.debug("[binding-oracle]", "OracleServer " + _this.activationId + " already activated");
                resolve();
            }
        });
    };
    OracleServer.prototype.stop = function () {
        var _this = this;
        console.info("[binding-oracle]", "OracleServer " + this.activationId + " stopping");
        return new Promise(function (resolve, reject) {
            try {
                _this.server.close();
                resolve();
            }
            catch (err) {
                reject(new Error("Could not stop"));
            }
        });
    };
    OracleServer.prototype.getPort = function () {
        return -1;
    };
    OracleServer.prototype.getModel = function (modelUrn) {
        var _this = this;
        console.debug("[binding-oracle]", "OracleServer " + this.activationId + " getting model '" + modelUrn + "'");
        return new Promise(function (resolve, reject) {
            if (!_this.server.isActivated()) {
                reject(new Error("OracleServer " + _this.activationId + " not activated"));
            }
            else {
                _this.server.getDeviceModel(modelUrn, function (model, error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        console.debug("[binding-oracle]", "OracleServer " + _this.activationId + " found Device Model", modelUrn);
                        console.dir(model);
                        resolve(model);
                    }
                });
            }
        });
    };
    OracleServer.prototype.registerDevice = function (thing, model) {
        var _this = this;
        console.debug("[binding-oracle]", "OracleServer " + this.activationId + " enrolling '" + thing.id + "'");
        return new Promise(function (resolve, reject) {
            if (!_this.server.isActivated()) {
                reject(new Error("OracleServer not activated"));
            }
            else {
                _this.server.registerDevice(thing.id, {
                    description: "node-wot connected device",
                    manufacturer: "Eclipse Thingweb"
                }, [model.urn], function (id, error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        console.debug("[binding-oracle]", "OracleServer " + _this.activationId + " registered '" + id + "'");
                        resolve(id);
                    }
                });
            }
        });
    };
    OracleServer.prototype.startDevice = function (id, model, thing) {
        var _this = this;
        var device = this.server.createVirtualDevice(id, model);
        thing.deviceID = id;
        this.devices[id] = device;
        return new Promise(function (resolve, reject) {
            var updateInterval;
            if (thing["iotcs:updateInterval"] && (typeof thing["iotcs:updateInterval"] === "number")) {
                updateInterval = thing["iotcs:updateInterval"];
            }
            else {
                console.debug("[binding-oracle]", "### Oracle uses default Property update interval of 5000 ms");
                console.warn("[binding-oracle]", "### TD can provide \"iotcs:updateInterval\" to configure interval (in ms)");
                updateInterval = 5000;
            }
            setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var attributes, _a, _b, _i, propertyName, _c, _d, err_1;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 5, , 6]);
                            attributes = {};
                            _a = [];
                            for (_b in thing.properties)
                                _a.push(_b);
                            _i = 0;
                            _e.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3, 4];
                            propertyName = _a[_i];
                            _c = attributes;
                            _d = propertyName;
                            return [4, thing.properties[propertyName].read()];
                        case 2:
                            _c[_d] = _e.sent();
                            _e.label = 3;
                        case 3:
                            _i++;
                            return [3, 1];
                        case 4:
                            console.debug("[binding-oracle]", "### Oracle PROPERTY UPDATE for", thing.deviceID);
                            console.dir(attributes);
                            device.update(attributes);
                            return [3, 6];
                        case 5:
                            err_1 = _e.sent();
                            console.error("[binding-oracle]", "OracleServer read() error: " + err_1);
                            return [3, 6];
                        case 6: return [2];
                    }
                });
            }); }, updateInterval);
            device.onChange = function (tupples) {
                tupples.forEach(function (tupple) {
                    if (thing.properties[tupple.attribute.id] !== undefined) {
                        console.debug("[binding-oracle]", "### Thing '" + thing.title + "' has Property '" + tupple.attribute.id + "' for writing '" + tupple.newValue + "'");
                        if (!thing.properties[tupple.attribute.id].readOnly) {
                            thing.properties[tupple.attribute.id]
                                .write(tupple.newValue)
                                .catch(function (err) { console.error("[binding-oracle]", "Property write error: " + err); });
                        }
                    }
                });
            };
            var _loop_1 = function (action) {
                if (thing.actions[action.name] !== undefined) {
                    console.debug("[binding-oracle]", "### Thing '" + thing.title + "' has Action '" + action.name + "'");
                    device[action.name].onExecute = function (param) {
                        console.debug("[binding-oracle]", "### Oracle called Action '" + action.name + "'");
                        thing.actions[action.name]
                            .invoke(param)
                            .catch(function (err) { console.error("[binding-oracle]", "Action invoke error: " + err); });
                    };
                }
                else {
                    console.warn("[binding-oracle]", "### Oracle Device Model Action '" + action.name + "' not available on Thing '" + thing.title + "'");
                }
            };
            for (var _i = 0, _a = model.actions; _i < _a.length; _i++) {
                var action = _a[_i];
                _loop_1(action);
            }
            device.onError = function (tupple) {
                var show = {
                    newValues: tupple.newValues,
                    tryValues: tupple.tryValues,
                    errorResponse: tupple.errorResponse
                };
                console.error("[binding-oracle]", "### Oracle ERROR");
                console.dir(show);
            };
            resolve();
        });
    };
    return OracleServer;
}());
exports.default = OracleServer;
//# sourceMappingURL=oracle-server.js.map
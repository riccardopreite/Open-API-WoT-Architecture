"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var AsyncNodeNetcon = require("./async-node-netconf");
var Url = require("url-parse");
var DEFAULT_TARGET = 'candidate';
var NetconfClient = (function () {
    function NetconfClient() {
        this.client = new AsyncNodeNetcon.Client();
        this.credentials = null;
    }
    NetconfClient.prototype.toString = function () {
        return "[NetconfClient]";
    };
    NetconfClient.prototype.readResource = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var url, ip_address, port, xpath_query, method, NSs, target, contentType, err_1, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = new Url(form.href);
                        ip_address = url.hostname;
                        port = parseInt(url.port);
                        xpath_query = url.pathname;
                        method = form["nc:method"] ? form["nc:method"] : "GET-CONFIG";
                        NSs = form["nc:NSs"] || {};
                        target = form["nc:target"] || DEFAULT_TARGET;
                        contentType = 'application/yang-data+xml';
                        if (!(this.client.getRouter() === null)) return [3, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.client.initializeRouter(ip_address, port, this.credentials)];
                    case 2:
                        _a.sent();
                        return [4, this.client.openRouter()];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        err_1 = _a.sent();
                        this.client.deleteRouter();
                        throw err_1;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4, this.client.rpc(xpath_query, method, NSs, target)];
                    case 6:
                        result = _a.sent();
                        result = JSON.stringify(result);
                        return [3, 8];
                    case 7:
                        err_2 = _a.sent();
                        throw err_2;
                    case 8: return [2, new Promise(function (resolve, reject) {
                            resolve({ type: contentType, body: Buffer.from(result) });
                        })];
                }
            });
        });
    };
    NetconfClient.prototype.writeResource = function (form, content) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, url, ip_address, port, xpath_query, method, NSs, target, contentType, err_3, result, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = content ? JSON.parse((content.body).toString()) : {};
                        url = new Url(form.href);
                        ip_address = url.hostname;
                        port = parseInt(url.port);
                        xpath_query = url.pathname;
                        method = form["nc:method"] ? form["nc:method"] : "EDIT-CONFIG";
                        NSs = form["nc:NSs"] || {};
                        target = form["nc:target"] || DEFAULT_TARGET;
                        contentType = 'application/yang-data+xml';
                        if (!(this.client.getRouter() === null)) return [3, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.client.initializeRouter(ip_address, port, this.credentials)];
                    case 2:
                        _a.sent();
                        return [4, this.client.openRouter()];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        err_3 = _a.sent();
                        this.client.deleteRouter();
                        throw err_3;
                    case 5:
                        NSs = __assign(__assign({}, NSs), payload.NSs);
                        payload = payload.payload;
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4, this.client.rpc(xpath_query, method, NSs, target, payload)];
                    case 7:
                        result = _a.sent();
                        result = JSON.stringify(result);
                        return [3, 9];
                    case 8:
                        err_4 = _a.sent();
                        throw err_4;
                    case 9: return [2, new Promise(function (resolve, reject) {
                            resolve();
                        })];
                }
            });
        });
    };
    NetconfClient.prototype.invokeResource = function (form, content) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, url, ip_address, port, xpath_query, method, NSs, target, result, err_5, err_6, contentType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = content ? JSON.parse((content.body).toString()) : {};
                        url = new Url(form.href);
                        ip_address = url.hostname;
                        port = parseInt(url.port);
                        xpath_query = url.pathname;
                        method = form["nc:method"] ? form["nc:method"] : "RPC";
                        NSs = form["nc:NSs"] || {};
                        target = form["nc:target"] || DEFAULT_TARGET;
                        if (!(this.client.getRouter() === null)) return [3, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4, this.client.initializeRouter(ip_address, port, this.credentials)];
                    case 2:
                        _a.sent();
                        return [4, this.client.openRouter()];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4:
                        err_5 = _a.sent();
                        this.client.deleteRouter();
                        throw err_5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        NSs = __assign(__assign({}, NSs), payload.NSs);
                        payload = payload.payload;
                        return [4, this.client.rpc(xpath_query, method, NSs, target, payload)];
                    case 6:
                        result = _a.sent();
                        result = JSON.stringify(result);
                        return [3, 8];
                    case 7:
                        err_6 = _a.sent();
                        console.debug("[binding-netconf]", err_6);
                        throw err_6;
                    case 8:
                        contentType = 'application/yang-data+xml';
                        return [2, new Promise(function (resolve, reject) {
                                resolve({ type: contentType, body: result });
                            })];
                }
            });
        });
    };
    NetconfClient.prototype.unlinkResource = function (form) {
        return new Promise(function (resolve, reject) {
            reject(new Error("NetconfClient does not implement unlink"));
        });
    };
    NetconfClient.prototype.subscribeResource = function (form, next, error, complete) {
        error(new Error("NetconfClient does not implement subscribe"));
        return null;
    };
    NetconfClient.prototype.start = function () {
        return true;
    };
    NetconfClient.prototype.stop = function () {
        return true;
    };
    NetconfClient.prototype.setSecurity = function (metadata, credentials) {
        if (metadata === undefined || !Array.isArray(metadata) || metadata.length == 0) {
            console.warn("[binding-netconf]", "NetconfClient without security");
            return false;
        }
        if (!credentials || (!(credentials.password) && !(credentials.privateKey))) {
            throw new Error("Both password and privateKey missing inside credentials");
        }
        this.credentials = credentials;
        return true;
    };
    return NetconfClient;
}());
exports.default = NetconfClient;
//# sourceMappingURL=netconf-client.js.map
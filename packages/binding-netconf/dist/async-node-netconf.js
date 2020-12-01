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
exports.Client = void 0;
var nodeNetconf = require("node-netconf");
var xpath2json = require("./xpath2json");
var fs_1 = require("fs");
var METHOD_OBJ = {};
METHOD_OBJ["GET-CONFIG"] = { 'get-config': { $: { xmlns: "urn:ietf:params:xml:ns:netconf:base:1.0" }, source: { candidate: {}, }, filter: { $: { type: "subtree" } } } };
METHOD_OBJ["EDIT-CONFIG"] = { 'edit-config': { $: { xmlns: "urn:ietf:params:xml:ns:netconf:base:1.0" }, target: { candidate: {}, }, config: {} } };
METHOD_OBJ["COMMIT"] = { 'commit': { $: { xmlns: "urn:ietf:params:xml:ns:netconf:base:1.0" } } };
METHOD_OBJ["RPC"] = {};
var Client = (function () {
    function Client() {
        this.router = null;
    }
    Client.prototype.getRouter = function () {
        return this.router;
    };
    Client.prototype.deleteRouter = function () {
        this.router = null;
    };
    Client.prototype.initializeRouter = function (host, port, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.router && this.router.connected) {
                            this.closeRouter();
                        }
                        this.router = {};
                        this.router.host = host;
                        this.router.port = port;
                        this.router.username = credentials.username;
                        if (!credentials.privateKey) return [3, 2];
                        _a = this.router;
                        return [4, fs_1.promises.readFile(credentials.privateKey, { encoding: 'utf8' })];
                    case 1:
                        _a.pkey = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (credentials.password) {
                            this.router.password = credentials.password;
                        }
                        return [2, new Promise(function (resolve, reject) {
                                resolve();
                            })];
                }
            });
        });
    };
    Client.prototype.openRouter = function () {
        var _this = this;
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.router.connected) {
                _this.closeRouter();
            }
            self.router = new nodeNetconf.Client(_this.router);
            self.router.open(function afterOpen(err) {
                if (err) {
                    reject(err);
                }
                else {
                    console.debug("[binding-netconf]", "New NetConf router opened connection with host " + self.router.host + ", port " + self.router.port + ", username " + self.router.username);
                    resolve();
                }
            });
        });
    };
    Client.prototype.rpc = function (xpath_query, method, NSs, target, payload) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (payload) {
                xpath_query = xpath2json.addLeaves(xpath_query, payload);
            }
            var obj_request = xpath2json.xpath2json(xpath_query, NSs);
            var final_request = {};
            final_request = JSON.parse(JSON.stringify(METHOD_OBJ[method]));
            switch (method) {
                default:
                case "GET-CONFIG": {
                    final_request["get-config"].filter = Object.assign(final_request["get-config"].filter, obj_request);
                    final_request["get-config"].source = {};
                    final_request["get-config"].source[target] = {};
                    break;
                }
                case "EDIT-CONFIG": {
                    final_request["edit-config"].config = Object.assign(final_request["edit-config"].config, obj_request);
                    final_request["edit-config"].target = {};
                    final_request["edit-config"].target[target] = {};
                    break;
                }
                case "COMMIT": {
                    break;
                }
                case "RPC": {
                    final_request = obj_request;
                    break;
                }
            }
            self.router.rpc(final_request, function (err, results) {
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
    };
    Client.prototype.closeRouter = function () {
        this.router.sshConn.end();
        this.router.connected = false;
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=async-node-netconf.js.map
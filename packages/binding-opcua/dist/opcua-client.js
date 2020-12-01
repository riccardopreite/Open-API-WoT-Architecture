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
var Url = require("url-parse");
var node_opcua_client_1 = require("node-opcua-client");
var node_opcua_status_code_1 = require("node-opcua-status-code");
var crypto_utils = require("node-opcua-crypto");
var Subscription_1 = require("rxjs/Subscription");
var OpcuaClient = (function () {
    function OpcuaClient(_config) {
        if (_config === void 0) { _config = null; }
        this.credentials = null;
        this.session = null;
        this.clientOptions = {
            applicationName: "Client",
            keepSessionAlive: true,
            securityMode: node_opcua_client_1.MessageSecurityMode.None,
            securityPolicy: node_opcua_client_1.SecurityPolicy.None,
            connectionStrategy: {
                initialDelay: 0,
                maxRetry: 1
            },
            requestedSessionTimeout: 10000,
            endpoint_must_exist: false
        };
        if (_config) {
            this.config = _config;
        }
    }
    OpcuaClient.prototype.toString = function () {
        return "[OpcuaClient]";
    };
    OpcuaClient.prototype.connect = function (endpointUrl, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userIdentity, clientCertificate, privateKey, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.credentials) {
                            if (this.credentials.password) {
                                userIdentity = {
                                    userName: this.credentials.username,
                                    password: this.credentials.password,
                                    type: node_opcua_client_1.UserTokenType.UserName,
                                };
                            }
                            else if (this.credentials.clientCertificate) {
                                clientCertificate = crypto_utils.readCertificate(this.credentials.clientCertificate);
                                privateKey = crypto_utils.readPrivateKeyPEM(this.credentials.clientPrivateKey);
                                this.clientOptions.securityMode = node_opcua_client_1.MessageSecurityMode.SignAndEncrypt;
                                this.clientOptions.securityPolicy = node_opcua_client_1.SecurityPolicy.Basic256Sha256,
                                    this.clientOptions.certificateFile = this.credentials.clientCertificate,
                                    this.clientOptions.privateKeyFile = this.credentials.clientPrivateKey,
                                    this.clientOptions.serverCertificate = crypto_utils.readCertificate(this.credentials.serverCertificate);
                                userIdentity = {
                                    certificateData: clientCertificate,
                                    privateKey: privateKey,
                                    type: node_opcua_client_1.UserTokenType.Certificate,
                                };
                            }
                        }
                        else {
                            userIdentity = null;
                        }
                        this.client = node_opcua_client_1.OPCUAClient.create(this.clientOptions);
                        return [4, this.client.connect(endpointUrl)];
                    case 1:
                        _b.sent();
                        _a = this;
                        return [4, this.client.createSession(userIdentity)];
                    case 2:
                        _a.session = _b.sent();
                        if (next) {
                            next();
                        }
                        return [2];
                }
            });
        });
    };
    OpcuaClient.prototype.readResource = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var url, endpointUrl, method, contentType, err_1, result, params, nodeId, nodeToRead, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = new Url(form.href);
                        endpointUrl = url.origin;
                        method = form["opc:method"] ? form["opc:method"] : "READ";
                        contentType = "application/x.opcua-binary";
                        if (!(this.session === null)) return [3, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.connect(endpointUrl)];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.debug("[binding-opcua]", err_1);
                        throw err_1;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        params = this.extract_params(url.pathname.toString().substr(1));
                        nodeId = params.ns + ';' + params.idtype;
                        nodeToRead = {
                            nodeId: nodeId
                        };
                        return [4, this.session.read(nodeToRead)];
                    case 5:
                        result = _a.sent();
                        result = JSON.stringify(result);
                        return [3, 7];
                    case 6:
                        err_2 = _a.sent();
                        console.debug("[binding-opcua]", err_2);
                        throw err_2;
                    case 7: return [2, new Promise(function (resolve, reject) {
                            resolve({ type: contentType, body: Buffer.from(result) });
                        })];
                }
            });
        });
    };
    OpcuaClient.prototype.writeResource = function (form, content) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, url, endpointUrl, method, contentType, res, dataType, err_3, result, params, nodeId, nodeToWrite, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = content ? JSON.parse((content.body).toString()) : {};
                        url = new Url(form.href);
                        endpointUrl = url.origin;
                        method = form["opc:method"] ? form["opc:method"] : "WRITE";
                        contentType = "application/x.opcua-binary";
                        res = false;
                        dataType = payload.dataType;
                        if (!(this.session === null)) return [3, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.connect(endpointUrl)];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        err_3 = _a.sent();
                        console.debug("[binding-opcua]", err_3);
                        throw err_3;
                    case 4:
                        params = this.extract_params(url.pathname.toString().substr(1));
                        nodeId = params.ns + ';' + params.idtype;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        nodeToWrite = {
                            nodeId: nodeId,
                            attributeId: node_opcua_client_1.AttributeIds.Value,
                            value: {
                                sourceTimestamp: new Date(),
                                statusCode: node_opcua_status_code_1.StatusCodes.Good,
                                value: {
                                    dataType: dataType,
                                    value: payload
                                }
                            },
                        };
                        return [4, this.session.write(nodeToWrite)];
                    case 6:
                        result = _a.sent();
                        if (result._name === "Good" && result.value === 0) {
                            res = true;
                        }
                        return [3, 8];
                    case 7:
                        err_4 = _a.sent();
                        console.debug("[binding-opcua]", err_4);
                        throw err_4;
                    case 8: return [2, new Promise(function (resolve, reject) {
                            if (res) {
                                resolve();
                            }
                            else {
                                reject(new Error("Error while writing property"));
                            }
                        })];
                }
            });
        });
    };
    OpcuaClient.prototype.invokeResource = function (form, content) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, url, endpointUrl, method, contentType, err_5, result, params, objectId, nodeId, methodToCalls, req, status, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = content ? JSON.parse((content.body).toString()) : {};
                        url = new Url(form.href);
                        endpointUrl = url.origin;
                        method = form["opc:method"] ? form["opc:method"] : "CALL_METHOD";
                        contentType = "application/x.opcua-binary";
                        if (!(this.session === null)) return [3, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.connect(endpointUrl)];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        err_5 = _a.sent();
                        console.debug("[binding-opcua]", err_5);
                        throw err_5;
                    case 4:
                        params = this.extract_params(url.pathname.toString().substr(1));
                        objectId = params.ns + ';' + params.idtype;
                        nodeId = params.mns + ';' + params.midtype;
                        methodToCalls = [];
                        if (!(method === "CALL_METHOD")) return [3, 9];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        req = {
                            methodId: nodeId,
                            objectId: objectId,
                            inputArguments: payload.inputArguments
                        };
                        methodToCalls.push(req);
                        return [4, this.session.call(methodToCalls)];
                    case 6:
                        result = _a.sent();
                        status = result[0].statusCode;
                        if (status._value !== 0 || status._name !== 'Good') {
                            console.debug("[binding-opcua]", status);
                            throw new Error(status);
                        }
                        return [3, 8];
                    case 7:
                        err_6 = _a.sent();
                        throw err_6;
                    case 8: return [2, new Promise(function (resolve, reject) {
                            resolve({ type: contentType, body: result[0].outputArguments[0] });
                        })];
                    case 9: return [2];
                }
            });
        });
    };
    OpcuaClient.prototype.unlinkResource = function (form) {
        return new Promise(function (resolve, reject) {
            reject(new Error("OpcuaClient does not implement unlink"));
        });
    };
    OpcuaClient.prototype.checkConnection = function (endpointUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.session === null)) return [3, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.connect(endpointUrl)];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        err_7 = _a.sent();
                        console.debug("[binding-opcua]", err_7);
                        throw err_7;
                    case 4: return [2];
                }
            });
        });
    };
    OpcuaClient.prototype.subscribeResource = function (form, next, error, complete) {
        var url = new Url(form.href);
        var endpointUrl = url.origin;
        var contentType = "application/x.opcua-binary";
        var self = this;
        this.checkConnection(endpointUrl).then(function () {
            try {
                var params = self.extract_params(url.pathname.toString().substr(1));
                var nodeId = params.ns + ';' + params.idtype;
                var subscription = void 0;
                var defaultSubscriptionOptions = {
                    requestedPublishingInterval: 1000,
                    requestedLifetimeCount: 100,
                    requestedMaxKeepAliveCount: 10,
                    maxNotificationsPerPublish: 100,
                    publishingEnabled: true,
                    priority: 10
                };
                if (self.config && self.config.subscriptionOptions) {
                    subscription = node_opcua_client_1.ClientSubscription.create(self.session, self.config.subscriptionOptions);
                }
                else {
                    subscription = node_opcua_client_1.ClientSubscription.create(self.session, defaultSubscriptionOptions);
                }
                var itemToMonitor = {
                    nodeId: nodeId,
                    attributeId: node_opcua_client_1.AttributeIds.Value
                };
                var parameters = {
                    samplingInterval: 100,
                    discardOldest: true,
                    queueSize: 10
                };
                var monitoredItem = node_opcua_client_1.ClientMonitoredItem.create(subscription, itemToMonitor, parameters, node_opcua_client_1.TimestampsToReturn.Both);
                monitoredItem.on("changed", function (dataValue) {
                    next({ type: contentType, body: dataValue.value });
                    return new Subscription_1.Subscription(function () { });
                });
            }
            catch (err) {
                error(new Error("Error while subscribing property"));
            }
        }).catch(function (err) { return error(err); });
    };
    OpcuaClient.prototype.start = function () {
        return true;
    };
    OpcuaClient.prototype.stop = function () {
        return true;
    };
    OpcuaClient.prototype.setSecurity = function (metadata, credentials) {
        if (metadata === undefined || !Array.isArray(metadata) || metadata.length == 0) {
            console.warn("[binding-opcua]", "OpcuaClient without security");
            return false;
        }
        if (!credentials || (!(credentials.password) && !(credentials.privateKey))) {
            console.warn("[binding-opcua]", "Both password and certificate missing inside credentials");
        }
        this.credentials = credentials;
    };
    OpcuaClient.prototype.extract_params = function (url) {
        var res = {
            ns: null,
            idtype: null,
            mns: null,
            midtype: null
        };
        for (var i = 0; i < url.split(';').length; i++) {
            var value = url.split(';')[i];
            if (value.includes('mns=')) {
                res.mns = value.replace('mns', 'ns');
            }
            else if (value.includes('ns=')) {
                res.ns = value;
            }
            else if (value.includes('mb=') || value.includes('ms=') || value.includes('mg=') || value.includes('mi=')) {
                var midtype = value.split('=')[0];
                midtype = midtype.substr(1);
                res.midtype = midtype + '=' + value.split('=')[1];
            }
            else if (value.includes('b=') || value.includes('s=') || value.includes('g=') || value.includes('i=')) {
                res.idtype = value;
            }
        }
        return res;
    };
    return OpcuaClient;
}());
exports.default = OpcuaClient;
//# sourceMappingURL=opcua-client.js.map
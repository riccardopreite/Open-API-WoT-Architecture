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
var modbus_1 = require("./modbus");
var core_1 = require("@node-wot/core");
var utils_1 = require("./utils");
var modbus_connection_1 = require("./modbus-connection");
var DEFAULT_PORT = 805;
var DEFAULT_TIMEOUT = 1000;
var DEFAULT_POLLING = 2000;
var ModbusClient = (function () {
    function ModbusClient() {
        this._subscriptions = new Map();
        this._connections = new Map();
    }
    ModbusClient.prototype.readResource = function (form) {
        return this.performOperation(form);
    };
    ModbusClient.prototype.writeResource = function (form, content) {
        return this.performOperation(form, content);
    };
    ModbusClient.prototype.invokeResource = function (form, content) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.performOperation(form, content)];
                    case 1:
                        _a.sent();
                        resolve({ type: core_1.ContentSerdes.DEFAULT, body: Buffer.from('') });
                        return [3, 3];
                    case 2:
                        error_1 = _a.sent();
                        reject(error_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); });
    };
    ModbusClient.prototype.unlinkResource = function (form) {
        form = this.validateAndFillDefaultForm(form, 0);
        var id = form.href + "/" + form['modbus:unitID'] + "#" + form['modbus:function'] + "?" + form['modbus:range'][0] + "&" + form['modbus:range'][1];
        this._subscriptions.get(id).unsubscribe();
        this._subscriptions.delete(id);
        return Promise.resolve();
    };
    ModbusClient.prototype.subscribeResource = function (form, next, error, complete) {
        form = this.validateAndFillDefaultForm(form, 0);
        var id = form.href + "/" + form['modbus:unitID'] + "#" + form['modbus:function'] + "?" + form['modbus:range'][0] + "&" + form['modbus:range'][1];
        if (this._subscriptions.has(id)) {
            throw new Error('Already subscribed for ' + id + '. Multiple subscriptions are not supported');
        }
        this._subscriptions.set(id, new Subscription(form, this, next, error, complete));
    };
    ModbusClient.prototype.start = function () {
        return true;
    };
    ModbusClient.prototype.stop = function () {
        this._connections.forEach(function (connection) {
            connection.close();
        });
        return true;
    };
    ModbusClient.prototype.setSecurity = function (metadata, credentials) {
        return false;
    };
    ModbusClient.prototype.performOperation = function (form, content) {
        return __awaiter(this, void 0, void 0, function () {
            var parsed, port, host, hostAndPort, connection, operation;
            return __generator(this, function (_a) {
                parsed = new URL(form.href);
                port = parsed.port ? parseInt(parsed.port, 10) : DEFAULT_PORT;
                form = this.validateAndFillDefaultForm(form, content === null || content === void 0 ? void 0 : content.body.byteLength);
                host = parsed.hostname;
                hostAndPort = host + ':' + port;
                this.overrideFormFromURLPath(form);
                if (content) {
                    this.validateContentLength(form, content);
                }
                connection = this._connections.get(hostAndPort);
                if (!connection) {
                    console.debug('[binding-modbus]', 'Creating new ModbusConnection for ', hostAndPort);
                    this._connections.set(hostAndPort, new modbus_connection_1.ModbusConnection(host, port));
                    connection = this._connections.get(hostAndPort);
                }
                else {
                    console.debug('[binding-modbus]', 'Reusing ModbusConnection for ', hostAndPort);
                }
                operation = new modbus_connection_1.PropertyOperation(form, content ? content.body : undefined);
                connection.enqueue(operation);
                return [2, operation.execute()];
            });
        });
    };
    ModbusClient.prototype.overrideFormFromURLPath = function (input) {
        var parsed = new URL(input.href);
        var pathComp = parsed.pathname.split('/');
        var query = parsed.searchParams;
        input['modbus:unitID'] = parseInt(pathComp[1], 10) || input['modbus:unitID'];
        input['modbus:range'][0] = parseInt(query.get('offset'), 10) || input['modbus:range'][0];
        input['modbus:range'][1] = parseInt(query.get('length'), 10) || input['modbus:range'][1];
    };
    ModbusClient.prototype.validateContentLength = function (form, content) {
        var mpy = form['modbus:entity'] === 'InputRegister' || form['modbus:entity'] === 'HoldingRegister' ? 2 : 1;
        var length = form['modbus:range'][1];
        if (content && content.body.length !== mpy * length) {
            throw new Error('Content length does not match register / coil count, got ' + content.body.length + ' bytes for '
                + length + (" " + (mpy === 2 ? 'registers' : 'coils')));
        }
    };
    ModbusClient.prototype.validateAndFillDefaultForm = function (form, contentLength) {
        if (contentLength === void 0) { contentLength = 0; }
        var result = __assign({}, form);
        var mode = contentLength > 0 ? 'w' : 'r';
        if (!form['modbus:function'] && !form['modbus:entity']) {
            throw new Error('Malformed form: modbus:function or modbus:entity must be defined');
        }
        if (form['modbus:function']) {
            if (typeof (form['modbus:function']) === 'string') {
                result['modbus:function'] = modbus_1.ModbusFunction[form['modbus:function']];
            }
            if (!Object.keys(modbus_1.ModbusFunction).includes(result['modbus:function'].toString())) {
                throw new Error('Undefined function number or name: ' + form['modbus:function']);
                ;
            }
        }
        if (form['modbus:entity']) {
            switch (form['modbus:entity']) {
                case 'Coil':
                    result['modbus:function'] = mode === 'r' ? modbus_1.ModbusFunction.readCoil :
                        contentLength > 1 ? modbus_1.ModbusFunction.writeMultipleCoils : modbus_1.ModbusFunction.writeSingleCoil;
                    break;
                case 'HoldingRegister':
                    result['modbus:function'] = mode === 'r' ? modbus_1.ModbusFunction.readMultipleHoldingRegisters :
                        contentLength / 2 > 1 ? modbus_1.ModbusFunction.writeMultipleHoldingRegisters :
                            modbus_1.ModbusFunction.writeSingleHoldingRegister;
                    break;
                case 'InputRegister':
                    result['modbus:function'] = modbus_1.ModbusFunction.readInputRegister;
                    break;
                case 'DiscreteInput':
                    result['modbus:function'] = modbus_1.ModbusFunction.readDiscreteInput;
                    break;
                default:
                    throw new Error('Unknown modbus entity: ' + form['modbus:entity']);
            }
        }
        else {
            result['modbus:entity'] = utils_1.modbusFunctionToEntity(result['modbus:function']);
        }
        if (!form['modbus:range']) {
            result['modbus:range'] = [0, 1];
        }
        else if (!form['modbus:range'][1] && contentLength === 0) {
            result['modbus:range'] = [form['modbus:range'][0], 1];
        }
        else if (!form['modbus:range'][1] && contentLength > 0) {
            var regSize = result['modbus:entity'] === 'InputRegister' ||
                result['modbus:entity'] === 'HoldingRegister' ? 2 : 1;
            result['modbus:range'] = [form['modbus:range'][0], contentLength / regSize];
        }
        result['modbus:pollingTime'] = form['modbus:pollingTime'] ? form['modbus:pollingTime'] : DEFAULT_POLLING;
        result['modbus:timeout'] = form['modbus:timeout'] ? form['modbus:timeout'] : DEFAULT_TIMEOUT;
        return result;
    };
    return ModbusClient;
}());
exports.default = ModbusClient;
var Subscription = (function () {
    function Subscription(form, client, next, error, complete) {
        var _this = this;
        if (!complete) {
            complete = function () { return; };
        }
        this.interval = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, client.readResource(form)];
                    case 1:
                        result = _a.sent();
                        next(result);
                        return [3, 3];
                    case 2:
                        e_1 = _a.sent();
                        if (error) {
                            error(e_1);
                        }
                        clearInterval(this.interval);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); }, form['modbus:pollingTime']);
        this.complete = complete;
    }
    Subscription.prototype.unsubscribe = function () {
        clearInterval(this.interval);
        this.complete();
    };
    return Subscription;
}());
//# sourceMappingURL=modbus-client.js.map
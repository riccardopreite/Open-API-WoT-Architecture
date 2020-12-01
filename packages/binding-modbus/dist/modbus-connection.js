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
exports.PropertyOperation = exports.ModbusConnection = void 0;
var modbus_serial_1 = require("modbus-serial");
var configDefaults = {
    operationTimeout: 2000,
    connectionRetryTime: 10000,
    maxRetries: 5
};
var ModbusConnection = (function () {
    function ModbusConnection(host, port, config) {
        if (config === void 0) { config = configDefaults; }
        this.host = host;
        this.port = port;
        this.client = new modbus_serial_1.default();
        this.connecting = false;
        this.connected = false;
        this.timer = null;
        this.currentTransaction = null;
        this.queue = new Array();
        this.config = Object.assign(configDefaults, config);
    }
    ModbusConnection.prototype.enqueue = function (op) {
        for (var _i = 0, _a = this.queue; _i < _a.length; _i++) {
            var t = _a[_i];
            if (op.unitId === t.unitId &&
                op.registerType === t.registerType &&
                (op.content != null) === (t.content != null)) {
                if (op.base === t.base + t.length) {
                    t.length += op.length;
                    if (t.content) {
                        t.content = Buffer.concat([t.content, op.content]);
                    }
                    t.inform(op);
                    return;
                }
                if (op.base + op.length === t.base) {
                    t.base -= op.length;
                    t.length += op.length;
                    if (t.content) {
                        t.content = Buffer.concat([op.content, t.content]);
                    }
                    t.inform(op);
                    return;
                }
            }
        }
        var transaction = new ModbusTransaction(this, op.unitId, op.registerType, op.function, op.base, op.length, op.content);
        transaction.inform(op);
        this.queue.push(transaction);
    };
    ModbusConnection.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var retry, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.connecting && !this.connected)) return [3, 7];
                        console.debug('[binding-modbus]', 'Trying to connect to', this.host);
                        this.connecting = true;
                        retry = 0;
                        _a.label = 1;
                    case 1:
                        if (!(retry < this.config.maxRetries)) return [3, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        this.client.setTimeout(this.config.connectionTimeout);
                        return [4, this.client.connectTCP(this.host, { port: this.port })];
                    case 3:
                        _a.sent();
                        this.connecting = false;
                        this.connected = true;
                        console.debug('[binding-modbus]', 'Modbus connected to ' + this.host);
                        return [2];
                    case 4:
                        error_1 = _a.sent();
                        console.warn('[binding-modbus]', 'Cannot connect to', this.host, 'reason', error_1, " retry in " + this.config.connectionRetryTime + "ms");
                        this.connecting = false;
                        if (retry >= this.config.maxRetries - 1) {
                            throw new Error('Max connection retries');
                        }
                        return [4, new Promise(function (r) { return setTimeout(r, _this.config.connectionRetryTime); })];
                    case 5:
                        _a.sent();
                        return [3, 6];
                    case 6:
                        retry++;
                        return [3, 1];
                    case 7: return [2];
                }
            });
        });
    };
    ModbusConnection.prototype.trigger = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.debug('[binding-modbus]', 'ModbusConnection:trigger');
                        if (!(!this.connecting && !this.connected)) return [3, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.connect()];
                    case 2:
                        _a.sent();
                        this.trigger();
                        return [3, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.warn('[binding-modbus]', 'cannot reconnect to modbus server');
                        this.queue.forEach(function (transaction) {
                            transaction.operations.forEach(function (op) {
                                op.failed(error_2);
                            });
                        });
                        return [3, 4];
                    case 4: return [3, 9];
                    case 5:
                        if (!(this.connected && this.currentTransaction == null && this.queue.length > 0)) return [3, 9];
                        this.currentTransaction = this.queue.shift();
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4, this.currentTransaction.execute()];
                    case 7:
                        _a.sent();
                        this.currentTransaction = null;
                        this.trigger();
                        return [3, 9];
                    case 8:
                        error_3 = _a.sent();
                        console.warn('[binding-modbus]', 'transaction failed:', error_3);
                        this.currentTransaction = null;
                        this.trigger();
                        return [3, 9];
                    case 9: return [2];
                }
            });
        });
    };
    ModbusConnection.prototype.close = function () {
        this.modbusstop();
    };
    ModbusConnection.prototype.readModbus = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var regType;
            var _this = this;
            return __generator(this, function (_a) {
                console.debug('[binding-modbus]', 'Invoking read transaction');
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = global.setTimeout(function () { return _this.modbusstop(); }, this.config.operationTimeout);
                regType = transaction.registerType;
                this.client.setID(transaction.unitId);
                switch (regType) {
                    case 'InputRegister':
                        return [2, this.client.readInputRegisters(transaction.base, transaction.length)];
                    case 'Coil':
                        return [2, this.client.readCoils(transaction.base, transaction.length)];
                    case 'HoldingRegister':
                        return [2, this.client.readHoldingRegisters(transaction.base, transaction.length)];
                    case 'DiscreteInput':
                        return [2, this.client.readDiscreteInputs(transaction.base, transaction.length)];
                    default:
                        throw new Error('cannot read unknown register type ' + regType);
                }
                return [2];
            });
        });
    };
    ModbusConnection.prototype.writeModbus = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var modFunc, _a, coil, result, coils_1, coilsResult, value, resultRegister, values, i, registers;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.debug('[binding-modbus]', 'Invoking write transaction');
                        if (this.timer) {
                            clearTimeout(this.timer);
                        }
                        this.timer = global.setTimeout(function () { return _this.modbusstop(); }, this.config.operationTimeout);
                        modFunc = transaction.function;
                        this.client.setID(transaction.unitId);
                        _a = modFunc;
                        switch (_a) {
                            case 5: return [3, 1];
                            case 15: return [3, 3];
                            case 6: return [3, 5];
                            case 16: return [3, 7];
                        }
                        return [3, 9];
                    case 1:
                        coil = transaction.content.readUInt8(0) !== 0;
                        return [4, this.client.writeCoil(transaction.base, coil)];
                    case 2:
                        result = _b.sent();
                        if (result.address !== transaction.base && result.state !== coil) {
                            throw new Error("writing " + coil + " to " + transaction.base + " failed, state is " + result.state);
                        }
                        return [3, 10];
                    case 3:
                        coils_1 = new Array();
                        transaction.content.forEach(function (v) { return coils_1.push(v !== 0); });
                        return [4, this.client.writeCoils(transaction.base, coils_1)];
                    case 4:
                        coilsResult = _b.sent();
                        if (coilsResult.address !== transaction.base && coilsResult.length !== transaction.length) {
                            throw new Error("writing " + coils_1 + " to " + transaction.base + " failed");
                        }
                        return [3, 10];
                    case 5:
                        value = transaction.content.readUInt16BE(0);
                        return [4, this.client.writeRegister(transaction.base, value)];
                    case 6:
                        resultRegister = _b.sent();
                        if (resultRegister.address !== transaction.base && resultRegister.value !== value) {
                            throw new Error("writing " + value + " to " + transaction.base + " failed, state is " + result.value);
                        }
                        return [3, 10];
                    case 7:
                        values = new Array();
                        for (i = 0; i < transaction.length * 2; i++) {
                            values.push(transaction.content.readUInt16BE(i));
                            i++;
                        }
                        return [4, this.client.writeRegisters(transaction.base, values)];
                    case 8:
                        registers = _b.sent();
                        if (registers.address === transaction.base && transaction.length / 2 > registers.length) {
                            console.warn("short write to registers " + transaction.base + " + " + transaction.length + ", wrote " + values + " to " + registers.address + " + " + registers.length + " ");
                        }
                        else if (registers.address !== transaction.base) {
                            throw new Error("writing " + values + " to registers " + transaction.base + " + " + transaction.length + " failed, wrote to " + registers.address);
                        }
                        return [3, 10];
                    case 9: throw new Error('cannot read unknown function type ' + modFunc);
                    case 10: return [2];
                }
            });
        });
    };
    ModbusConnection.prototype.modbusstop = function () {
        var _this = this;
        console.debug('[binding-modbus]', 'Closing unused connection');
        this.client.close(function (err) {
            if (!err) {
                console.debug('[binding-modbus]', 'session closed');
                _this.connecting = false;
                _this.connected = false;
            }
            else {
                console.error('[binding-modbus]', 'cannot close session ' + err);
            }
        });
        clearInterval(this.timer);
        this.timer = null;
    };
    return ModbusConnection;
}());
exports.ModbusConnection = ModbusConnection;
var ModbusTransaction = (function () {
    function ModbusTransaction(connection, unitId, registerType, func, base, length, content) {
        this.connection = connection;
        this.unitId = unitId;
        this.registerType = registerType;
        this.function = func;
        this.base = base;
        this.length = length;
        this.content = content;
        this.operations = new Array();
    }
    ModbusTransaction.prototype.inform = function (op) {
        op.transaction = this;
        this.operations.push(op);
    };
    ModbusTransaction.prototype.trigger = function () {
        console.debug('[binding-modbus]', 'ModbusTransaction:trigger');
        this.connection.trigger();
    };
    ModbusTransaction.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result_1, error_4, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.content) return [3, 5];
                        console.debug('[binding-modbus]', 'Trigger read operation on', this.base, 'len', this.length);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.connection.readModbus(this)];
                    case 2:
                        result_1 = _a.sent();
                        console.debug('[binding-modbus]', 'Got result from read operation on', this.base, 'len', this.length);
                        this.operations.forEach(function (op) { return op.done(_this.base, result_1.buffer); });
                        return [3, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.warn('[binding-modbus]', 'read operation failed on', this.base, 'len', this.length, error_4);
                        this.operations.forEach(function (op) { return op.failed(error_4); });
                        throw error_4;
                    case 4: return [3, 9];
                    case 5:
                        console.debug('[binding-modbus]', 'Trigger write operation on', this.base, 'len', this.length);
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4, this.connection.writeModbus(this)];
                    case 7:
                        _a.sent();
                        this.operations.forEach(function (op) { return op.done(); });
                        return [3, 9];
                    case 8:
                        error_5 = _a.sent();
                        console.warn('[binding-modbus]', 'write operation failed on', this.base, 'len', this.length, error_5);
                        this.operations.forEach(function (op) { return op.failed(error_5); });
                        throw error_5;
                    case 9: return [2];
                }
            });
        });
    };
    return ModbusTransaction;
}());
var PropertyOperation = (function () {
    function PropertyOperation(form, content) {
        this.unitId = form['modbus:unitID'];
        this.registerType = form['modbus:entity'];
        this.base = form['modbus:range'][0];
        this.length = form['modbus:range'][1];
        this.function = form['modbus:function'];
        this.content = content;
        this.transaction = null;
    }
    PropertyOperation.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.resolve = resolve;
                        _this.reject = reject;
                        if (_this.transaction == null) {
                            reject('No transaction for this operation');
                        }
                        else {
                            _this.transaction.trigger();
                        }
                    })];
            });
        });
    };
    PropertyOperation.prototype.done = function (base, buffer) {
        console.debug('[binding-modbus]', 'Operation done');
        if (base === null || base === undefined) {
            this.resolve();
            return;
        }
        var offset = this.base - base;
        var resp;
        if (this.registerType === 'InputRegister' || this.registerType === 'HoldingRegister') {
            var bufstart = 2 * offset;
            var bufend = 2 * (offset + this.length);
            resp = {
                body: buffer.slice(bufstart, bufend),
                type: 'application/octet-stream'
            };
        }
        else {
            resp = {
                body: buffer.slice(offset, this.length),
                type: 'application/octet-stream'
            };
        }
        this.resolve(resp);
    };
    PropertyOperation.prototype.failed = function (reason) {
        console.warn('[binding-modbus]', 'Operation failed:', reason);
        this.reject(reason);
    };
    return PropertyOperation;
}());
exports.PropertyOperation = PropertyOperation;
//# sourceMappingURL=modbus-connection.js.map
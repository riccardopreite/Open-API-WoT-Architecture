"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var modbus_client_1 = require("./modbus-client");
var ModbusClientFactory = (function () {
    function ModbusClientFactory() {
        this.scheme = 'modbus+tcp';
        this.init = function () { return true; };
        this.destroy = function () { return true; };
    }
    ModbusClientFactory.prototype.getClient = function () {
        console.log("ModbusClientFactory creating client for '" + this.scheme + "'");
        return new modbus_client_1.default();
    };
    return ModbusClientFactory;
}());
exports.default = ModbusClientFactory;
//# sourceMappingURL=modbus-client-factory.js.map
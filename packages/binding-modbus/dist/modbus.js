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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModbusFunction = exports.ModbusForm = void 0;
var td_tools_1 = require("@node-wot/td-tools");
var modbus_client_factory_1 = require("./modbus-client-factory");
Object.defineProperty(exports, "ModbusClientFactory", { enumerable: true, get: function () { return modbus_client_factory_1.default; } });
var modbus_client_1 = require("./modbus-client");
Object.defineProperty(exports, "ModbusClient", { enumerable: true, get: function () { return modbus_client_1.default; } });
__exportStar(require("./modbus-client"), exports);
__exportStar(require("./modbus-client-factory"), exports);
var ModbusForm = (function (_super) {
    __extends(ModbusForm, _super);
    function ModbusForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ModbusForm;
}(td_tools_1.Form));
exports.ModbusForm = ModbusForm;
var ModbusFunction;
(function (ModbusFunction) {
    ModbusFunction[ModbusFunction["readCoil"] = 1] = "readCoil";
    ModbusFunction[ModbusFunction["readDiscreteInput"] = 2] = "readDiscreteInput";
    ModbusFunction[ModbusFunction["readMultipleHoldingRegisters"] = 3] = "readMultipleHoldingRegisters";
    ModbusFunction[ModbusFunction["readInputRegister"] = 4] = "readInputRegister";
    ModbusFunction[ModbusFunction["writeSingleCoil"] = 5] = "writeSingleCoil";
    ModbusFunction[ModbusFunction["writeSingleHoldingRegister"] = 6] = "writeSingleHoldingRegister";
    ModbusFunction[ModbusFunction["writeMultipleCoils"] = 15] = "writeMultipleCoils";
    ModbusFunction[ModbusFunction["writeMultipleHoldingRegisters"] = 16] = "writeMultipleHoldingRegisters";
})(ModbusFunction = exports.ModbusFunction || (exports.ModbusFunction = {}));
//# sourceMappingURL=modbus.js.map
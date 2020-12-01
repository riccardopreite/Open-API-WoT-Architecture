"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modbusFunctionToEntity = void 0;
var modbus_1 = require("./modbus");
function modbusFunctionToEntity(modbusFun) {
    switch (modbusFun) {
        case modbus_1.ModbusFunction.readCoil:
            return 'Coil';
        case modbus_1.ModbusFunction.readDiscreteInput:
            return 'DiscreteInput';
        case modbus_1.ModbusFunction.readInputRegister:
            return 'InputRegister';
        case modbus_1.ModbusFunction.readMultipleHoldingRegisters:
            return 'HoldingRegister';
        case modbus_1.ModbusFunction.writeMultipleCoils:
            return 'Coil';
        case modbus_1.ModbusFunction.writeMultipleHoldingRegisters:
            return 'HoldingRegister';
        case modbus_1.ModbusFunction.writeSingleCoil:
            return 'Coil';
        case modbus_1.ModbusFunction.writeSingleHoldingRegister:
            return 'HoldingRegister';
        default:
            throw new Error('Cannot convert ' + modbusFun + ' to ModbusEntity');
    }
}
exports.modbusFunctionToEntity = modbusFunctionToEntity;
//# sourceMappingURL=utils.js.map
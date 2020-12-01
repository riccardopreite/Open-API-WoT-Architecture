import { Form } from '@node-wot/td-tools';
export { default as ModbusClientFactory } from './modbus-client-factory';
export { default as ModbusClient } from './modbus-client';
export * from './modbus-client';
export * from './modbus-client-factory';
export declare class ModbusForm extends Form {
    'modbus:function'?: ModbusFunction | ModbusFunctionName;
    'modbus:entity'?: ModbusEntity;
    'modbus:unitID': number;
    'modbus:range'?: [number, number?];
    'modbus:timeout'?: number;
    'modbus:pollingTime'?: number;
}
export declare type ModbusFunctionName = 'readCoil' | 'readDiscreteInput' | 'readMultipleHoldingRegisters' | 'writeSingleCoil' | 'writeSingleHoldingRegister' | 'writeMultipleCoils' | 'writeMultipleHoldingRegisters';
export declare type ModbusEntity = 'Coil' | 'InputRegister' | 'HoldingRegister' | 'DiscreteInput';
export declare enum ModbusFunction {
    'readCoil' = 1,
    'readDiscreteInput' = 2,
    'readMultipleHoldingRegisters' = 3,
    'readInputRegister' = 4,
    'writeSingleCoil' = 5,
    'writeSingleHoldingRegister' = 6,
    'writeMultipleCoils' = 15,
    'writeMultipleHoldingRegisters' = 16
}

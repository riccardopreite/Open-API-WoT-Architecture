/// <reference types="node" />
import { ReadCoilResult, ReadRegisterResult } from 'modbus-serial/ModbusRTU';
import { ModbusEntity, ModbusFunction, ModbusForm } from './modbus';
import { Content } from '@node-wot/core';
export declare class ModbusConnection {
    host: string;
    port: number;
    client: any;
    connecting: boolean;
    connected: boolean;
    timer: NodeJS.Timer;
    currentTransaction: ModbusTransaction;
    queue: Array<ModbusTransaction>;
    config: {
        connectionTimeout?: number;
        operationTimeout?: number;
        connectionRetryTime?: number;
        maxRetries?: number;
    };
    constructor(host: string, port: number, config?: {
        connectionTimeout?: number;
        operationTimeout?: number;
        connectionRetryTime?: number;
        maxRetries?: number;
    });
    enqueue(op: PropertyOperation): void;
    connect(): Promise<void>;
    trigger(): Promise<void>;
    close(): void;
    readModbus(transaction: ModbusTransaction): Promise<ReadCoilResult | ReadRegisterResult>;
    writeModbus(transaction: ModbusTransaction): Promise<void>;
    private modbusstop;
}
declare class ModbusTransaction {
    connection: ModbusConnection;
    unitId: number;
    registerType: ModbusEntity;
    function: ModbusFunction;
    base: number;
    length: number;
    content?: Buffer;
    operations: Array<PropertyOperation>;
    constructor(connection: ModbusConnection, unitId: number, registerType: ModbusEntity, func: ModbusFunction, base: number, length: number, content?: Buffer);
    inform(op: PropertyOperation): void;
    trigger(): void;
    execute(): Promise<void>;
}
export declare class PropertyOperation {
    unitId: number;
    registerType: ModbusEntity;
    base: number;
    length: number;
    function: ModbusFunction;
    content?: Buffer;
    transaction: ModbusTransaction;
    resolve: (value?: Content | PromiseLike<Content>) => void;
    reject: (reason?: any) => void;
    constructor(form: ModbusForm, content?: Buffer);
    execute(): Promise<Content | PromiseLike<Content>>;
    done(base?: number, buffer?: Buffer): void;
    failed(reason: string): void;
}
export {};

import { ModbusForm } from './modbus';
import { ProtocolClient, Content } from '@node-wot/core';
import { SecurityScheme } from '@node-wot/td-tools';
export default class ModbusClient implements ProtocolClient {
    private _connections;
    private _subscriptions;
    constructor();
    readResource(form: ModbusForm): Promise<Content>;
    writeResource(form: ModbusForm, content: Content): Promise<void>;
    invokeResource(form: ModbusForm, content: Content): Promise<Content>;
    unlinkResource(form: ModbusForm): Promise<void>;
    subscribeResource(form: ModbusForm, next: ((value: any) => void), error?: (error: any) => void, complete?: () => void): any;
    start(): boolean;
    stop(): boolean;
    setSecurity(metadata: SecurityScheme[], credentials?: any): boolean;
    private performOperation;
    private overrideFormFromURLPath;
    private validateContentLength;
    private validateAndFillDefaultForm;
}

import { ProtocolClient, Content } from "@node-wot/core";
import * as TD from "@node-wot/td-tools";
import { OpcuaForm, OpcuaConfig } from "./opcua";
export default class OpcuaClient implements ProtocolClient {
    private client;
    private credentials;
    private session;
    private clientOptions;
    private config;
    constructor(_config?: OpcuaConfig);
    toString(): string;
    private connect;
    readResource(form: OpcuaForm): Promise<Content>;
    writeResource(form: OpcuaForm, content: Content): Promise<any>;
    invokeResource(form: OpcuaForm, content: Content): Promise<any>;
    unlinkResource(form: OpcuaForm): Promise<any>;
    private checkConnection;
    subscribeResource(form: OpcuaForm, next: ((value: any) => void), error?: (error: any) => void, complete?: () => void): any;
    start(): boolean;
    stop(): boolean;
    setSecurity(metadata: Array<TD.SecurityScheme>, credentials?: any): boolean;
    private extract_params;
}

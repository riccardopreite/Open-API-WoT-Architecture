import { ProtocolClient, Content } from "@node-wot/core";
import { NetconfForm } from "./netconf";
import * as TD from "@node-wot/td-tools";
export default class NetconfClient implements ProtocolClient {
    private client;
    private credentials;
    constructor();
    toString(): string;
    readResource(form: NetconfForm): Promise<Content>;
    writeResource(form: NetconfForm, content: Content): Promise<any>;
    invokeResource(form: NetconfForm, content: Content): Promise<any>;
    unlinkResource(form: NetconfForm): Promise<any>;
    subscribeResource(form: NetconfForm, next: ((value: any) => void), error?: (error: any) => void, complete?: () => void): any;
    start(): boolean;
    stop(): boolean;
    setSecurity(metadata: Array<TD.SecurityScheme>, credentials?: any): boolean;
}

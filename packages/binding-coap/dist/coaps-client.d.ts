import * as TD from "@node-wot/td-tools";
import { ProtocolClient, Content } from "@node-wot/core";
import { CoapForm } from "./coap";
export default class CoapsClient implements ProtocolClient {
    private authorization;
    constructor();
    toString(): string;
    readResource(form: CoapForm): Promise<Content>;
    writeResource(form: CoapForm, content: Content): Promise<any>;
    invokeResource(form: CoapForm, content?: Content): Promise<Content>;
    unlinkResource(form: CoapForm): Promise<any>;
    subscribeResource(form: CoapForm, next: ((value: any) => void), error?: (error: any) => void, complete?: () => void): any;
    start(): boolean;
    stop(): boolean;
    setSecurity(metadata: Array<TD.SecurityScheme>, credentials?: any): boolean;
    private generateRequest;
}

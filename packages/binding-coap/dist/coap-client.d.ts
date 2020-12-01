import * as TD from "@node-wot/td-tools";
import { ProtocolClient, Content } from "@node-wot/core";
import { CoapForm } from "./coap";
import CoapServer from "./coap-server";
export default class CoapClient implements ProtocolClient {
    private readonly agent;
    constructor(server?: CoapServer);
    toString(): string;
    readResource(form: CoapForm): Promise<Content>;
    writeResource(form: CoapForm, content: Content): Promise<any>;
    invokeResource(form: CoapForm, content?: Content): Promise<Content>;
    unlinkResource(form: CoapForm): Promise<any>;
    subscribeResource(form: CoapForm, next: ((value: any) => void), error?: (error: any) => void, complete?: () => void): any;
    start(): boolean;
    stop(): boolean;
    setSecurity: (metadata: TD.SecurityScheme[]) => boolean;
    private uriToOptions;
    private generateRequest;
}

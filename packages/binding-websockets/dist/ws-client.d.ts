import { ProtocolClient, Content } from "@node-wot/core";
import { Form } from "@node-wot/td-tools";
export default class WebSocketClient implements ProtocolClient {
    constructor();
    toString(): string;
    readResource(form: Form): Promise<Content>;
    writeResource(form: Form, content: Content): Promise<any>;
    invokeResource(form: Form, content?: Content): Promise<Content>;
    unlinkResource(form: Form): Promise<any>;
    subscribeResource(form: Form, next: ((value: any) => void), error?: (error: any) => void, complete?: () => void): any;
    start(): boolean;
    stop(): boolean;
    setSecurity(metadata: any, credentials?: any): boolean;
}

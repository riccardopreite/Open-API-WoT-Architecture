import { Form } from "@node-wot/td-tools";
import { ProtocolClient, Content } from "@node-wot/core";
export default class FileClient implements ProtocolClient {
    constructor();
    toString(): string;
    readResource(form: Form): Promise<Content>;
    writeResource(form: Form, content: Content): Promise<any>;
    invokeResource(form: Form, payload: Object): Promise<any>;
    unlinkResource(form: Form): Promise<any>;
    subscribeResource(form: Form, next: ((value: any) => void), error?: (error: any) => void, complete?: () => void): any;
    start(): boolean;
    stop(): boolean;
    setSecurity: (metadata: any) => boolean;
}

/// <reference types="node" />
import * as TD from "@node-wot/td-tools";
import { Subscription } from "rxjs/Subscription";
import Servient from "./servient";
import ExposedThing from "./exposed-thing";
export interface ProtocolClient {
    readResource(form: TD.Form): Promise<Content>;
    writeResource(form: TD.Form, content: Content): Promise<void>;
    invokeResource(form: TD.Form, content: Content): Promise<Content>;
    unlinkResource(form: TD.Form): Promise<void>;
    subscribeResource(form: TD.Form, next: ((content: Content) => void), error?: (error: any) => void, complete?: () => void): Subscription;
    start(): boolean;
    stop(): boolean;
    setSecurity(metadata: Array<TD.SecurityScheme>, credentials?: any): boolean;
}
export interface ProtocolClientFactory {
    readonly scheme: string;
    getClient(): ProtocolClient;
    init(): boolean;
    destroy(): boolean;
}
export interface ProtocolServer {
    readonly scheme: string;
    expose(thing: ExposedThing, tdTemplate?: WoT.ThingDescription): Promise<void>;
    start(servient: Servient): Promise<void>;
    stop(): Promise<void>;
    getPort(): number;
}
export interface Content {
    type: string;
    body: Buffer;
}

import * as WoT from "wot-typescript-definitions";
import ExposedThing from "./exposed-thing";
import { ProtocolClientFactory, ProtocolServer, ProtocolClient } from "./protocol-interfaces";
import { ContentCodec } from "./content-serdes";
export default class Servient {
    private servers;
    private clientFactories;
    private things;
    private credentialStore;
    runScript(code: string, filename?: string): void;
    runPrivilegedScript(code: string, filename?: string): void;
    private logScriptError;
    addMediaType(codec: ContentCodec, offered?: boolean): void;
    expose(thing: ExposedThing): Promise<void>;
    addThing(thing: ExposedThing): boolean;
    getThing(id: string): ExposedThing;
    getThings(): object;
    addServer(server: ProtocolServer): boolean;
    getServers(): Array<ProtocolServer>;
    addClientFactory(clientFactory: ProtocolClientFactory): void;
    hasClientFor(scheme: string): boolean;
    getClientFor(scheme: string): ProtocolClient;
    getClientSchemes(): string[];
    addCredentials(credentials: any): void;
    getCredentials(identifier: string): any;
    start(): Promise<WoT.WoT>;
    shutdown(): void;
}

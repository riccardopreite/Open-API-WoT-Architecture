import Servient, { ProtocolServer, ExposedThing } from "@node-wot/core";
export default class CoapServer implements ProtocolServer {
    readonly scheme: string;
    private readonly PROPERTY_DIR;
    private readonly ACTION_DIR;
    private readonly EVENT_DIR;
    private readonly port;
    private readonly address;
    private readonly server;
    private readonly things;
    private servient;
    constructor(port?: number, address?: string);
    start(servient: Servient): Promise<void>;
    stop(): Promise<void>;
    getSocket(): any;
    getPort(): number;
    expose(thing: ExposedThing, tdTemplate?: WoT.ThingDescription): Promise<void>;
    private handleRequest;
}

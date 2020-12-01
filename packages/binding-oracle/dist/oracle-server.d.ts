import { ProtocolServer, Servient, ExposedThing } from "@node-wot/core";
export default class OracleServer implements ProtocolServer {
    readonly scheme: string;
    readonly activationId: string;
    private server;
    private running;
    private failed;
    private readonly devices;
    constructor(store?: string, password?: string);
    expose(thing: ExposedThing): Promise<void>;
    start(servient: Servient): Promise<void>;
    stop(): Promise<void>;
    getPort(): number;
    private getModel;
    private registerDevice;
    private startDevice;
}

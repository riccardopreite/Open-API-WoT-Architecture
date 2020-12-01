import { ProtocolServer, Servient, ExposedThing } from "@node-wot/core";
export default class MqttBrokerServer implements ProtocolServer {
    readonly scheme: string;
    private port;
    private address;
    private user;
    private psw;
    private clientId;
    private protocolVersion;
    private brokerURI;
    private readonly things;
    private broker;
    constructor(uri: string, user?: string, psw?: string, clientId?: string, protocolVersion?: number);
    expose(thing: ExposedThing): Promise<void>;
    start(servient: Servient): Promise<void>;
    stop(): Promise<void>;
    getPort(): number;
    getAddress(): string;
}

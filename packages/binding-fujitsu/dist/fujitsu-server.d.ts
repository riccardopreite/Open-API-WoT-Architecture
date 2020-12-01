import { ProtocolServer, Servient, ExposedThing } from "@node-wot/core";
export default class FujitsuServer implements ProtocolServer {
    readonly scheme: string;
    private readonly remote;
    private websocket;
    private readonly things;
    constructor(remoteURI: string);
    start(servient: Servient): Promise<void>;
    stop(): Promise<void>;
    getPort(): number;
    expose(thing: ExposedThing): Promise<void>;
    private handle;
    private reply;
    private replyClientError;
    private replyServerError;
    private replyError;
}

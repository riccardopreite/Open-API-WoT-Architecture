import { ProtocolClientFactory, ProtocolClient } from "@node-wot/core";
import CoapServer from "./coap-server";
export default class CoapClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    private readonly server;
    constructor(server?: CoapServer);
    getClient(): ProtocolClient;
    init(): boolean;
    destroy(): boolean;
}

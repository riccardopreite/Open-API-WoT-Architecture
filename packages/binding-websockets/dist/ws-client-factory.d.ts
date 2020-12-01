import { ProtocolClientFactory, ProtocolClient } from "@node-wot/core";
export default class WebSocketClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    private clientSideProxy;
    constructor(proxy?: any);
    getClient(): ProtocolClient;
    init(): boolean;
    destroy(): boolean;
}

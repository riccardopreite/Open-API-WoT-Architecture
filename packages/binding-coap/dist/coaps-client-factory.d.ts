import { ProtocolClientFactory, ProtocolClient } from "@node-wot/core";
export default class CoapsClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    constructor(proxy?: string);
    getClient(): ProtocolClient;
    init(): boolean;
    destroy(): boolean;
}

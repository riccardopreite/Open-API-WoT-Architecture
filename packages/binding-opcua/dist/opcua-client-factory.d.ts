import { ProtocolClientFactory, ProtocolClient } from "@node-wot/core";
import { ContentSerdes } from "@node-wot/core";
import { OpcuaConfig } from "./opcua";
export default class OpcuaClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    private config;
    contentSerdes: ContentSerdes;
    constructor(config?: OpcuaConfig);
    getClient(): ProtocolClient;
    init: () => boolean;
    destroy: () => boolean;
}

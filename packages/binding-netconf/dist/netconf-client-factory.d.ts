import { ProtocolClientFactory, ProtocolClient } from "@node-wot/core";
import { ContentSerdes } from "@node-wot/core";
export default class NetconfClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    contentSerdes: ContentSerdes;
    constructor();
    getClient(): ProtocolClient;
    init: () => boolean;
    destroy: () => boolean;
}

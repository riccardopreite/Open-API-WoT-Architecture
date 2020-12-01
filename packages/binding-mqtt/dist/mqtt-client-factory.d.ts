import { ProtocolClientFactory, ProtocolClient } from "@node-wot/core";
export default class MqttClientFactory implements ProtocolClientFactory {
    readonly scheme: string;
    private readonly clients;
    getClient: () => ProtocolClient;
    init(): boolean;
    destroy(): boolean;
}

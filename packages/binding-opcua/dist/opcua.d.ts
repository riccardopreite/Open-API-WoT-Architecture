export { default as OpcuaClient } from './opcua-client';
export { default as OpcuaClientFactory } from './opcua-client-factory';
import { Form } from "@node-wot/td-tools";
export * from './opcua';
export * from './opcua-client-factory';
export interface OpcuaConfig {
    subscriptionOptions: {
        requestedPublishingInterval?: number;
        requestedLifetimeCount?: number;
        requestedMaxKeepAliveCount?: number;
        maxNotificationsPerPublish?: number;
        publishingEnabled?: boolean;
        priority?: number;
    };
}
export declare class OpcuaForm extends Form {
    "opc:method": string;
}

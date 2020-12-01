export { default as NetconfClient } from './netconf-client';
export { default as NetconfClientFactory } from './netconf-client-factory';
import { Form } from "@node-wot/td-tools";
export * from './netconf';
export * from './netconf-client-factory';
export declare class NetconfForm extends Form {
    "nc:NSs"?: any;
    "nc:method"?: string;
    "nc:target"?: string;
}

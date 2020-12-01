import { Form } from "@node-wot/td-tools";
export { default as CoapServer } from "./coap-server";
export { default as CoapClientFactory } from "./coap-client-factory";
export { default as CoapClient } from "./coap-client";
export { default as CoapsClientFactory } from "./coaps-client-factory";
export { default as CoapsClient } from "./coaps-client";
export * from "./coap-server";
export * from "./coap-client-factory";
export * from "./coap-client";
export * from "./coaps-client-factory";
export * from "./coaps-client";
export declare class CoapForm extends Form {
    "coap:methodCode"?: number;
    "coap:options"?: Array<CoapOption> | CoapOption;
}
export declare class CoapOption {
    "coap:optionCode": number;
    "coap:optionValue": any;
}
export declare interface CoapRequestConfig {
    agent?: Object;
    hostname?: string;
    port?: number;
    pathname?: string;
    query?: string;
    observe?: boolean;
    multicast?: boolean;
    confirmable?: boolean;
    method?: string;
}

import * as TD from "@node-wot/td-tools";
export { default as HttpServer } from './http-server';
export { default as HttpClient } from './http-client';
export { default as HttpClientFactory } from './http-client-factory';
export { default as HttpsClientFactory } from './https-client-factory';
export * from './http-server';
export * from './http-client';
export * from './http-client-factory';
export * from './https-client-factory';
export interface HttpConfig {
    port?: number;
    address?: string;
    proxy?: HttpProxyConfig;
    allowSelfSigned?: boolean;
    serverKey?: string;
    serverCert?: string;
    security?: TD.SecurityScheme;
}
export interface HttpProxyConfig {
    href: string;
    scheme?: "basic" | "bearer";
    token?: string;
    username?: string;
    password?: string;
}
export declare class HttpForm extends TD.Form {
    "htv:methodName"?: HTTPMethodName;
    "htv:headers"?: Array<HttpHeader> | HttpHeader;
}
export declare type HTTPMethodName = "GET" | "PUT" | "POST" | "DELETE" | "PATCH";
export declare class HttpHeader {
    "htv:fieldName": number;
    "htv:fieldValue": any;
}

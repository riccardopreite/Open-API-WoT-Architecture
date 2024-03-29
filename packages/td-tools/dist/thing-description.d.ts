import * as WoT from "wot-typescript-definitions";
export declare const DEFAULT_CONTEXT: string;
export declare const DEFAULT_CONTEXT_LANGUAGE: string;
export declare const DEFAULT_THING_TYPE: string;
export declare type MultiLanguage = any;
export default class Thing {
    id: string;
    title: string;
    titles: MultiLanguage;
    description: string;
    descriptions: MultiLanguage;
    support: string;
    modified: string;
    created: string;
    version: VersionInfo;
    securityDefinitions: {
        [key: string]: SecurityScheme;
    };
    security: Array<String>;
    base: string;
    properties: {
        [key: string]: ThingProperty;
    };
    actions: {
        [key: string]: ThingAction;
    };
    events: {
        [key: string]: ThingEvent;
    };
    links: Array<Link>;
    forms: Array<Form>;
    [key: string]: any;
    constructor();
}
export interface ThingInteraction {
    title?: string;
    titles?: MultiLanguage;
    description?: string;
    descriptions?: MultiLanguage;
    scopes?: Array<string>;
    uriVariables?: {
        [key: string]: DataSchema;
    };
    security?: Array<string>;
    forms?: Array<Form>;
    [key: string]: any;
}
export declare class ExpectedResponse implements ExpectedResponse {
    contentType?: string;
}
export declare class Form implements Form {
    href: string;
    subprotocol?: string;
    op?: string | Array<string>;
    contentType?: string;
    security?: Array<string>;
    scopes?: Array<string>;
    response?: ExpectedResponse;
    constructor(href: string, contentType?: string);
}
export interface VersionInfo {
    instance?: string;
}
export interface Link {
    href: string;
    rel?: string | Array<string>;
    type?: string;
    anchor?: string;
}
export interface ExpectedResponse {
    contentType?: string;
}
export interface Form {
    href: string;
    subprotocol?: string;
    op?: string | Array<string>;
    contentType?: string;
    security?: Array<string>;
    scopes?: Array<string>;
    response?: ExpectedResponse;
}
export declare type DataSchema = WoT.DataSchema & (BooleanSchema | IntegerSchema | NumberSchema | StringSchema | ObjectSchema | ArraySchema | NullSchema);
export declare class BaseSchema {
    type?: string;
    title?: string;
    titles?: MultiLanguage;
    description?: string;
    descriptions?: MultiLanguage;
    writeOnly?: boolean;
    readOnly?: boolean;
    oneOf?: Array<DataSchema>;
    unit?: string;
    const?: any;
    enum?: Array<any>;
}
export interface BooleanSchema extends BaseSchema {
    type: "boolean";
}
export interface IntegerSchema extends BaseSchema {
    type: "integer";
    minimum?: number;
    maximum?: number;
}
export interface NumberSchema extends BaseSchema {
    type: "number";
    minimum?: number;
    maximum?: number;
}
export interface StringSchema extends BaseSchema {
    type: "string";
}
export interface ObjectSchema extends BaseSchema {
    type: "object";
    properties: {
        [key: string]: DataSchema;
    };
    required?: Array<string>;
}
export interface ArraySchema extends BaseSchema {
    type: "array";
    items: DataSchema;
    minItems?: number;
    maxItems?: number;
}
export interface NullSchema extends BaseSchema {
    type: "null";
}
export declare type SecurityType = NoSecurityScheme | BasicSecurityScheme | DigestSecurityScheme | BearerSecurityScheme | CertSecurityScheme | PoPSecurityScheme | APIKeySecurityScheme | OAuth2SecurityScheme | PSKSecurityScheme | PublicSecurityScheme;
export interface SecurityScheme {
    scheme: string;
    description?: string;
    proxy?: string;
}
export interface NoSecurityScheme extends SecurityScheme {
    scheme: "nosec";
}
export interface BasicSecurityScheme extends SecurityScheme {
    scheme: "basic";
    in?: string;
    name?: string;
}
export interface DigestSecurityScheme extends SecurityScheme {
    scheme: "digest";
    name?: string;
    in?: string;
    qop?: string;
}
export interface APIKeySecurityScheme extends SecurityScheme {
    scheme: "apikey";
    in?: string;
    name?: string;
}
export interface BearerSecurityScheme extends SecurityScheme {
    scheme: "bearer";
    in?: string;
    alg?: string;
    format?: string;
    name?: string;
    authorization?: string;
}
export interface CertSecurityScheme extends SecurityScheme {
    scheme: "cert";
    identity?: string;
}
export interface PSKSecurityScheme extends SecurityScheme {
    scheme: "psk";
    identity?: string;
}
export interface PublicSecurityScheme extends SecurityScheme {
    scheme: "public";
    identity?: string;
}
export interface PoPSecurityScheme extends SecurityScheme {
    scheme: "pop";
    format?: string;
    authorization?: string;
    alg?: string;
    name?: string;
    in?: string;
}
export interface OAuth2SecurityScheme extends SecurityScheme {
    scheme: "oauth2";
    authorization?: string;
    flow?: string;
    token?: string;
    refresh?: string;
    scopes?: Array<string>;
}
export declare abstract class ThingProperty extends BaseSchema implements ThingInteraction {
    observable?: boolean;
    type?: string;
    forms?: Array<Form>;
    title?: string;
    titles?: MultiLanguage;
    description?: string;
    descriptions?: MultiLanguage;
    scopes?: Array<string>;
    uriVariables?: {
        [key: string]: DataSchema;
    };
    security?: Array<string>;
    [key: string]: any;
}
export declare abstract class ThingAction implements ThingInteraction {
    input?: DataSchema;
    output?: DataSchema;
    safe?: boolean;
    idempotent?: boolean;
    forms?: Array<Form>;
    title?: string;
    titles?: MultiLanguage;
    description?: string;
    descriptions?: MultiLanguage;
    scopes?: Array<string>;
    uriVariables?: {
        [key: string]: DataSchema;
    };
    security?: Array<string>;
    [key: string]: any;
}
export declare abstract class ThingEvent implements ThingInteraction {
    subscription?: DataSchema;
    data?: DataSchema;
    cancellation?: DataSchema;
    forms?: Array<Form>;
    title?: string;
    titles?: MultiLanguage;
    description?: string;
    descriptions?: MultiLanguage;
    scopes?: Array<string>;
    uriVariables?: {
        [key: string]: DataSchema;
    };
    security?: Array<string>;
    [key: string]: any;
}

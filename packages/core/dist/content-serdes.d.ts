/// <reference types="node" />
import { Content } from "./protocol-interfaces";
import * as TD from "@node-wot/td-tools";
export interface ContentCodec {
    getMediaType(): string;
    bytesToValue(bytes: Buffer, schema: TD.DataSchema, parameters?: {
        [key: string]: string;
    }): any;
    valueToBytes(value: any, schema: TD.DataSchema, parameters?: {
        [key: string]: string;
    }): Buffer;
}
export declare class ContentSerdes {
    private static instance;
    static readonly DEFAULT: string;
    static readonly TD: string;
    static readonly JSON_LD: string;
    private codecs;
    private offered;
    private constructor();
    static get(): ContentSerdes;
    static getMediaType(contentType: string): string;
    static getMediaTypeParameters(contentType: string): {
        [key: string]: string;
    };
    addCodec(codec: ContentCodec, offered?: boolean): void;
    getSupportedMediaTypes(): Array<string>;
    getOfferedMediaTypes(): Array<string>;
    contentToValue(content: Content, schema: TD.DataSchema): any;
    valueToContent(value: any, schema: TD.DataSchema, contentType?: string): Content;
}
declare const _default: ContentSerdes;
export default _default;

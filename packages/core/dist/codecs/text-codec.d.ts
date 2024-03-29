/// <reference types="node" />
import { ContentCodec } from "../content-serdes";
import * as TD from "@node-wot/td-tools";
export default class TextCodec implements ContentCodec {
    private subMediaType;
    constructor(subMediaType?: string);
    getMediaType(): string;
    bytesToValue(bytes: Buffer, schema: TD.DataSchema, parameters: {
        [key: string]: string;
    }): any;
    valueToBytes(value: any, schema: TD.DataSchema, parameters?: {
        [key: string]: string;
    }): Buffer;
}

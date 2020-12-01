/// <reference types="node" />
import * as TD from "@node-wot/td-tools";
export default class NetconfCodec {
    getMediaType(): string;
    bytesToValue(bytes: Buffer, schema: TD.DataSchema, parameters: {
        [key: string]: string;
    }): any;
    valueToBytes(value: any, schema: TD.DataSchema, parameters?: {
        [key: string]: string;
    }): Buffer;
    private getPayloadNamespaces;
}

/// <reference types="node" />
import { ContentCodec } from "@node-wot/core";
import * as TD from "@node-wot/td-tools";
export default class OpcuaCodec implements ContentCodec {
    getMediaType(): string;
    bytesToValue(bytes: Buffer, schema: TD.DataSchema, parameters: {
        [key: string]: string;
    }): any;
    valueToBytes(value: any, schema: TD.DataSchema, parameters?: {
        [key: string]: string;
    }): Buffer;
    dataTypetoString(): string;
    private getOPCUADataType;
    private getInputArguments;
}

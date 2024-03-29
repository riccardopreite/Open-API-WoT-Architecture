"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OctetstreamCodec = (function () {
    function OctetstreamCodec() {
    }
    OctetstreamCodec.prototype.getMediaType = function () {
        return 'application/octet-stream';
    };
    OctetstreamCodec.prototype.bytesToValue = function (bytes, schema, parameters) {
        var bigendian = parameters.byteorder ? parameters.byteorder === "bigendian" : true;
        var signed = parameters.signed ? parameters.signed === "true" : false;
        if (parameters.length && parseInt(parameters.length) !== bytes.length) {
            throw new Error("Lengths do not match, required: " + parameters.length + " provided: " + bytes.length);
        }
        switch (schema.type) {
            case "boolean":
                return !bytes.every(function (val) { return val == 0; });
            case "integer":
                switch (bytes.length) {
                    case 1:
                        return signed ? bytes.readInt8(0) : bytes.readUInt8(0);
                    case 2:
                        return bigendian ? (signed ? bytes.readInt16BE(0) : bytes.readUInt16BE(0))
                            : (signed ? bytes.readInt16LE(0) : bytes.readUInt16LE(0));
                    case 4:
                        return bigendian ? (signed ? bytes.readInt32BE(0) : bytes.readUInt32BE(0))
                            : (signed ? bytes.readInt32LE(0) : bytes.readUInt32LE(0));
                    default:
                        var result = 0;
                        var negative = void 0;
                        if (bigendian) {
                            result = bytes.reduce(function (prev, curr, ix, arr) { return prev << 8 + curr; });
                            negative = bytes.readInt8(0) < 0;
                        }
                        else {
                            result = bytes.reduceRight(function (prev, curr, ix, arr) { return prev << 8 + curr; });
                            negative = bytes.readInt8(bytes.length - 1) < 0;
                        }
                        if (signed && negative) {
                            result -= 1 << (8 * bytes.length);
                        }
                        if (!Number.isSafeInteger(result)) {
                            console.warn("[core/octetstream-codec]", "Result is not a safe integer");
                        }
                        return result;
                }
            case "number":
                switch (bytes.length) {
                    case 4:
                        return bigendian ? bytes.readFloatBE(0) : bytes.readFloatLE(0);
                    case 8:
                        return bigendian ? bytes.readDoubleBE(0) : bytes.readDoubleLE(0);
                    default:
                        throw new Error("Wrong buffer length for type 'number', must be 4 or 8, is " + bytes.length);
                }
            case "string":
                return bytes.toString(parameters.charset);
            case "array":
            case "object":
                throw new Error("Unable to handle object type " + schema.type);
            case "null":
                return null;
        }
        throw new Error("Unknown object type");
    };
    OctetstreamCodec.prototype.valueToBytes = function (value, schema, parameters) {
        if (parameters.length === null) {
            throw new Error("Missing 'length' parameter necessary for write");
        }
        var bigendian = parameters.byteorder ? parameters.byteorder === "bigendian" : true;
        var signed = parameters.signed ? parameters.signed === "true" : false;
        var length = parseInt(parameters.length);
        var buf;
        if (value === undefined) {
            throw new Error("Undefined value");
        }
        switch (schema.type) {
            case "boolean":
                return Buffer.alloc(length, value ? 255 : 0);
            case "integer":
                if (typeof value !== "number") {
                    throw new Error("Value is not a number");
                }
                if (!Number.isSafeInteger(value)) {
                    console.warn("[core/octetstream-codec]", "Value is not a safe integer");
                }
                if (signed) {
                    if (value < -(1 << 8 * length - 1) || value >= (1 << 8 * length - 1)) {
                        throw new Error("Integer overflow when representing signed " + value + " in " + length + " byte(s)");
                    }
                }
                else {
                    if (value < 0 || value >= (1 << 8 * length)) {
                        throw new Error("Integer overflow when representing unsigned " + value + " in " + length + " byte(s)");
                    }
                }
                buf = Buffer.alloc(length);
                switch (length) {
                    case 1:
                        signed ? buf.writeInt8(value, 0) : buf.writeUInt8(value, 0);
                        break;
                    case 2:
                        bigendian ? (signed ? buf.writeInt16BE(value, 0) : buf.writeUInt16BE(value, 0))
                            : (signed ? buf.writeInt16LE(value, 0) : buf.writeUInt16LE(value, 0));
                        break;
                    case 4:
                        bigendian ? (signed ? buf.writeInt32BE(value, 0) : buf.writeUInt32BE(value, 0))
                            : (signed ? buf.writeInt32LE(value, 0) : buf.writeUInt32LE(value, 0));
                        break;
                    default:
                        if (signed && value < 0) {
                            value += 1 << 8 * length;
                        }
                        for (var i = 0; i < length; ++i) {
                            var byte = value % 0x100;
                            value /= 0x100;
                            buf.writeInt8(byte, bigendian ? length - i - 1 : i);
                        }
                }
                return buf;
            case "number":
                if (typeof value !== "number") {
                    throw new Error("Value is not a number");
                }
                buf = Buffer.alloc(length);
                switch (length) {
                    case 4:
                        bigendian ? buf.writeFloatBE(value, 0) : buf.writeFloatLE(value, 0);
                        break;
                    case 8:
                        bigendian ? buf.writeDoubleBE(value, 0) : buf.writeDoubleLE(value, 0);
                        break;
                    default:
                        throw new Error("Wrong buffer length for type 'number', must be 4 or 8, is " + length);
                }
                return buf;
            case "string":
                var str = String(value);
                return Buffer.from(str);
            case "array":
            case "object":
                throw new Error("Unable to handle object type " + schema.type);
            case "null":
                return null;
        }
        throw new Error("Unknown object type");
    };
    return OctetstreamCodec;
}());
exports.default = OctetstreamCodec;
//# sourceMappingURL=octetstream-codec.js.map
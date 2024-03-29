"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var content_serdes_1 = require("../content-serdes");
var JsonCodec = (function () {
    function JsonCodec(subMediaType) {
        if (!subMediaType) {
            this.subMediaType = content_serdes_1.ContentSerdes.DEFAULT;
        }
        else {
            this.subMediaType = subMediaType;
        }
    }
    JsonCodec.prototype.getMediaType = function () {
        return this.subMediaType;
    };
    JsonCodec.prototype.bytesToValue = function (bytes, schema, parameters) {
        var parsed;
        try {
            parsed = JSON.parse(bytes.toString());
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                if (bytes.byteLength == 0) {
                    parsed = undefined;
                }
                else {
                    parsed = bytes.toString();
                }
            }
            else {
                throw err;
            }
        }
        if (parsed && parsed.value !== undefined) {
            console.warn("[core/json-codec]", "JsonCodec removing { value: ... } wrapper");
            parsed = parsed.value;
        }
        return parsed;
    };
    JsonCodec.prototype.valueToBytes = function (value, schema, parameters) {
        var body = "";
        if (value !== undefined) {
            body = JSON.stringify(value);
        }
        return Buffer.from(body);
    };
    return JsonCodec;
}());
exports.default = JsonCodec;
//# sourceMappingURL=json-codec.js.map
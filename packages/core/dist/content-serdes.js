"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_codec_1 = require("./codecs/json-codec");
var text_codec_1 = require("./codecs/text-codec");
var base64_codec_1 = require("./codecs/base64-codec");
var octetstream_codec_1 = require("./codecs/octetstream-codec");
var ContentSerdes = (function () {
    function ContentSerdes() {
        this.codecs = new Map();
        this.offered = new Set();
    }
    ContentSerdes.get = function () {
        if (!this.instance) {
            this.instance = new ContentSerdes();
            this.instance.addCodec(new json_codec_1.default(), true);
            this.instance.addCodec(new json_codec_1.default("application/senml+json"));
            this.instance.addCodec(new text_codec_1.default());
            this.instance.addCodec(new text_codec_1.default("text/html"));
            this.instance.addCodec(new text_codec_1.default("text/css"));
            this.instance.addCodec(new text_codec_1.default("application/xml"));
            this.instance.addCodec(new text_codec_1.default("application/xhtml+xml"));
            this.instance.addCodec(new text_codec_1.default("image/svg+xml"));
            this.instance.addCodec(new base64_codec_1.default("image/png"));
            this.instance.addCodec(new base64_codec_1.default("image/gif"));
            this.instance.addCodec(new base64_codec_1.default("image/jpeg"));
            this.instance.addCodec(new octetstream_codec_1.default());
        }
        return this.instance;
    };
    ContentSerdes.getMediaType = function (contentType) {
        var parts = contentType.split(";");
        return parts[0].trim();
    };
    ContentSerdes.getMediaTypeParameters = function (contentType) {
        var parts = contentType.split(";").slice(1);
        var params = {};
        parts.forEach(function (p) {
            var eq = p.indexOf("=");
            if (eq >= 0) {
                params[p.substr(0, eq).trim()] = p.substr(eq + 1).trim();
            }
            else {
                params[p.trim()] = null;
            }
        });
        return params;
    };
    ContentSerdes.prototype.addCodec = function (codec, offered) {
        if (offered === void 0) { offered = false; }
        ContentSerdes.get().codecs.set(codec.getMediaType(), codec);
        if (offered)
            ContentSerdes.get().offered.add(codec.getMediaType());
    };
    ContentSerdes.prototype.getSupportedMediaTypes = function () {
        return Array.from(ContentSerdes.get().codecs.keys());
    };
    ContentSerdes.prototype.getOfferedMediaTypes = function () {
        return Array.from(ContentSerdes.get().offered);
    };
    ContentSerdes.prototype.contentToValue = function (content, schema) {
        if (content.type === undefined) {
            if (content.body.byteLength > 0) {
                content.type = ContentSerdes.DEFAULT;
            }
            else {
                return;
            }
        }
        var mt = ContentSerdes.getMediaType(content.type);
        var par = ContentSerdes.getMediaTypeParameters(content.type);
        if (this.codecs.has(mt)) {
            console.debug("[core/content-senders]", "ContentSerdes deserializing from " + content.type);
            var codec = this.codecs.get(mt);
            var res = codec.bytesToValue(content.body, schema, par);
            return res;
        }
        else {
            console.warn("[core/content-senders]", "ContentSerdes passthrough due to unsupported media type '" + mt + "'");
            return content.body.toString();
        }
    };
    ContentSerdes.prototype.valueToContent = function (value, schema, contentType) {
        if (contentType === void 0) { contentType = ContentSerdes.DEFAULT; }
        if (value === undefined)
            console.warn("[core/content-senders]", "ContentSerdes valueToContent got no value");
        var bytes = null;
        var mt = ContentSerdes.getMediaType(contentType);
        var par = ContentSerdes.getMediaTypeParameters(contentType);
        if (this.codecs.has(mt)) {
            console.debug("[core/content-senders]", "ContentSerdes serializing to " + contentType);
            var codec = this.codecs.get(mt);
            bytes = codec.valueToBytes(value, schema, par);
        }
        else {
            console.warn("[core/content-senders]", "ContentSerdes passthrough due to unsupported serialization format '" + contentType + "'");
            bytes = Buffer.from(value);
        }
        return { type: contentType, body: bytes };
    };
    ContentSerdes.DEFAULT = "application/json";
    ContentSerdes.TD = "application/td+json";
    ContentSerdes.JSON_LD = "application/ld+json";
    return ContentSerdes;
}());
exports.ContentSerdes = ContentSerdes;
exports.default = ContentSerdes.get();
//# sourceMappingURL=content-serdes.js.map
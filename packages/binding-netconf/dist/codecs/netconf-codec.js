"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Url = require("url-parse");
var NetconfCodec = (function () {
    function NetconfCodec() {
    }
    NetconfCodec.prototype.getMediaType = function () {
        return 'application/yang-data+xml';
    };
    NetconfCodec.prototype.bytesToValue = function (bytes, schema, parameters) {
        var parsed;
        try {
            parsed = JSON.parse(bytes.toString());
            var reply = parsed.rpc_reply.data;
            var leaf = schema;
            var form = leaf.forms[0];
            leaf = form.href.split('/').splice(-1, 1);
            leaf = leaf[0].replace(/\[(.*?)\]/g, '');
            if (!leaf) {
                throw new Error("The href specified in TD is missing the leaf node in the Xpath");
            }
            var url = new Url(form.href);
            var xpath_query = url.pathname;
            var tree = xpath_query.split('/').map(function (value, index) {
                var val = value.replace(/\[(.*?)\]/g, '').split(":");
                return val[1] ? val[1] : val[0];
            });
            var value = reply;
            for (var _i = 0, tree_1 = tree; _i < tree_1.length; _i++) {
                var el = tree_1[_i];
                if (el === '') {
                    continue;
                }
                value = value[el];
            }
            var tmp_schema = schema;
            if (!("type" in tmp_schema)) {
                throw new Error("TD is missing the schema type");
            }
            if (tmp_schema.type === 'object') {
                if (tmp_schema.properties && tmp_schema["xml:container"] && tmp_schema.properties.xmlns && tmp_schema.properties.xmlns["xml:attribute"]) {
                    parsed = {};
                    var xmlns_key = Object.keys(value.$)[0];
                    parsed.xmlns = value.$[xmlns_key];
                    parsed.value = value['_'].split(":")[1];
                }
            }
            else {
                parsed = value;
            }
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
        return parsed;
    };
    NetconfCodec.prototype.valueToBytes = function (value, schema, parameters) {
        var body = "";
        if (value !== undefined) {
            var NSs = {};
            var leaf = schema;
            leaf = leaf.forms[0].href.split('/').splice(-1, 1);
            leaf = leaf[0].replace(/\[(.*?)\]/g, '');
            if (!leaf) {
                throw new Error("The href specified in TD is missing the leaf node in the Xpath");
            }
            var tmp_obj = this.getPayloadNamespaces(schema, value, NSs, false, leaf);
            body = JSON.stringify(tmp_obj);
        }
        return Buffer.from(body);
    };
    NetconfCodec.prototype.getPayloadNamespaces = function (schema, payload, NSs, hasNamespace, leaf) {
        var _a;
        if (hasNamespace) {
            var properties = schema.properties;
            if (!properties) {
                throw new Error("Missing \"properties\" field in TD");
            }
            var ns_found = false;
            var alias_ns = '';
            var value = void 0;
            for (var key in properties) {
                var el = properties[key];
                if (!(payload[key])) {
                    throw new Error("Payload is missing '" + key + "' field specified in TD");
                }
                if (el["xml:attribute"] === true && payload[key]) {
                    var ns = payload[key];
                    alias_ns = ns.split(':')[ns.split(':').length - 1];
                    NSs[alias_ns] = payload[key];
                    ns_found = true;
                }
                else if (payload[key]) {
                    value = payload[key];
                }
            }
            if (!ns_found) {
                throw new Error("Namespace not found in the payload");
            }
            else {
                payload = (_a = {}, _a[leaf] = alias_ns + '\\' + ':' + value, _a);
            }
            return { payload: payload, NSs: NSs };
        }
        if (schema && schema.type && schema.type === 'object' && schema.properties) {
            var tmp_hasNamespace = false;
            var tmp_obj = void 0;
            if (schema.properties && schema["xml:container"]) {
                tmp_obj = this.getPayloadNamespaces(schema, payload, NSs, true, leaf);
            }
            else {
                tmp_obj = this.getPayloadNamespaces(schema.properties, payload, NSs, false, leaf);
            }
            payload = tmp_obj.payload;
            NSs = __assign(__assign({}, NSs), tmp_obj.NSs);
        }
        for (var key in schema) {
            if ((schema[key].type && schema[key].type === 'object') || hasNamespace) {
                var tmp_hasNamespace = false;
                if (schema[key].properties && schema[key]["xml:container"]) {
                    tmp_hasNamespace = true;
                }
                var tmp_obj = this.getPayloadNamespaces(schema[key], payload[key], NSs, tmp_hasNamespace, leaf);
                payload[key] = tmp_obj.payload;
                NSs = __assign(__assign({}, NSs), tmp_obj.NSs);
            }
        }
        return { payload: payload, NSs: NSs };
    };
    return NetconfCodec;
}());
exports.default = NetconfCodec;
function mapJsonToArray(obj) {
    if (typeof obj === 'object') {
        console.debug("[binding-netconf]", obj);
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                mapJsonToArray(obj[k]);
            }
        }
    }
    else {
        console.debug("[binding-netconf]", obj);
    }
    ;
}
//# sourceMappingURL=netconf-codec.js.map
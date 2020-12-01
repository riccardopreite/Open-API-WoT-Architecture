"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@node-wot/core");
var opcua_client_1 = require("./opcua-client");
var opcua_codec_1 = require("./codecs/opcua-codec");
var OpcuaClientFactory = (function () {
    function OpcuaClientFactory(config) {
        if (config === void 0) { config = null; }
        this.scheme = "opc.tcp";
        this.config = null;
        this.contentSerdes = core_1.ContentSerdes.get();
        this.init = function () { return true; };
        this.destroy = function () { return true; };
        this.config = config;
        this.contentSerdes.addCodec(new opcua_codec_1.default());
    }
    OpcuaClientFactory.prototype.getClient = function () {
        console.debug("[binding-opcua]", "OpcuaClientFactory creating client for '" + this.scheme + "'");
        return new opcua_client_1.default(this.config);
    };
    return OpcuaClientFactory;
}());
exports.default = OpcuaClientFactory;
//# sourceMappingURL=opcua-client-factory.js.map
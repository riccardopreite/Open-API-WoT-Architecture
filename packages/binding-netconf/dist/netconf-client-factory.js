"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var netconf_client_1 = require("./netconf-client");
var core_1 = require("@node-wot/core");
var netconf_codec_1 = require("./codecs/netconf-codec");
var NetconfClientFactory = (function () {
    function NetconfClientFactory() {
        this.scheme = "netconf";
        this.contentSerdes = core_1.ContentSerdes.get();
        this.init = function () { return true; };
        this.destroy = function () { return true; };
    }
    NetconfClientFactory.prototype.getClient = function () {
        this.contentSerdes.addCodec(new netconf_codec_1.default());
        console.debug("[binding-netconf]", "NetconfClientFactory creating client for '" + this.scheme + "'");
        return new netconf_client_1.default();
    };
    return NetconfClientFactory;
}());
exports.default = NetconfClientFactory;
//# sourceMappingURL=netconf-client-factory.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coap_client_1 = require("./coap-client");
var CoapClientFactory = (function () {
    function CoapClientFactory(server) {
        this.scheme = "coap";
        this.server = server;
    }
    CoapClientFactory.prototype.getClient = function () {
        console.debug("[binding-coap]", "CoapClientFactory creating client for '" + this.scheme + "'");
        return new coap_client_1.default(this.server);
    };
    CoapClientFactory.prototype.init = function () {
        return true;
    };
    CoapClientFactory.prototype.destroy = function () {
        return true;
    };
    return CoapClientFactory;
}());
exports.default = CoapClientFactory;
//# sourceMappingURL=coap-client-factory.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coaps_client_1 = require("./coaps-client");
var CoapsClientFactory = (function () {
    function CoapsClientFactory(proxy) {
        this.scheme = "coaps";
    }
    CoapsClientFactory.prototype.getClient = function () {
        console.debug("[binding-coap]", "CoapsClientFactory creating client for '" + this.scheme + "'");
        return new coaps_client_1.default();
    };
    CoapsClientFactory.prototype.init = function () {
        return true;
    };
    CoapsClientFactory.prototype.destroy = function () {
        return true;
    };
    return CoapsClientFactory;
}());
exports.default = CoapsClientFactory;
//# sourceMappingURL=coaps-client-factory.js.map
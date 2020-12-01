"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WssClientFactory = (function () {
    function WssClientFactory() {
        this.scheme = "wss";
    }
    WssClientFactory.prototype.getClient = function () {
        return null;
    };
    WssClientFactory.prototype.init = function () {
        return true;
    };
    WssClientFactory.prototype.destroy = function () {
        return true;
    };
    return WssClientFactory;
}());
exports.default = WssClientFactory;
//# sourceMappingURL=wss-client-factory.js.map
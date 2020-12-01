"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_client_1 = require("./ws-client");
var WebSocketClientFactory = (function () {
    function WebSocketClientFactory(proxy) {
        if (proxy === void 0) { proxy = null; }
        this.scheme = "ws";
        this.clientSideProxy = null;
        this.clientSideProxy = proxy;
    }
    WebSocketClientFactory.prototype.getClient = function () {
        console.debug("[binding-websockets]", "HttpClientFactory creating client for '" + this.scheme + "'");
        return new ws_client_1.default();
    };
    WebSocketClientFactory.prototype.init = function () {
        return true;
    };
    WebSocketClientFactory.prototype.destroy = function () {
        return true;
    };
    return WebSocketClientFactory;
}());
exports.default = WebSocketClientFactory;
//# sourceMappingURL=ws-client-factory.js.map
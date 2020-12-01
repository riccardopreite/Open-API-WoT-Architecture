"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketClient = (function () {
    function WebSocketClient() {
    }
    WebSocketClient.prototype.toString = function () {
        return "[WebSocketClient]";
    };
    WebSocketClient.prototype.readResource = function (form) {
        return new Promise(function (resolve, reject) {
        });
    };
    WebSocketClient.prototype.writeResource = function (form, content) {
        return new Promise(function (resolve, reject) {
        });
    };
    WebSocketClient.prototype.invokeResource = function (form, content) {
        return new Promise(function (resolve, reject) {
        });
    };
    WebSocketClient.prototype.unlinkResource = function (form) {
        return new Promise(function (resolve, reject) {
        });
    };
    WebSocketClient.prototype.subscribeResource = function (form, next, error, complete) {
        return null;
    };
    WebSocketClient.prototype.start = function () {
        return true;
    };
    WebSocketClient.prototype.stop = function () {
        return true;
    };
    WebSocketClient.prototype.setSecurity = function (metadata, credentials) {
        if (Array.isArray(metadata)) {
            metadata = metadata[0];
        }
        return true;
    };
    return WebSocketClient;
}());
exports.default = WebSocketClient;
//# sourceMappingURL=ws-client.js.map
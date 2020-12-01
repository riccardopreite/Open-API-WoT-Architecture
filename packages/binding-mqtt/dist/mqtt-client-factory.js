"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mqtt_client_1 = require("./mqtt-client");
var MqttClientFactory = (function () {
    function MqttClientFactory() {
        var _this = this;
        this.scheme = "mqtt";
        this.clients = [];
        this.getClient = function () {
            var client = new mqtt_client_1.default();
            _this.clients.push(client);
            return client;
        };
    }
    MqttClientFactory.prototype.init = function () {
        return true;
    };
    MqttClientFactory.prototype.destroy = function () {
        console.debug("[binding-mqtt]", "MqttClientFactory stopping all clients for '" + this.scheme + "'");
        this.clients.forEach(function (client) { return client.stop(); });
        return true;
    };
    return MqttClientFactory;
}());
exports.default = MqttClientFactory;
//# sourceMappingURL=mqtt-client-factory.js.map
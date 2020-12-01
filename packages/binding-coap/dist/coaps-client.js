"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coaps = require("node-coap-client").CoapClient;
var url = require("url");
var Subscription_1 = require("rxjs/Subscription");
var CoapsClient = (function () {
    function CoapsClient() {
    }
    CoapsClient.prototype.toString = function () {
        return "[CoapsClient]";
    };
    CoapsClient.prototype.readResource = function (form) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.generateRequest(form, "get").then(function (res) {
                console.debug("[binding-coap]", "CoapsClient received " + res.code + " from " + form.href);
                var contentType;
                if (!contentType)
                    contentType = form.contentType;
                resolve({ type: contentType, body: res.payload });
            })
                .catch(function (err) { reject(err); });
        });
    };
    CoapsClient.prototype.writeResource = function (form, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.generateRequest(form, "put", content).then(function (res) {
                console.debug("[binding-coap]", "CoapsClient received " + res.code + " from " + form.href);
                resolve();
            })
                .catch(function (err) { reject(err); });
        });
    };
    CoapsClient.prototype.invokeResource = function (form, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.generateRequest(form, "post", content).then(function (res) {
                console.debug("[binding-coap]", "CoapsClient received " + res.code + " from " + form.href);
                var contentType;
                if (!contentType)
                    contentType = form.contentType;
                resolve({ type: contentType, body: res.payload });
            })
                .catch(function (err) { reject(err); });
        });
    };
    CoapsClient.prototype.unlinkResource = function (form) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.generateRequest(form, "delete").then(function (res) {
                console.debug("[binding-coap]", "CoapsClient received " + res.code + " from " + form.href);
                console.debug("[binding-coap]", "CoapsClient received headers: " + JSON.stringify(res.format));
                resolve();
            })
                .catch(function (err) { reject(err); });
        });
    };
    CoapsClient.prototype.subscribeResource = function (form, next, error, complete) {
        var requestUri = url.parse(form.href.replace(/$coaps/, "https"));
        coaps.setSecurityParams(requestUri.hostname, this.authorization);
        coaps.observe(form.href, "get", next)
            .then(function () { })
            .catch(function (err) { error(err); });
        return new Subscription_1.Subscription(function () { coaps.stopObserving(form.href); complete(); });
    };
    CoapsClient.prototype.start = function () {
        return true;
    };
    CoapsClient.prototype.stop = function () {
        return true;
    };
    CoapsClient.prototype.setSecurity = function (metadata, credentials) {
        if (metadata === undefined || !Array.isArray(metadata) || metadata.length == 0) {
            console.warn("[binding-coap]", "CoapsClient received empty security metadata");
            return false;
        }
        var security = metadata[0];
        if (security.scheme === "psk") {
            this.authorization = { psk: {} };
            this.authorization.psk[credentials.identity] = credentials.psk;
        }
        else if (security.scheme === "apikey") {
            console.error("[binding-coap]", "CoapsClient cannot use Apikey: Not implemented");
            return false;
        }
        else {
            console.error("[binding-coap]", "CoapsClient cannot set security scheme '" + security.scheme + "'");
            console.dir(metadata);
            return false;
        }
        console.debug("[binding-coap]", "CoapsClient using security scheme '" + security.scheme + "'");
        return true;
    };
    CoapsClient.prototype.generateRequest = function (form, dflt, content) {
        var requestUri = url.parse(form.href.replace(/$coaps/, "https"));
        coaps.setSecurityParams(requestUri.hostname, this.authorization);
        var method = dflt;
        if (typeof form["coap:methodCode"] === "number") {
            console.debug("[binding-coap]", "CoapsClient got Form 'methodCode'", form["coap:methodCode"]);
            switch (form["coap:methodCode"]) {
                case 1:
                    method = "get";
                    break;
                case 2:
                    method = "post";
                    break;
                case 3:
                    method = "put";
                    break;
                case 4:
                    method = "delete";
                    break;
                default: console.warn("[binding-coap]", "CoapsClient got invalid 'methodCode', using default", method);
            }
        }
        console.debug("[binding-coap]", "CoapsClient sending " + method + " to " + form.href);
        var req = coaps.request(form.href, method, content ? content.body : undefined);
        return req;
    };
    return CoapsClient;
}());
exports.default = CoapsClient;
//# sourceMappingURL=coaps-client.js.map
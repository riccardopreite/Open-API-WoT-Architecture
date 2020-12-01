"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coap = require("coap");
var url = require("url");
var Subscription_1 = require("rxjs/Subscription");
var core_1 = require("@node-wot/core");
var CoapClient = (function () {
    function CoapClient(server) {
        this.setSecurity = function (metadata) { return true; };
        this.agent = new coap.Agent(server ? { socket: server.getSocket() } : undefined);
        coap.registerFormat(core_1.ContentSerdes.JSON_LD, 2100);
        coap.registerFormat(core_1.ContentSerdes.TD, 65100);
    }
    CoapClient.prototype.toString = function () {
        return "[CoapClient]";
    };
    CoapClient.prototype.readResource = function (form) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var req = _this.generateRequest(form, "GET");
            console.debug("[binding-coap]", "CoapClient sending " + req.statusCode + " to " + form.href);
            req.on("response", function (res) {
                console.debug("[binding-coap]", "CoapClient received " + res.code + " from " + form.href);
                console.debug("[binding-coap]", "CoapClient received Content-Format: " + res.headers["Content-Format"]);
                var contentType = res.headers["Content-Format"];
                if (!contentType)
                    contentType = form.contentType;
                resolve({ type: contentType, body: res.payload });
            });
            req.on("error", function (err) { return reject(err); });
            req.end();
        });
    };
    CoapClient.prototype.writeResource = function (form, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var req = _this.generateRequest(form, "PUT");
            console.debug("[binding-coap]", "CoapClient sending " + req.statusCode + " to " + form.href);
            req.on("response", function (res) {
                console.debug("[binding-coap]", "CoapClient received " + res.code + " from " + form.href);
                console.debug("[binding-coap]", "CoapClient received headers: " + JSON.stringify(res.headers));
                resolve();
            });
            req.on("error", function (err) { return reject(err); });
            req.setOption("Content-Format", content.type);
            req.write(content.body);
            req.end();
        });
    };
    CoapClient.prototype.invokeResource = function (form, content) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var req = _this.generateRequest(form, "POST");
            console.debug("[binding-coap]", "CoapClient sending " + req.statusCode + " to " + form.href);
            req.on("response", function (res) {
                console.debug("[binding-coap]", "CoapClient received " + res.code + " from " + form.href);
                console.debug("[binding-coap]", "CoapClient received Content-Format: " + res.headers["Content-Format"]);
                console.debug("[binding-coap]", "CoapClient received headers: " + JSON.stringify(res.headers));
                var contentType = res.headers["Content-Format"];
                resolve({ type: contentType, body: res.payload });
            });
            req.on("error", function (err) { return reject(err); });
            if (content) {
                req.setOption("Content-Format", content.type);
                req.write(content.body);
            }
            req.end();
        });
    };
    CoapClient.prototype.unlinkResource = function (form) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var req = _this.generateRequest(form, "GET", false);
            console.debug("[binding-coap]", "CoapClient sending " + req.statusCode + " to " + form.href);
            req.on("response", function (res) {
                console.debug("[binding-coap]", "CoapClient received " + res.code + " from " + form.href);
                console.debug("[binding-coap]", "CoapClient received headers: " + JSON.stringify(res.headers));
                resolve();
            });
            req.on("error", function (err) { return reject(err); });
            req.end();
        });
    };
    CoapClient.prototype.subscribeResource = function (form, next, error, complete) {
        var req = this.generateRequest(form, "GET", true);
        console.debug("[binding-coap]", "CoapClient sending " + req.statusCode + " to " + form.href);
        req.on("response", function (res) {
            console.debug("[binding-coap]", "CoapClient received " + res.code + " from " + form.href);
            console.debug("[binding-coap]", "CoapClient received Content-Format: " + res.headers["Content-Format"]);
            var contentType = res.headers["Content-Format"];
            if (!contentType)
                contentType = form.contentType;
            res.on('data', function (data) {
                next({ type: contentType, body: res.payload });
            });
        });
        req.on("error", function (err) { return error(err); });
        req.end();
        return new Subscription_1.Subscription(function () { });
    };
    CoapClient.prototype.start = function () {
        return true;
    };
    CoapClient.prototype.stop = function () {
        return true;
    };
    CoapClient.prototype.uriToOptions = function (uri) {
        var requestUri = url.parse(uri);
        var options = {
            agent: this.agent,
            hostname: requestUri.hostname,
            port: parseInt(requestUri.port, 10),
            pathname: requestUri.pathname,
            query: requestUri.query,
            observe: false,
            multicast: false,
            confirmable: true
        };
        return options;
    };
    CoapClient.prototype.generateRequest = function (form, dflt, observable) {
        if (observable === void 0) { observable = false; }
        var options = this.uriToOptions(form.href);
        options.method = dflt;
        if (typeof form["coap:methodCode"] === "number") {
            console.debug("[binding-coap]", "CoapClient got Form 'methodCode'", form["coap:methodCode"]);
            switch (form["coap:methodCode"]) {
                case 1:
                    options.method = "GET";
                    break;
                case 2:
                    options.method = "POST";
                    break;
                case 3:
                    options.method = "PUT";
                    break;
                case 4:
                    options.method = "DELETE";
                    break;
                default: console.warn("[binding-coap]", "CoapClient got invalid 'methodCode', using default", options.method);
            }
        }
        options.observe = observable;
        var req = this.agent.request(options);
        if (typeof form.contentType === "string") {
            console.debug("[binding-coap]", "CoapClient got Form 'contentType'", form.contentType);
            req.setOption("Accept", form.contentType);
        }
        if (Array.isArray(form["coap:options"])) {
            console.debug("[binding-coap]", "CoapClient got Form 'options'", form["coap:options"]);
            var options_2 = form["coap:options"];
            for (var _i = 0, options_1 = options_2; _i < options_1.length; _i++) {
                var option = options_1[_i];
                req.setOption(option["coap:optionCode"], option["coap:optionValue"]);
            }
        }
        else if (typeof form["coap:options"] === "object") {
            console.warn("[binding-coap]", "CoapClient got Form SINGLE-ENTRY 'options'", form["coap:options"]);
            var option = form["coap:options"];
            req.setHeader(option["coap:optionCode"], option["coap:optionValue"]);
        }
        return req;
    };
    return CoapClient;
}());
exports.default = CoapClient;
//# sourceMappingURL=coap-client.js.map
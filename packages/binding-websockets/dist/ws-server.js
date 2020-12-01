"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
var WebSocket = require("ws");
var TD = require("@node-wot/td-tools");
var core_1 = require("@node-wot/core");
var binding_http_1 = require("@node-wot/binding-http");
var WebSocketServer = (function () {
    function WebSocketServer(serverOrConfig) {
        if (serverOrConfig === void 0) { serverOrConfig = {}; }
        this.EVENT_DIR = "events";
        this.port = 8081;
        this.address = undefined;
        this.ownServer = true;
        this.thingNames = new Set();
        this.socketServers = {};
        if (serverOrConfig instanceof binding_http_1.HttpServer && (typeof serverOrConfig.getServer === "function")) {
            this.ownServer = false;
            this.httpServer = serverOrConfig.getServer();
            this.port = serverOrConfig.getPort();
            this.scheme = serverOrConfig.scheme === "https" ? "wss" : "ws";
        }
        else if (typeof serverOrConfig === "object") {
            var config = serverOrConfig;
            if (config.port !== undefined) {
                this.port = config.port;
            }
            if (config.address !== undefined) {
                this.address = config.address;
            }
            if (config.serverKey && config.serverCert) {
                var options = {};
                options.key = fs.readFileSync(config.serverKey);
                options.cert = fs.readFileSync(config.serverCert);
                this.scheme = "wss";
                this.httpServer = https.createServer(options);
            }
            else {
                this.scheme = "ws";
                this.httpServer = http.createServer();
            }
        }
        else {
            throw new Error("WebSocketServer constructor argument must be HttpServer, HttpConfig, or undefined");
        }
    }
    WebSocketServer.prototype.start = function (servient) {
        var _this = this;
        console.debug("[binding-websockets]", "WebSocketServer starting on " + (this.address !== undefined ? this.address + ' ' : '') + "port " + this.port);
        return new Promise(function (resolve, reject) {
            _this.httpServer.on("upgrade", function (request, socket, head) {
                var pathname = url.parse(request.url).pathname;
                var socketServer = _this.socketServers[pathname];
                if (socketServer) {
                    socketServer.handleUpgrade(request, socket, head, function (ws) {
                        socketServer.emit("connection", ws, request);
                    });
                }
                else {
                    socket.destroy();
                }
            });
            if (_this.ownServer) {
                _this.httpServer.once("error", function (err) { reject(err); });
                _this.httpServer.once("listening", function () {
                    _this.httpServer.on("error", function (err) {
                        console.error("[binding-websockets]", "WebSocketServer on port " + _this.port + " failed: " + err.message);
                    });
                    resolve();
                });
                _this.httpServer.listen(_this.port, _this.address);
            }
            else {
                resolve();
            }
        });
    };
    WebSocketServer.prototype.stop = function () {
        var _this = this;
        console.debug("[binding-websockets]", "WebSocketServer stopping on port " + this.port);
        return new Promise(function (resolve, reject) {
            for (var path in _this.socketServers) {
                _this.socketServers[path].close();
            }
            if (_this.ownServer) {
                console.debug("[binding-websockets]", "WebSocketServer stopping own HTTP server");
                _this.httpServer.once('error', function (err) { reject(err); });
                _this.httpServer.once('close', function () { resolve(); });
                _this.httpServer.close();
            }
        });
    };
    WebSocketServer.prototype.getPort = function () {
        if (this.httpServer.address() && typeof this.httpServer.address() === "object") {
            return this.httpServer.address().port;
        }
        else {
            return -1;
        }
    };
    WebSocketServer.prototype.expose = function (thing) {
        var _this = this;
        var title = thing.title;
        if (this.thingNames.has(title)) {
            title = core_1.Helpers.generateUniqueName(title);
        }
        if (this.getPort() !== -1) {
            console.debug("[binding-websockets]", "WebSocketServer on port " + this.getPort() + " exposes '" + thing.title + "' as unique '/" + title + "/*'");
            this.thingNames.add(title);
            var _loop_1 = function (eventName) {
                var path = "/" + encodeURIComponent(title) + "/" + this_1.EVENT_DIR + "/" + encodeURIComponent(eventName);
                console.debug("[binding-websockets]", "WebSocketServer on port " + this_1.getPort() + " adding socketServer for '" + path + "'");
                this_1.socketServers[path] = new WebSocket.Server({ noServer: true });
                this_1.socketServers[path].on('connection', function (ws, req) {
                    console.debug("[binding-websockets]", "WebSocketServer on port " + _this.getPort() + " received connection for '" + path + "' from " + core_1.Helpers.toUriLiteral(req.connection.remoteAddress) + ":" + req.connection.remotePort);
                    thing.subscribeEvent(eventName, function (data) {
                        var content;
                        try {
                            content = core_1.ContentSerdes.get().valueToContent(data, thing.events[eventName].data);
                        }
                        catch (err) {
                            console.warn("[binding-websockets]", "HttpServer on port " + _this.getPort() + " cannot process data for Event '" + eventName + ": " + err.message + "'");
                            ws.close(-1, err.message);
                            return;
                        }
                        switch (content.type) {
                            case "application/json":
                            case "text/plain":
                                ws.send(content.body.toString());
                                break;
                            default:
                                ws.send(content.body);
                                break;
                        }
                    })
                        .then(function () { return ws.close(0, "Completed"); })
                        .catch(function (err) { return ws.close(-1, err.message); });
                    ws.on("close", function () {
                        thing.unsubscribeEvent(eventName);
                        console.debug("[binding-websockets]", "WebSocketServer on port " + _this.getPort() + " closed connection for '" + path + "' from " + core_1.Helpers.toUriLiteral(req.connection.remoteAddress) + ":" + req.connection.remotePort);
                    });
                });
                for (var _i = 0, _a = core_1.Helpers.getAddresses(); _i < _a.length; _i++) {
                    var address = _a[_i];
                    var href = this_1.scheme + "://" + address + ":" + this_1.getPort() + path;
                    var form = new TD.Form(href, core_1.ContentSerdes.DEFAULT);
                    form.op = "subscribeevent";
                    thing.events[eventName].forms.push(form);
                    console.debug("[binding-websockets]", "WebSocketServer on port " + this_1.getPort() + " assigns '" + href + "' to Event '" + eventName + "'");
                }
            };
            var this_1 = this;
            for (var eventName in thing.events) {
                _loop_1(eventName);
            }
        }
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    return WebSocketServer;
}());
exports.default = WebSocketServer;
//# sourceMappingURL=ws-server.js.map
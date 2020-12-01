#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cli_default_servient_1 = require("./cli-default-servient");
var fs = require("fs");
var path = require("path");
var argv = process.argv.slice(2);
var defaultFile = "wot-servient.conf.json";
var baseDir = ".";
var clientOnly = false;
var flagArgConfigfile = false;
var confFile;
var debug;
var readConf = function (filename) {
    return new Promise(function (resolve, reject) {
        var open = filename ? filename : path.join(baseDir, defaultFile);
        fs.readFile(open, "utf-8", function (err, data) {
            if (err) {
                reject(err);
            }
            if (data) {
                var config = void 0;
                try {
                    config = JSON.parse(data);
                }
                catch (err) {
                    reject(err);
                }
                console.info("[cli]", "WoT-Servient using config file '" + open + "'");
                resolve(config);
            }
        });
    });
};
var runScripts = function (servient, scripts, debug) {
    return __awaiter(this, void 0, void 0, function () {
        var launchScripts, inspector, session_1;
        return __generator(this, function (_a) {
            launchScripts = function (scripts) {
                scripts.forEach(function (fname) {
                    console.info("[cli]", "WoT-Servient reading script", fname);
                    fs.readFile(fname, "utf8", function (err, data) {
                        if (err) {
                            console.error("[cli]", "WoT-Servient experienced error while reading script", err);
                        }
                        else {
                            console.info("[cli]", "WoT-Servient running script '" + data.substr(0, data.indexOf("\n")).replace("\r", "") + "'... (" + data.split(/\r\n|\r|\n/).length + " lines)");
                            fname = path.resolve(fname);
                            servient.runPrivilegedScript(data, fname);
                        }
                    });
                });
            };
            inspector = require('inspector');
            if (debug && debug.shouldBreak) {
                !inspector.url() && inspector.open(debug.port, debug.host, true);
                session_1 = new inspector.Session();
                session_1.connect();
                session_1.post("Debugger.enable", function (error) {
                    if (error) {
                        console.warn("[cli]", "Cannot set breakpoint; reason: cannot enable debugger");
                        console.warn(error);
                    }
                    session_1.post("Debugger.setBreakpointByUrl", {
                        lineNumber: 0,
                        url: "file:///" + path.resolve(scripts[0]).replace(/\\/g, '/')
                    }, function (err) {
                        if (err) {
                            console.warn("[cli]", "Cannot set breakpoint");
                            console.warn("[cli]", error);
                        }
                        launchScripts(scripts);
                    });
                });
            }
            else {
                debug && !inspector.url() && inspector.open(debug.port, debug.host, false);
                launchScripts(scripts);
            }
            return [2];
        });
    });
};
var runAllScripts = function (servient, debug) {
    fs.readdir(baseDir, function (err, files) {
        if (err) {
            console.warn("[cli]", "WoT-Servient experienced error while loading directory", err);
            return;
        }
        var scripts = files.filter(function (file) {
            return (file.substr(0, 1) !== "." && file.slice(-3) === ".js");
        });
        console.info("[cli]", "WoT-Servient using current directory with " + scripts.length + " script" + (scripts.length > 1 ? "s" : ""));
        runScripts(servient, scripts.map(function (filename) { return path.resolve(path.join(baseDir, filename)); }), debug);
    });
};
for (var i = 0; i < argv.length; i++) {
    if (flagArgConfigfile) {
        flagArgConfigfile = false;
        confFile = argv[i];
        argv.splice(i, 1);
        i--;
    }
    else if (argv[i].match(/^(-c|--clientonly|\/c)$/i)) {
        clientOnly = true;
        argv.splice(i, 1);
        i--;
    }
    else if (argv[i].match(/^(-f|--configfile|\/f)$/i)) {
        flagArgConfigfile = true;
        argv.splice(i, 1);
        i--;
    }
    else if (argv[i].match(/^(-i|-ib|--inspect(-brk)?(=([a-z]*|[\d .]*):?(\d*))?|\/i|\/ib)$/i)) {
        var matches = argv[i].match(/^(-i|-ib|--inspect(-brk)?(=([a-z]*|[\d .]*):?(\d*))?|\/i|\/ib)$/i);
        debug = {
            shouldBreak: matches[2] === "-brk" || matches[1] === "-ib" || matches[1] === "/ib",
            host: matches[4] ? matches[4] : "127.0.0.1",
            port: matches[5] ? parseInt(matches[5]) : 9229
        };
        argv.splice(i, 1);
        i--;
    }
    else if (argv[i].match(/^(-v|--version|\/c)$/i)) {
        console.log(require('@node-wot/core/package.json').version);
        process.exit(0);
    }
    else if (argv[i].match(/^(-h|--help|\/?|\/h)$/i)) {
        console.log("Usage: wot-servient [options] [SCRIPT]...\n       wot-servient\n       wot-servient examples/scripts/counter.js examples/scripts/example-event.js\n       wot-servient -c counter-client.js\n       wot-servient -f ~/mywot.conf.json examples/testthing/testthing.js\n\nRun a WoT Servient in the current directory.\nIf no SCRIPT is given, all .js files in the current directory are loaded.\nIf one or more SCRIPT is given, these files are loaded instead of the directory.\nIf the file 'wot-servient.conf.json' exists, that configuration is applied.\n\nOptions:\n  -v,  --version                   display node-wot version\n  -i,  --inspect[=[host:]port]     activate inspector on host:port (default: 127.0.0.1:9229)\n  -ib, --inspect-brk[=[host:]port] activate inspector on host:port and break at start of user script\n  -c,  --clientonly                do not start any servers\n                                   (enables multiple instances without port conflicts)\n  -f,  --configfile <file>         load configuration from specified file\n  -h,  --help                      show this help\n\nwot-servient.conf.json syntax:\n{\n    \"servient\": {\n        \"clientOnly\": CLIENTONLY,\n        \"staticAddress\": STATIC,\n        \"scriptAction\": RUNSCRIPT\n    },\n    \"http\": {\n        \"port\": HPORT,\n        \"proxy\": PROXY,\n        \"allowSelfSigned\": ALLOW\n    },\n    \"mqtt\" : {\n        \"broker\": BROKER-URL,\n        \"username\": BROKER-USERNAME,\n        \"password\": BROKER-PASSWORD,\n        \"clientId\": BROKER-UNIQUEID,\n        \"protocolVersion\": MQTT_VERSION\n    },\n    \"credentials\": {\n        THING_ID1: {\n            \"token\": TOKEN\n        },\n        THING_ID2: {\n            \"username\": USERNAME,\n            \"password\": PASSWORD\n        }\n    }\n}\n\nwot-servient.conf.json fields:\n  ---------------------------------------------------------------------------\n  All entries in the config file structure are optional\n  ---------------------------------------------------------------------------\n  CLIENTONLY      : boolean setting if no servers shall be started (default=false)\n  STATIC          : string with hostname or IP literal for static address config\n  RUNSCRIPT       : boolean to activate the 'runScript' Action (default=false)\n  HPORT           : integer defining the HTTP listening port\n  PROXY           : object with \"href\" field for the proxy URI,\n                                \"scheme\" field for either \"basic\" or \"bearer\", and\n                                corresponding credential fields as defined below\n  ALLOW           : boolean whether self-signed certificates should be allowed\n  BROKER-URL      : URL to an MQTT broker that publisher and subscribers will use\n  BROKER-UNIQUEID : unique id set by mqtt client while connecting to broker\n  MQTT_VERSION    : number indicating the MQTT protocol version to be used (3, 4, or 5)\n  THING_IDx       : string with TD \"id\" for which credentials should be configured\n  TOKEN           : string for providing a Bearer token\n  USERNAME        : string for providing a Basic Auth username\n  PASSWORD        : string for providing a Basic Auth password");
        process.exit(0);
    }
}
readConf(confFile)
    .then(function (conf) {
    return new cli_default_servient_1.default(clientOnly, conf);
})
    .catch(function (err) {
    if (err.code === "ENOENT" && !confFile) {
        console.warn("[cli]", "WoT-Servient using defaults as '" + defaultFile + "' does not exist");
        return new cli_default_servient_1.default(clientOnly);
    }
    else {
        console.error("[cli]", "WoT-Servient config file error:", err.message);
        process.exit(err.errno);
    }
})
    .then(function (servient) {
    servient.start()
        .then(function () {
        if (argv.length > 0) {
            console.info("[cli]", "WoT-Servient loading " + argv.length + " command line script" + (argv.length > 1 ? "s" : ""));
            return runScripts(servient, argv, debug);
        }
        else {
            return runAllScripts(servient, debug);
        }
    })
        .catch(function (err) {
        console.error("[cli]", "WoT-Servient cannot start:", err.message);
    });
})
    .catch(function (err) { return console.error("[cli]", "WoT-Servient main error:", err.message); });
//# sourceMappingURL=cli.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TD = require("@node-wot/td-tools");
var exposed_thing_1 = require("./exposed-thing");
var consumed_thing_1 = require("./consumed-thing");
var helpers_1 = require("./helpers");
var WoTImpl = (function () {
    function WoTImpl(srv) {
        this.srv = srv;
    }
    WoTImpl.prototype.discover = function (filter) {
        return new ThingDiscoveryImpl(filter);
    };
    WoTImpl.prototype.consume = function (td) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var thing = void 0;
                thing = TD.parseTD(JSON.stringify(td), true);
                var newThing = helpers_1.default.extend(thing, new consumed_thing_1.default(_this.srv));
                newThing.extendInteractions();
                console.debug("[core/wot-impl]", "WoTImpl consuming TD " + (newThing.id ? "'" + newThing.id + "'" : "without id") + " to instantiate ConsumedThing '" + newThing.title + "'");
                resolve(newThing);
            }
            catch (err) {
                reject(new Error("Cannot consume TD because " + err.message));
            }
        });
    };
    WoTImpl.prototype.addDefaultLanguage = function (thing) {
        if (Array.isArray(thing["@context"])) {
            var arrayContext = thing["@context"];
            var languageSet = false;
            for (var _i = 0, arrayContext_1 = arrayContext; _i < arrayContext_1.length; _i++) {
                var arrayEntry = arrayContext_1[_i];
                if (typeof arrayEntry == "object") {
                    if (arrayEntry["@language"] !== undefined) {
                        languageSet = true;
                    }
                }
            }
            if (!languageSet) {
                arrayContext.push({
                    "@language": TD.DEFAULT_CONTEXT_LANGUAGE
                });
            }
        }
    };
    WoTImpl.prototype.produce = function (td) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var newThing = void 0;
                var template = td;
                _this.addDefaultLanguage(template);
                newThing = helpers_1.default.extend(template, new exposed_thing_1.default(_this.srv));
                newThing.extendInteractions();
                console.debug("[core/servient]", "WoTImpl producing new ExposedThing '" + newThing.title + "'");
                if (_this.srv.addThing(newThing)) {
                    resolve(newThing);
                }
                else {
                    throw new Error("Thing already exists: " + newThing.title);
                }
            }
            catch (err) {
                reject(new Error("Cannot produce ExposedThing because " + err.message));
            }
        });
    };
    return WoTImpl;
}());
exports.default = WoTImpl;
var DiscoveryMethod;
(function (DiscoveryMethod) {
    DiscoveryMethod[DiscoveryMethod["any"] = 0] = "any";
    DiscoveryMethod[DiscoveryMethod["local"] = 1] = "local";
    DiscoveryMethod[DiscoveryMethod["directory"] = 2] = "directory";
    DiscoveryMethod[DiscoveryMethod["multicast"] = 3] = "multicast";
})(DiscoveryMethod = exports.DiscoveryMethod || (exports.DiscoveryMethod = {}));
var ThingDiscoveryImpl = (function () {
    function ThingDiscoveryImpl(filter) {
        this.filter = filter ? filter : null;
        this.active = false;
        this.done = false;
        this.error = new Error("not implemented");
    }
    ThingDiscoveryImpl.prototype.start = function () {
        this.active = true;
    };
    ThingDiscoveryImpl.prototype.next = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            reject(_this.error);
        });
    };
    ThingDiscoveryImpl.prototype.stop = function () {
        this.active = false;
        this.done = false;
    };
    return ThingDiscoveryImpl;
}());
exports.ThingDiscoveryImpl = ThingDiscoveryImpl;
var DataType;
(function (DataType) {
    DataType["boolean"] = "boolean";
    DataType["number"] = "number";
    DataType["integer"] = "integer";
    DataType["string"] = "string";
    DataType["object"] = "object";
    DataType["array"] = "array";
    DataType["null"] = "null";
})(DataType = exports.DataType || (exports.DataType = {}));
//# sourceMappingURL=wot-impl.js.map
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TD = require("@node-wot/td-tools");
var helpers_1 = require("./helpers");
var content_serdes_1 = require("./content-serdes");
var UriTemplate = require("uritemplate");
var Affordance;
(function (Affordance) {
    Affordance[Affordance["PropertyAffordance"] = 0] = "PropertyAffordance";
    Affordance[Affordance["ActionAffordance"] = 1] = "ActionAffordance";
    Affordance[Affordance["EventAffordance"] = 2] = "EventAffordance";
})(Affordance || (Affordance = {}));
var ConsumedThing = (function (_super) {
    __extends(ConsumedThing, _super);
    function ConsumedThing(servient) {
        var _this = _super.call(this) || this;
        _this.getServient = function () { return servient; };
        _this.getClients = (new (function () {
            function class_1() {
                var _this = this;
                this.clients = new Map();
                this.getMap = function () { return _this.clients; };
            }
            return class_1;
        }())).getMap;
        return _this;
    }
    ConsumedThing.prototype.getThingDescription = function () {
        return JSON.parse(JSON.stringify(this));
    };
    ConsumedThing.prototype.emitEvent = function (name, data) {
        console.warn("[core/consumed-thing]", "not implemented");
    };
    ConsumedThing.prototype.extendInteractions = function () {
        for (var propertyName in this.properties) {
            var newProp = helpers_1.default.extend(this.properties[propertyName], new ConsumedThingProperty(propertyName, this));
            this.properties[propertyName] = newProp;
        }
        for (var actionName in this.actions) {
            var newAction = helpers_1.default.extend(this.actions[actionName], new ConsumedThingAction(actionName, this));
            this.actions[actionName] = newAction;
        }
        for (var eventName in this.events) {
            var newEvent = helpers_1.default.extend(this.events[eventName], new ConsumedThingEvent(eventName, this));
            this.events[eventName] = newEvent;
        }
    };
    ConsumedThing.prototype.findForm = function (forms, op, affordance, schemes, idx) {
        var form = null;
        for (var _i = 0, forms_1 = forms; _i < forms_1.length; _i++) {
            var f = forms_1[_i];
            var fop = "";
            if (f.op != undefined) {
                fop = f.op;
            }
            else {
                switch (affordance) {
                    case Affordance.PropertyAffordance:
                        fop = ["readproperty", "writeproperty"];
                        break;
                    case Affordance.ActionAffordance:
                        fop = "invokeaction";
                        break;
                    case Affordance.EventAffordance:
                        fop = "subscribeevent";
                        break;
                }
            }
            if (fop.indexOf(op) != -1 && f.href.indexOf(schemes[idx] + ":") != -1) {
                form = f;
                break;
            }
        }
        return form;
    };
    ConsumedThing.prototype.ensureClientSecurity = function (client) {
        if (this.security && this.securityDefinitions && Array.isArray(this.security) && this.security.length > 0) {
            console.debug("[core/consumed-thing]", "ConsumedThing '" + this.title + "' setting credentials for " + client);
            var scs = [];
            for (var _i = 0, _a = this.security; _i < _a.length; _i++) {
                var s = _a[_i];
                var ws = this.securityDefinitions[s + ""];
                if (ws) {
                    scs.push(ws);
                }
            }
            client.setSecurity(scs, this.getServient().getCredentials(this.id));
        }
    };
    ConsumedThing.prototype.getClientFor = function (forms, op, affordance, options) {
        var _this = this;
        if (forms.length === 0) {
            throw new Error("ConsumedThing '" + this.title + "' has no links for this interaction");
        }
        var form;
        var client;
        if (options && options.formIndex) {
            console.debug("[core/consumed-thing]", "ConsumedThing '" + this.title + "' asked to use formIndex '" + options.formIndex + "'");
            if (options.formIndex >= 0 && options.formIndex < forms.length) {
                form = forms[options.formIndex];
                var scheme = helpers_1.default.extractScheme(form.href);
                if (this.getServient().hasClientFor(scheme)) {
                    console.debug("[core/consumed-thing]", "ConsumedThing '" + this.title + "' got client for '" + scheme + "'");
                    client = this.getServient().getClientFor(scheme);
                    if (!this.getClients().get(scheme)) {
                        this.ensureClientSecurity(client);
                        this.getClients().set(scheme, client);
                    }
                }
                else {
                    throw new Error("ConsumedThing '" + this.title + "' missing ClientFactory for '" + scheme + "'");
                }
            }
            else {
                throw new Error("ConsumedThing '" + this.title + "' missing formIndex '" + options.formIndex + "'");
            }
        }
        else {
            var schemes = forms.map(function (link) { return helpers_1.default.extractScheme(link.href); });
            var cacheIdx = schemes.findIndex(function (scheme) { return _this.getClients().has(scheme); });
            if (cacheIdx !== -1) {
                console.debug("[core/consumed-thing]", "ConsumedThing '" + this.title + "' chose cached client for '" + schemes[cacheIdx] + "'");
                client = this.getClients().get(schemes[cacheIdx]);
                form = this.findForm(forms, op, affordance, schemes, cacheIdx);
            }
            else {
                console.debug("[core/consumed-thing]", "ConsumedThing '" + this.title + "' has no client in cache (" + cacheIdx + ")");
                var srvIdx = schemes.findIndex(function (scheme) { return _this.getServient().hasClientFor(scheme); });
                if (srvIdx === -1)
                    throw new Error("ConsumedThing '" + this.title + "' missing ClientFactory for '" + schemes + "'");
                client = this.getServient().getClientFor(schemes[srvIdx]);
                console.debug("[core/consumed-thing]", "ConsumedThing '" + this.title + "' got new client for '" + schemes[srvIdx] + "'");
                this.ensureClientSecurity(client);
                this.getClients().set(schemes[srvIdx], client);
                form = this.findForm(forms, op, affordance, schemes, srvIdx);
            }
        }
        return { client: client, form: form };
    };
    ConsumedThing.prototype.readProperty = function (propertyName, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var tp = _this.properties[propertyName];
            if (!tp) {
                reject(new Error("ConsumedThing '" + _this.title + "' does not have property " + propertyName));
            }
            else {
                var _a = _this.getClientFor(tp.forms, "readproperty", Affordance.PropertyAffordance, options), client = _a.client, form_1 = _a.form;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable client for " + form_1.href));
                }
                else if (!form_1) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable form"));
                }
                else {
                    console.debug("[core/consumed-thing]", "ConsumedThing '" + _this.title + "' reading " + form_1.href);
                    form_1 = _this.handleUriVariables(form_1, options);
                    client.readResource(form_1).then(function (content) {
                        if (!content.type)
                            content.type = form_1.contentType;
                        try {
                            var value = content_serdes_1.default.contentToValue(content, tp);
                            resolve(value);
                        }
                        catch (_a) {
                            reject(new Error("Received invalid content from Thing"));
                        }
                    })
                        .catch(function (err) { reject(err); });
                }
            }
        });
    };
    ConsumedThing.prototype._readProperties = function (propertyNames) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            for (var _i = 0, propertyNames_1 = propertyNames; _i < propertyNames_1.length; _i++) {
                var propertyName = propertyNames_1[_i];
                promises.push(_this.readProperty(propertyName));
            }
            Promise.all(promises)
                .then(function (result) {
                var allProps = {};
                var index = 0;
                for (var _i = 0, propertyNames_2 = propertyNames; _i < propertyNames_2.length; _i++) {
                    var propertyName = propertyNames_2[_i];
                    allProps[propertyName] = result[index];
                    index++;
                }
                resolve(allProps);
            })
                .catch(function (err) {
                reject(new Error("ConsumedThing '" + _this.title + "', failed to read properties: " + propertyNames));
            });
        });
    };
    ConsumedThing.prototype.readAllProperties = function (options) {
        var propertyNames = [];
        for (var propertyName in this.properties) {
            var tp = this.properties[propertyName];
            var _a = this.getClientFor(tp.forms, "readproperty", Affordance.PropertyAffordance, options), client = _a.client, form = _a.form;
            if (form) {
                propertyNames.push(propertyName);
            }
        }
        return this._readProperties(propertyNames);
    };
    ConsumedThing.prototype.readMultipleProperties = function (propertyNames, options) {
        return this._readProperties(propertyNames);
    };
    ConsumedThing.prototype.writeProperty = function (propertyName, value, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var tp = _this.properties[propertyName];
            if (!tp) {
                reject(new Error("ConsumedThing '" + _this.title + "' does not have property " + propertyName));
            }
            else {
                var _a = _this.getClientFor(tp.forms, "writeproperty", Affordance.PropertyAffordance, options), client = _a.client, form = _a.form;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable client for " + form.href));
                }
                else if (!form) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable form"));
                }
                else {
                    console.debug("[core/consumed-thing]", "ConsumedThing '" + _this.title + "' writing " + form.href + " with '" + value + "'");
                    var content = content_serdes_1.default.valueToContent(value, tp, form.contentType);
                    form = _this.handleUriVariables(form, options);
                    client.writeResource(form, content).then(function () {
                        resolve();
                    })
                        .catch(function (err) { reject(err); });
                }
            }
        });
    };
    ConsumedThing.prototype.writeMultipleProperties = function (valueMap, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            for (var propertyName in valueMap) {
                var oValueMap = valueMap;
                promises.push(_this.writeProperty(propertyName, oValueMap[propertyName]));
            }
            Promise.all(promises)
                .then(function (result) {
                resolve();
            })
                .catch(function (err) {
                reject(new Error("ConsumedThing '" + _this.title + "', failed to write multiple propertes: " + valueMap));
            });
        });
    };
    ConsumedThing.prototype.invokeAction = function (actionName, parameter, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var ta = _this.actions[actionName];
            if (!ta) {
                reject(new Error("ConsumedThing '" + _this.title + "' does not have action " + actionName));
            }
            else {
                var _a = _this.getClientFor(ta.forms, "invokeaction", Affordance.ActionAffordance, options), client = _a.client, form_2 = _a.form;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable client for " + form_2.href));
                }
                else if (!form_2) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable form"));
                }
                else {
                    console.debug("[core/consumed-thing]", "ConsumedThing '" + _this.title + "' invoking " + form_2.href + (parameter !== undefined ? " with '" + parameter + "'" : ""));
                    var input = void 0;
                    if (parameter !== undefined) {
                        input = content_serdes_1.default.valueToContent(parameter, ta.input, form_2.contentType);
                    }
                    form_2 = _this.handleUriVariables(form_2, options);
                    client.invokeResource(form_2, input).then(function (content) {
                        if (!content.type)
                            content.type = form_2.contentType;
                        if (form_2.response) {
                            if (content.type !== form_2.response.contentType) {
                                reject(new Error("Unexpected type in response"));
                            }
                        }
                        try {
                            var value = content_serdes_1.default.contentToValue(content, ta.output);
                            resolve(value);
                        }
                        catch (_a) {
                            reject(new Error("Received invalid content from Thing"));
                        }
                    })
                        .catch(function (err) { reject(err); });
                }
            }
        });
    };
    ConsumedThing.prototype.observeProperty = function (name, listener, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var tp = _this.properties[name];
            if (!tp) {
                reject(new Error("ConsumedThing '" + _this.title + "' does not have property " + name));
            }
            else {
                var _a = _this.getClientFor(tp.forms, "observeproperty", Affordance.PropertyAffordance, options), client = _a.client, form_3 = _a.form;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable client for " + form_3.href));
                }
                else if (!form_3) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable form"));
                }
                else {
                    console.debug("[core/consumed-thing]", "ConsumedThing '" + _this.title + "' observing to " + form_3.href);
                    form_3 = _this.handleUriVariables(form_3, options);
                    return client.subscribeResource(form_3, function (content) {
                        if (!content.type)
                            content.type = form_3.contentType;
                        try {
                            var value = content_serdes_1.default.contentToValue(content, tp);
                            listener(value);
                            resolve();
                        }
                        catch (_a) {
                            reject(new Error("Received invalid content from Thing"));
                        }
                    }, function (err) {
                        reject(err);
                    }, function () {
                        resolve();
                    });
                }
            }
        });
    };
    ConsumedThing.prototype.unobserveProperty = function (name, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var tp = _this.properties[name];
            if (!tp) {
                reject(new Error("ConsumedThing '" + _this.title + "' does not have property " + name));
            }
            else {
                var _a = _this.getClientFor(tp.forms, "unobserveproperty", Affordance.PropertyAffordance, options), client = _a.client, form = _a.form;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable client for " + form.href));
                }
                else if (!form) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable form"));
                }
                else {
                    console.debug("[core/consumed-thing]", "ConsumedThing '" + _this.title + "' unobserveing to " + form.href);
                    client.unlinkResource(form);
                    resolve();
                }
            }
        });
    };
    ConsumedThing.prototype.subscribeEvent = function (name, listener, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var te = _this.events[name];
            if (!te) {
                reject(new Error("ConsumedThing '" + _this.title + "' does not have event " + name));
            }
            else {
                var _a = _this.getClientFor(te.forms, "subscribeevent", Affordance.EventAffordance, options), client = _a.client, form_4 = _a.form;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable client for " + form_4.href));
                }
                else if (!form_4) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable form"));
                }
                else {
                    console.debug("[core/consumed-thing]", "ConsumedThing '" + _this.title + "' subscribing to " + form_4.href);
                    form_4 = _this.handleUriVariables(form_4, options);
                    return client.subscribeResource(form_4, function (content) {
                        if (!content.type)
                            content.type = form_4.contentType;
                        try {
                            var value = content_serdes_1.default.contentToValue(content, te.data);
                            listener(value);
                            resolve();
                        }
                        catch (_a) {
                            reject(new Error("Received invalid content from Thing"));
                        }
                    }, function (err) {
                        reject(err);
                    }, function () {
                        resolve();
                    });
                }
            }
        });
    };
    ConsumedThing.prototype.unsubscribeEvent = function (name, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var te = _this.events[name];
            if (!te) {
                reject(new Error("ConsumedThing '" + _this.title + "' does not have event " + name));
            }
            else {
                var _a = _this.getClientFor(te.forms, "unsubscribeevent", Affordance.EventAffordance, options), client = _a.client, form = _a.form;
                if (!client) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable client for " + form.href));
                }
                else if (!form) {
                    reject(new Error("ConsumedThing '" + _this.title + "' did not get suitable form"));
                }
                else {
                    console.debug("[core/consumed-thing]", "ConsumedThing '" + _this.title + "' unsubscribing to " + form.href);
                    client.unlinkResource(form);
                    resolve();
                }
            }
        });
    };
    ConsumedThing.prototype.handleUriVariables = function (form, options) {
        var ut = UriTemplate.parse(form.href);
        var updatedHref = ut.expand(options == undefined || options.uriVariables == undefined ? {} : options.uriVariables);
        if (updatedHref != form.href) {
            var updForm = new TD.Form(updatedHref, form.contentType);
            updForm.op = form.op;
            updForm.security = form.security;
            updForm.scopes = form.scopes;
            updForm.response = form.response;
            form = updForm;
            console.debug("[core/consumed-thing]", "ConsumedThing '" + this.title + "' update form URI to " + form.href);
        }
        return form;
    };
    return ConsumedThing;
}(TD.Thing));
exports.default = ConsumedThing;
var ConsumedThingProperty = (function (_super) {
    __extends(ConsumedThingProperty, _super);
    function ConsumedThingProperty(name, thing) {
        var _this = _super.call(this) || this;
        _this.getName = function () { return name; };
        _this.getThing = function () { return thing; };
        return _this;
    }
    return ConsumedThingProperty;
}(TD.ThingProperty));
var ConsumedThingAction = (function (_super) {
    __extends(ConsumedThingAction, _super);
    function ConsumedThingAction(name, thing) {
        var _this = _super.call(this) || this;
        _this.getName = function () { return name; };
        _this.getThing = function () { return thing; };
        return _this;
    }
    return ConsumedThingAction;
}(TD.ThingAction));
var ConsumedThingEvent = (function (_super) {
    __extends(ConsumedThingEvent, _super);
    function ConsumedThingEvent(name, thing) {
        var _this = _super.call(this) || this;
        _this.getName = function () { return name; };
        _this.getThing = function () { return thing; };
        return _this;
    }
    return ConsumedThingEvent;
}(TD.ThingEvent));
//# sourceMappingURL=consumed-thing.js.map
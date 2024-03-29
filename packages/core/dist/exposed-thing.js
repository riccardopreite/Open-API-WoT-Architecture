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
var Subject_1 = require("rxjs/Subject");
var TD = require("@node-wot/td-tools");
var helpers_1 = require("./helpers");
var ExposedThing = (function (_super) {
    __extends(ExposedThing, _super);
    function ExposedThing(servient) {
        var _this = _super.call(this) || this;
        _this.getServient = function () { return servient; };
        _this.getSubjectTD = (new (function () {
            function class_1() {
                var _this = this;
                this.subjectTDChange = new Subject_1.Subject();
                this.getSubject = function () { return _this.subjectTDChange; };
            }
            return class_1;
        }())).getSubject;
        return _this;
    }
    ExposedThing.prototype.extendInteractions = function () {
        for (var propertyName in this.properties) {
            var newProp = helpers_1.default.extend(this.properties[propertyName], new ExposedThingProperty(propertyName, this));
            this.properties[propertyName] = newProp;
        }
        for (var actionName in this.actions) {
            var newAction = helpers_1.default.extend(this.actions[actionName], new ExposedThingAction(actionName, this));
            this.actions[actionName] = newAction;
        }
        for (var eventName in this.events) {
            var newEvent = helpers_1.default.extend(this.events[eventName], new ExposedThingEvent(eventName, this));
            this.events[eventName] = newEvent;
        }
    };
    ExposedThing.prototype.getThingDescription = function () {
        return JSON.parse(TD.serializeTD(this));
    };
    ExposedThing.prototype.emitEvent = function (name, data) {
        if (this.events[name]) {
            this.events[name].getState().subject.next(data);
        }
        else {
            throw new Error("NotFoundError for event '" + name + "'");
        }
    };
    ExposedThing.prototype.expose = function () {
        var _this = this;
        console.debug("[core/exposed-thing]", "ExposedThing '" + this.title + "' exposing all Interactions and TD");
        return new Promise(function (resolve, reject) {
            _this.getServient().expose(_this).then(function () {
                _this.getSubjectTD().next(_this.getThingDescription());
                resolve();
            })
                .catch(function (err) { return reject(err); });
        });
    };
    ExposedThing.prototype.destroy = function () {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    ExposedThing.prototype.setPropertyReadHandler = function (propertyName, handler) {
        console.debug("[core/exposed-thing]", "ExposedThing '" + this.title + "' setting read handler for '" + propertyName + "'");
        if (this.properties[propertyName]) {
            if (this.properties[propertyName].writeOnly) {
                throw new Error("ExposedThing '" + this.title + "' cannot set read handler for property '" + propertyName + "' due to writeOnly flag");
            }
            else {
                this.properties[propertyName].getState().readHandler = handler.bind(this.properties[propertyName].getState().scope);
            }
        }
        else {
            throw new Error("ExposedThing '" + this.title + "' has no Property '" + propertyName + "'");
        }
        return this;
    };
    ExposedThing.prototype.setPropertyWriteHandler = function (propertyName, handler) {
        console.debug("[core/exposed-thing]", "ExposedThing '" + this.title + "' setting write handler for '" + propertyName + "'");
        if (this.properties[propertyName]) {
            this.properties[propertyName].getState().writeHandler = handler.bind(this.properties[propertyName].getState().scope);
        }
        else {
            throw new Error("ExposedThing '" + this.title + "' has no Property '" + propertyName + "'");
        }
        return this;
    };
    ExposedThing.prototype.setActionHandler = function (actionName, handler) {
        console.debug("[core/exposed-thing]", "ExposedThing '" + this.title + "' setting action Handler for '" + actionName + "'");
        if (this.actions[actionName]) {
            this.actions[actionName].getState().handler = handler.bind(this.actions[actionName].getState().scope);
        }
        else {
            throw new Error("ExposedThing '" + this.title + "' has no Action '" + actionName + "'");
        }
        return this;
    };
    ExposedThing.prototype.readProperty = function (propertyName, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.properties[propertyName]) {
                if (_this.properties[propertyName].getState().readHandler != null) {
                    console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' calls registered readHandler for Property '" + propertyName + "'");
                    var ps = _this.properties[propertyName].getState();
                    ps.readHandler(options).then(function (customValue) {
                        resolve(customValue);
                    });
                }
                else {
                    console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' gets internal value '" + _this.properties[propertyName].getState().value + "' for Property '" + propertyName + "'");
                    resolve(_this.properties[propertyName].getState().value);
                }
            }
            else {
                reject(new Error("ExposedThing '" + _this.title + "', no property found for '" + propertyName + "'"));
            }
        });
    };
    ExposedThing.prototype._readProperties = function (propertyNames, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            for (var _i = 0, propertyNames_1 = propertyNames; _i < propertyNames_1.length; _i++) {
                var propertyName = propertyNames_1[_i];
                promises.push(_this.readProperty(propertyName, options));
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
                reject(new Error("ExposedThing '" + _this.title + "', failed to read properties " + propertyNames));
            });
        });
    };
    ExposedThing.prototype.readAllProperties = function (options) {
        var propertyNames = [];
        for (var propertyName in this.properties) {
            propertyNames.push(propertyName);
        }
        return this._readProperties(propertyNames, options);
    };
    ExposedThing.prototype.readMultipleProperties = function (propertyNames, options) {
        return this._readProperties(propertyNames, options);
    };
    ExposedThing.prototype.writeProperty = function (propertyName, value, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.properties[propertyName].getState().writeHandler != null) {
                var ps = _this.properties[propertyName].getState();
                var promiseOrValueOrNil = ps.writeHandler(value, options);
                if (promiseOrValueOrNil !== undefined) {
                    if (typeof promiseOrValueOrNil.then === "function") {
                        promiseOrValueOrNil.then(function (customValue) {
                            console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' write handler for Property '" + propertyName + "' sets custom value '" + customValue + "'");
                            if (_this.properties[propertyName].getState().value !== customValue) {
                                _this.properties[propertyName].getState().subject.next(customValue);
                            }
                            _this.properties[propertyName].getState().value = customValue;
                            resolve();
                        })
                            .catch(function (customError) {
                            console.warn("[core/exposed-thing]", "ExposedThing '" + _this.title + "' write handler for Property '" + propertyName + "' rejected the write with error '" + customError + "'");
                            reject(customError);
                        });
                    }
                    else {
                        console.warn("[core/exposed-thing]", "ExposedThing '" + _this.title + "' write handler for Property '" + propertyName + "' does not return promise");
                        if (_this.properties[propertyName].getState().value !== promiseOrValueOrNil) {
                            _this.properties[propertyName].getState().subject.next(promiseOrValueOrNil);
                        }
                        _this.properties[propertyName].getState().value = promiseOrValueOrNil;
                        resolve();
                    }
                }
                else {
                    console.warn("[core/exposed-thing]", "ExposedThing '" + _this.title + "' write handler for Property '" + propertyName + "' does not return custom value, using direct value '" + value + "'");
                    if (_this.properties[propertyName].getState().value !== value) {
                        _this.properties[propertyName].getState().subject.next(value);
                    }
                    _this.properties[propertyName].getState().value = value;
                    resolve();
                }
            }
            else {
                console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' directly sets Property '" + propertyName + "' to value '" + value + "'");
                if (_this.properties[propertyName].getState().value !== value) {
                    _this.properties[propertyName].getState().subject.next(value);
                }
                _this.properties[propertyName].getState().value = value;
                resolve();
            }
        });
    };
    ExposedThing.prototype.writeMultipleProperties = function (valueMap, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promises = [];
            for (var propertyName in valueMap) {
                var oValueMap = valueMap;
                promises.push(_this.writeProperty(propertyName, oValueMap[propertyName], options));
            }
            Promise.all(promises)
                .then(function (result) {
                resolve();
            })
                .catch(function (err) {
                reject(new Error("ExposedThing '" + _this.title + "', failed to read properties " + valueMap));
            });
        });
    };
    ExposedThing.prototype.invokeAction = function (actionName, parameter, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.actions[actionName]) {
                console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' has Action state of '" + actionName + "'");
                if (_this.actions[actionName].getState().handler != null) {
                    console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' calls registered handler for Action '" + actionName + "'");
                    resolve(_this.actions[actionName].getState().handler(parameter, options));
                }
                else {
                    reject(new Error("ExposedThing '" + _this.title + "' has no handler for Action '" + actionName + "'"));
                }
            }
            else {
                reject(new Error("ExposedThing '" + _this.title + "', no action found for '" + actionName + "'"));
            }
        });
    };
    ExposedThing.prototype.observeProperty = function (name, listener, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.properties[name]) {
                var next = listener;
                var error = null;
                var complete = null;
                var sub = _this.properties[name].getState().subject;
                sub.asObservable().subscribe(next, error, complete);
                console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' subscribes to property '" + name + "'");
            }
            else {
                reject(new Error("ExposedThing '" + _this.title + "', no property found for '" + name + "'"));
            }
        });
    };
    ExposedThing.prototype.unobserveProperty = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.properties[name]) {
                var sub = _this.properties[name].getState().subject;
                console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' unsubscribes from property '" + name + "'");
            }
            else {
                reject(new Error("ExposedThing '" + _this.title + "', no property found for '" + name + "'"));
            }
        });
    };
    ExposedThing.prototype.subscribeEvent = function (name, listener, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.events[name]) {
                var next = listener;
                var error = null;
                var complete = null;
                var sub = _this.events[name].getState().subject;
                sub.asObservable().subscribe(next, error, complete);
                console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' subscribes to event '" + name + "'");
            }
            else {
                reject(new Error("ExposedThing '" + _this.title + "', no event found for '" + name + "'"));
            }
        });
    };
    ExposedThing.prototype.unsubscribeEvent = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.events[name]) {
                var sub = _this.events[name].getState().subject;
                console.debug("[core/exposed-thing]", "ExposedThing '" + _this.title + "' unsubscribes from event '" + name + "'");
            }
            else {
                reject(new Error("ExposedThing '" + _this.title + "', no event found for '" + name + "'"));
            }
        });
    };
    return ExposedThing;
}(TD.Thing));
exports.default = ExposedThing;
var ExposedThingProperty = (function (_super) {
    __extends(ExposedThingProperty, _super);
    function ExposedThingProperty(name, thing) {
        var _this = _super.call(this) || this;
        _this.getName = function () { return name; };
        _this.getThing = function () { return thing; };
        _this.getState = (new (function () {
            function class_2() {
                var _this = this;
                this.state = new PropertyState();
                this.getInternalState = function () { return _this.state; };
            }
            return class_2;
        }())).getInternalState;
        _this.readOnly = false;
        _this.writeOnly = false;
        _this.observable = false;
        return _this;
    }
    return ExposedThingProperty;
}(TD.ThingProperty));
var ExposedThingAction = (function (_super) {
    __extends(ExposedThingAction, _super);
    function ExposedThingAction(name, thing) {
        var _this = _super.call(this) || this;
        _this.getName = function () { return name; };
        _this.getThing = function () { return thing; };
        _this.getState = (new (function () {
            function class_3() {
                var _this = this;
                this.state = new ActionState();
                this.getInternalState = function () { return _this.state; };
            }
            return class_3;
        }())).getInternalState;
        return _this;
    }
    return ExposedThingAction;
}(TD.ThingAction));
var ExposedThingEvent = (function (_super) {
    __extends(ExposedThingEvent, _super);
    function ExposedThingEvent(name, thing) {
        var _this = _super.call(this) || this;
        _this.getName = function () { return name; };
        _this.getThing = function () { return thing; };
        _this.getState = (new (function () {
            function class_4() {
                var _this = this;
                this.state = new EventState();
                this.getInternalState = function () { return _this.state; };
            }
            return class_4;
        }())).getInternalState;
        return _this;
    }
    return ExposedThingEvent;
}(TD.ThingEvent));
var PropertyState = (function () {
    function PropertyState(value) {
        if (value === void 0) { value = null; }
        this.value = value;
        this.subject = new Subject_1.Subject();
        this.scope = {};
        this.writeHandler = null;
        this.readHandler = null;
    }
    return PropertyState;
}());
var ActionState = (function () {
    function ActionState() {
        this.scope = {};
        this.handler = null;
    }
    return ActionState;
}());
var EventState = (function () {
    function EventState() {
        this.subject = new Subject_1.Subject();
    }
    return EventState;
}());
//# sourceMappingURL=exposed-thing.js.map
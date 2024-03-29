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
exports.DEFAULT_CONTEXT = "https://www.w3.org/2019/wot/td/v1";
exports.DEFAULT_CONTEXT_LANGUAGE = "en";
exports.DEFAULT_THING_TYPE = "Thing";
var Thing = (function () {
    function Thing() {
        this["@context"] = exports.DEFAULT_CONTEXT;
        this["@type"] = exports.DEFAULT_THING_TYPE;
        this.security = [];
        this.properties = {};
        this.actions = {};
        this.events = {};
        this.links = [];
    }
    return Thing;
}());
exports.default = Thing;
var ExpectedResponse = (function () {
    function ExpectedResponse() {
    }
    return ExpectedResponse;
}());
exports.ExpectedResponse = ExpectedResponse;
var Form = (function () {
    function Form(href, contentType) {
        this.href = href;
        if (contentType)
            this.contentType = contentType;
    }
    return Form;
}());
exports.Form = Form;
var BaseSchema = (function () {
    function BaseSchema() {
    }
    return BaseSchema;
}());
exports.BaseSchema = BaseSchema;
var ThingProperty = (function (_super) {
    __extends(ThingProperty, _super);
    function ThingProperty() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ThingProperty;
}(BaseSchema));
exports.ThingProperty = ThingProperty;
var ThingAction = (function () {
    function ThingAction() {
    }
    return ThingAction;
}());
exports.ThingAction = ThingAction;
var ThingEvent = (function () {
    function ThingEvent() {
    }
    return ThingEvent;
}());
exports.ThingEvent = ThingEvent;
//# sourceMappingURL=thing-description.js.map
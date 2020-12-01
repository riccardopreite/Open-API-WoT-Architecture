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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var td_tools_1 = require("@node-wot/td-tools");
var coap_server_1 = require("./coap-server");
exports.CoapServer = coap_server_1.default;
var coap_client_factory_1 = require("./coap-client-factory");
exports.CoapClientFactory = coap_client_factory_1.default;
var coap_client_1 = require("./coap-client");
exports.CoapClient = coap_client_1.default;
var coaps_client_factory_1 = require("./coaps-client-factory");
exports.CoapsClientFactory = coaps_client_factory_1.default;
var coaps_client_1 = require("./coaps-client");
exports.CoapsClient = coaps_client_1.default;
__export(require("./coap-server"));
__export(require("./coap-client-factory"));
__export(require("./coap-client"));
__export(require("./coaps-client-factory"));
__export(require("./coaps-client"));
var CoapForm = (function (_super) {
    __extends(CoapForm, _super);
    function CoapForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CoapForm;
}(td_tools_1.Form));
exports.CoapForm = CoapForm;
var CoapOption = (function () {
    function CoapOption() {
    }
    return CoapOption;
}());
exports.CoapOption = CoapOption;
//# sourceMappingURL=coap.js.map
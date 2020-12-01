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
var opcua_client_1 = require("./opcua-client");
exports.OpcuaClient = opcua_client_1.default;
var opcua_client_factory_1 = require("./opcua-client-factory");
exports.OpcuaClientFactory = opcua_client_factory_1.default;
var td_tools_1 = require("@node-wot/td-tools");
__export(require("./opcua"));
__export(require("./opcua-client-factory"));
var OpcuaForm = (function (_super) {
    __extends(OpcuaForm, _super);
    function OpcuaForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OpcuaForm;
}(td_tools_1.Form));
exports.OpcuaForm = OpcuaForm;
//# sourceMappingURL=opcua.js.map
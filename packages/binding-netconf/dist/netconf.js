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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetconfForm = void 0;
var netconf_client_1 = require("./netconf-client");
Object.defineProperty(exports, "NetconfClient", { enumerable: true, get: function () { return netconf_client_1.default; } });
var netconf_client_factory_1 = require("./netconf-client-factory");
Object.defineProperty(exports, "NetconfClientFactory", { enumerable: true, get: function () { return netconf_client_factory_1.default; } });
var td_tools_1 = require("@node-wot/td-tools");
__exportStar(require("./netconf"), exports);
__exportStar(require("./netconf-client-factory"), exports);
var NetconfForm = (function (_super) {
    __extends(NetconfForm, _super);
    function NetconfForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NetconfForm;
}(td_tools_1.Form));
exports.NetconfForm = NetconfForm;
//# sourceMappingURL=netconf.js.map
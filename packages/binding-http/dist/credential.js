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
var node_fetch_1 = require("node-fetch");
var Credential = (function () {
    function Credential() {
    }
    return Credential;
}());
exports.Credential = Credential;
var BasicCredential = (function (_super) {
    __extends(BasicCredential, _super);
    function BasicCredential(_a) {
        var username = _a.username, password = _a.password;
        var _this = _super.call(this) || this;
        if (username === undefined || password === undefined ||
            username === null || password === null) {
            throw new Error("No Basic credentials for Thing");
        }
        _this.username = username;
        _this.password = password;
        return _this;
    }
    BasicCredential.prototype.sign = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = request.clone();
                result.headers.set("authorization", Buffer.from(this.username + ":" + this.password).toString('base64'));
                return [2, result];
            });
        });
    };
    return BasicCredential;
}(Credential));
exports.BasicCredential = BasicCredential;
var BearerCredential = (function (_super) {
    __extends(BearerCredential, _super);
    function BearerCredential(token) {
        var _this = _super.call(this) || this;
        if (token === undefined || token === null) {
            throw new Error("No Bearer credentionals for Thing");
        }
        _this.token = token;
        return _this;
    }
    BearerCredential.prototype.sign = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = request.clone();
                result.headers.set("authorization", "Bearer " + this.token);
                return [2, result];
            });
        });
    };
    return BearerCredential;
}(Credential));
exports.BearerCredential = BearerCredential;
var BasicKeyCredential = (function (_super) {
    __extends(BasicKeyCredential, _super);
    function BasicKeyCredential(apiKey, options) {
        var _this = _super.call(this) || this;
        if (apiKey === undefined || apiKey === null) {
            throw new Error("No API key credentials for Thing");
        }
        _this.apiKey = apiKey;
        _this.options = options;
        return _this;
    }
    BasicKeyCredential.prototype.sign = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var result, headerName;
            return __generator(this, function (_a) {
                result = request.clone();
                headerName = "authorization";
                if (this.options.in === "header" && this.options.name !== undefined) {
                    headerName = this.options.name;
                }
                result.headers.append(headerName, this.apiKey);
                return [2, result];
            });
        });
    };
    return BasicKeyCredential;
}(Credential));
exports.BasicKeyCredential = BasicKeyCredential;
var OAuthCredential = (function (_super) {
    __extends(OAuthCredential, _super);
    function OAuthCredential(token, refresh) {
        var _this = _super.call(this) || this;
        _this.token = token;
        _this.refresh = refresh;
        _this.token = token;
        return _this;
    }
    OAuthCredential.prototype.sign = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenRequest, _a, tempRequest, mergeHeaders, useNewURL;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.token instanceof Promise)) return [3, 2];
                        tokenRequest = this.token;
                        _a = this;
                        return [4, tokenRequest];
                    case 1:
                        _a.token = _b.sent();
                        _b.label = 2;
                    case 2:
                        tempRequest = { url: request.url, headers: {} };
                        tempRequest = this.token.sign(tempRequest);
                        mergeHeaders = new node_fetch_1.Request(request, tempRequest);
                        useNewURL = new node_fetch_1.Request(tempRequest.url, mergeHeaders);
                        return [2, useNewURL];
                }
            });
        });
    };
    OAuthCredential.prototype.refreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.token instanceof Promise) {
                            throw new Error("Uninitialized token. You have to call sing before refresh");
                        }
                        if (!this.refresh) return [3, 2];
                        return [4, this.refresh()];
                    case 1:
                        newToken = _a.sent();
                        return [3, 4];
                    case 2: return [4, this.token.refresh()];
                    case 3:
                        newToken = _a.sent();
                        _a.label = 4;
                    case 4: return [2, new OAuthCredential(newToken, this.refresh)];
                }
            });
        });
    };
    return OAuthCredential;
}(Credential));
exports.OAuthCredential = OAuthCredential;
//# sourceMappingURL=credential.js.map
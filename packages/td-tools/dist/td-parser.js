"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TD = require("./thing-description");
var isAbsoluteUrl = require('is-absolute-url');
var URLToolkit = require('url-toolkit');
function parseTD(td, normalize) {
    console.debug("[td-tools/td-parser]", "parseTD() parsing\n```\n" + td + "\n```");
    var thing = JSON.parse(td.replace(/^\uFEFF/, ''));
    if (thing["@context"] === undefined) {
        thing["@context"] = [TD.DEFAULT_CONTEXT];
    }
    else if (Array.isArray(thing["@context"])) {
        var semContext = thing["@context"];
        if (semContext.indexOf(TD.DEFAULT_CONTEXT) === -1) {
            semContext.push(TD.DEFAULT_CONTEXT);
        }
    }
    else if (thing["@context"] !== TD.DEFAULT_CONTEXT) {
        var semContext = thing["@context"];
        thing["@context"] = [semContext, TD.DEFAULT_CONTEXT];
    }
    addDefaultLanguage(thing);
    if (thing["@type"] === undefined) {
        thing["@type"] = TD.DEFAULT_THING_TYPE;
    }
    else if (Array.isArray(thing["@type"])) {
        var semTypes = thing["@type"];
        if (semTypes.indexOf(TD.DEFAULT_THING_TYPE) === -1) {
            semTypes.unshift(TD.DEFAULT_THING_TYPE);
        }
    }
    else if (thing["@type"] !== TD.DEFAULT_THING_TYPE) {
        var semType = thing["@type"];
        thing["@type"] = [TD.DEFAULT_THING_TYPE, semType];
    }
    if (thing.properties !== undefined && thing.properties instanceof Object) {
        for (var propName in thing.properties) {
            var prop = thing.properties[propName];
            if (prop.readOnly === undefined || typeof prop.readOnly !== "boolean") {
                prop.readOnly = false;
            }
            if (prop.writeOnly === undefined || typeof prop.writeOnly !== "boolean") {
                prop.writeOnly = false;
            }
            if (prop.observable == undefined || typeof prop.observable !== "boolean") {
                prop.observable = false;
            }
        }
    }
    if (thing.actions !== undefined && thing.actions instanceof Object) {
        for (var actName in thing.actions) {
            var act = thing.actions[actName];
            if (act.safe === undefined || typeof act.safe !== "boolean") {
                act.safe = false;
            }
            if (act.idempotent === undefined || typeof act.idempotent !== "boolean") {
                act.idempotent = false;
            }
        }
    }
    if (typeof thing.properties !== 'object' || thing.properties === null) {
        thing.properties = {};
    }
    if (typeof thing.actions !== 'object' || thing.actions === null) {
        thing.actions = {};
    }
    if (typeof thing.events !== 'object' || thing.events === null) {
        thing.events = {};
    }
    if (thing.security === undefined) {
        console.warn("[td-tools/td-parser]", "parseTD() found no security metadata");
    }
    if (typeof thing.security === "string") {
        thing.security = [thing.security];
    }
    var allForms = [];
    var interactionPatterns = {
        properties: "Property",
        actions: "Action",
        events: "Event"
    };
    for (var pattern in interactionPatterns) {
        for (var interaction in thing[pattern]) {
            if (!thing[pattern][interaction].hasOwnProperty("forms"))
                throw new Error(interactionPatterns[pattern] + " '" + interaction + "' has no forms field");
            if (!Array.isArray(thing[pattern][interaction].forms))
                thing[pattern][interaction].forms = [thing[pattern][interaction].forms];
            for (var _i = 0, _a = thing[pattern][interaction].forms; _i < _a.length; _i++) {
                var form = _a[_i];
                if (!form.hasOwnProperty("href"))
                    throw new Error("Form of " + interactionPatterns[pattern] + " '" + interaction + "' has no href field");
                if (!isAbsoluteUrl(form.href) && !thing.hasOwnProperty("base"))
                    throw new Error("Form of " + interactionPatterns[pattern] + " '" + interaction + "' has relative URI while TD has no base field");
                allForms.push(form);
            }
        }
    }
    if (thing.hasOwnProperty("base")) {
        if (normalize === undefined || normalize === true) {
            console.debug("[td-tools/td-parser]", "parseTD() normalizing 'base' into 'forms'");
            for (var _b = 0, allForms_1 = allForms; _b < allForms_1.length; _b++) {
                var form = allForms_1[_b];
                if (!form.href.match(/^([a-z0-9\+-\.]+\:).+/i)) {
                    console.debug("[td-tools/td-parser]", "parseTDString() applying base '" + thing.base + "' to '" + form.href + "'");
                    form.href = URLToolkit.buildAbsoluteURL(thing.base, form.href);
                }
            }
        }
    }
    return thing;
}
exports.parseTD = parseTD;
function addDefaultLanguage(thing) {
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
}
function serializeTD(thing) {
    var copy = JSON.parse(JSON.stringify(thing));
    if (!copy.security || copy.security.length === 0) {
        copy.securityDefinitions = {
            "nosec_sc": { "scheme": "nosec" }
        };
        copy.security = ["nosec_sc"];
    }
    if (copy.forms && copy.forms.length === 0) {
        delete copy.forms;
    }
    if (copy.properties && Object.keys(copy.properties).length === 0) {
        delete copy.properties;
    }
    else if (copy.properties) {
        for (var propName in copy.properties) {
            var prop = copy.properties[propName];
            if (prop.readOnly === undefined || typeof prop.readOnly !== "boolean") {
                prop.readOnly = false;
            }
            if (prop.writeOnly === undefined || typeof prop.writeOnly !== "boolean") {
                prop.writeOnly = false;
            }
            if (prop.observable == undefined || typeof prop.observable !== "boolean") {
                prop.observable = false;
            }
        }
    }
    if (copy.actions && Object.keys(copy.actions).length === 0) {
        delete copy.actions;
    }
    else if (copy.actions) {
        for (var actName in copy.actions) {
            var act = copy.actions[actName];
            if (act.idempotent === undefined || typeof act.idempotent !== "boolean") {
                act.idempotent = false;
            }
            if (act.safe === undefined || typeof act.safe !== "boolean") {
                act.safe = false;
            }
        }
    }
    if (copy.events && Object.keys(copy.events).length === 0) {
        delete copy.events;
    }
    if (copy.links && copy.links.length === 0) {
        delete copy.links;
    }
    var td = JSON.stringify(copy);
    return td;
}
exports.serializeTD = serializeTD;
//# sourceMappingURL=td-parser.js.map
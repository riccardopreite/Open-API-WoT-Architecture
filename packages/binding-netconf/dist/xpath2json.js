"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLeaves = exports.xpath2json = exports.json2xpath = exports.isObject = void 0;
var util = require('util');
function isObject(a) {
    return (!!a) && (a.constructor === Object);
}
exports.isObject = isObject;
;
function json2xpath(json, index, str) {
    if (!(isObject(json))) {
        return str;
    }
    var keys = Object.keys(json);
    for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        if (key === '$') {
            var tmp = json[key].xmlns;
            var ns = tmp.split(":")[tmp.split(":").length - 1];
            str.splice(index - 3, 0, ns + ":");
            index++;
            continue;
        }
        else if (json[key] && !isObject(json[key])) {
            var val = json[key];
            if (j == 0) {
                str.pop();
            }
            str.push("[");
            str.push(key);
            str.push("=");
            str.push("\"");
            str.push(val);
            str.push("\"");
            str.push("]");
            continue;
        }
        str.push(key);
        str.push('/');
        index++;
        str = json2xpath(json[key], index, str);
    }
    return str;
}
exports.json2xpath = json2xpath;
function xpath2json(xpath, NSs) {
    var _a, _b;
    var subStrings = xpath.split('/');
    var obj = {};
    var tmp_obj = {};
    for (var i = subStrings.length - 1; i > -1; i--) {
        var sub = subStrings[i];
        if (sub === '') {
            continue;
        }
        var root_ns = null;
        var key = null;
        ;
        tmp_obj = {};
        var reg = /\[(.*?)\]/g;
        if (sub.replace(reg, '').split(":").length > 1 && i == 1) {
            root_ns = sub.replace(reg, '').split(":")[0];
            key = sub.replace(reg, '').split(":")[1];
            sub = sub.replace(root_ns + ':', '');
            var $ = {};
            if (!(root_ns in NSs)) {
                throw new Error("Namespace for " + root_ns + " not specified in the TD");
            }
            $.xmlns = NSs[root_ns];
            tmp_obj[key] = {};
            tmp_obj[key].$ = $;
        }
        if (sub.match(reg)) {
            var values = sub.match(reg);
            sub = sub.replace(/\[[^\]]*\]/g, '');
            if (!tmp_obj[sub]) {
                tmp_obj[sub] = {};
            }
            for (var j = 0; j < values.length; j++) {
                var val = values[j];
                val = val.replace(/[\[\]']+/g, '');
                key = val.split("=")[0];
                val = val.split("=")[1];
                val = val.replace(/['"]+/g, '');
                tmp_obj[sub][key] = val;
                if (val.split("\\:").length > 1 && i > 1) {
                    var ns_key = val.split("\\:")[0];
                    val = val.replace(/[\\]+/g, '');
                    if (!(ns_key in NSs)) {
                        throw new Error("Namespace for " + ns_key + " not specified in the TD");
                    }
                    var ns = NSs[ns_key];
                    var xmlns_key = "xmlns:" + ns_key;
                    tmp_obj[sub][key] = { "$": (_a = {}, _a[xmlns_key] = ns, _a), "_": val };
                }
            }
        }
        if (sub.split(":").length > 1 && i > 1) {
            var ns_key = sub.split(":")[0];
            val = sub.split(':')[1];
            if (!(sub in tmp_obj)) {
                tmp_obj[val] = {};
            }
            else {
                var newObject = {};
                delete Object.assign(newObject, tmp_obj, (_b = {}, _b[val] = tmp_obj[sub], _b))[sub];
                tmp_obj = newObject;
            }
            sub = val;
            tmp_obj[sub].$ = {};
            if (!(ns_key in NSs)) {
                throw new Error("Namespace for " + ns_key + " not specified in the TD");
            }
            tmp_obj[sub].$.xmlns = NSs[ns_key];
        }
        if (!tmp_obj[sub]) {
            tmp_obj[sub] = {};
        }
        tmp_obj[sub] = Object.assign(tmp_obj[sub], obj);
        obj = tmp_obj;
    }
    return obj;
}
exports.xpath2json = xpath2json;
function addLeaves(xpath, payload) {
    if (!(this.isObject(payload))) {
        return xpath;
    }
    var json_string = json2xpath(payload, 0, []);
    var json_xpath = json_string.join('');
    if (xpath.split('/').length > 2) {
        var last_el = xpath.split('/').splice(-1, 1);
        xpath = xpath.replace('/' + last_el[0], '');
    }
    return xpath + json_xpath;
}
exports.addLeaves = addLeaves;
//# sourceMappingURL=xpath2json.js.map
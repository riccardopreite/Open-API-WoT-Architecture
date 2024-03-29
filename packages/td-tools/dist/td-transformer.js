"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transformTDV1StringToV2String(td1) {
    var td2 = JSON.parse(td1);
    console.debug("[td-tools/td-transformer]", 'NO TD MODIFICATIONS DONE YET!!!!!');
    return td2;
}
exports.transformTDV1StringToV2String = transformTDV1StringToV2String;
function transformTDV1ObjToV2Obj(td1) {
    return transformTDV1StringToV2String(JSON.stringify(td1));
}
exports.transformTDV1ObjToV2Obj = transformTDV1ObjToV2Obj;
function transformTDV2StringToV1String(td2) {
    var td1 = JSON.parse(td2);
    if (td1['base'] != null) {
        td1['uris'] = [];
        td1['uris'].push(td1['base']);
        delete td1['base'];
    }
    if (td1['interactions'] != null && Array.isArray(td1['interactions'])) {
        for (var _i = 0, _a = td1['interactions']; _i < _a.length; _i++) {
            var inter = _a[_i];
            if (inter['@type'] != null && Array.isArray(inter['@type'])) {
                if (inter['@type'].indexOf('Property') >= 0) {
                    if (td1['properties'] == null) {
                        td1['properties'] = [];
                    }
                    td1['properties'].push(inter);
                    if (inter['outputData'] != null && inter['outputData']['valueType'] != null) {
                        inter['valueType'] = inter['outputData']['valueType'];
                        delete inter['outputData'];
                    }
                    fixLinksV2toHrefsEncodingsV1(td1, inter);
                }
                if (inter['@type'].indexOf('Action') >= 0) {
                    if (td1['actions'] == null) {
                        td1['actions'] = [];
                    }
                    td1['actions'].push(inter);
                    fixLinksV2toHrefsEncodingsV1(td1, inter);
                }
                if (inter['@type'].indexOf('Event') >= 0) {
                    if (td1['events'] == null) {
                        td1['events'] = [];
                    }
                    td1['events'].push(inter);
                    if (inter['outputData'] != null && inter['outputData']['valueType'] != null) {
                        inter['valueType'] = inter['outputData']['valueType'];
                        delete inter['outputData'];
                    }
                    fixLinksV2toHrefsEncodingsV1(td1, inter);
                }
            }
        }
        delete td1['interactions'];
    }
    return td1;
}
exports.transformTDV2StringToV1String = transformTDV2StringToV1String;
function fixLinksV2toHrefsEncodingsV1(td1, inter) {
    if (inter['links'] != null && Array.isArray(inter['links'])) {
        for (var _i = 0, _a = inter['links']; _i < _a.length; _i++) {
            var link = _a[_i];
            if (inter['hrefs'] == null) {
                inter['hrefs'] = [];
            }
            inter['hrefs'].push(link['href']);
            if (td1['encodings'] == null) {
                td1['encodings'] = [];
            }
            if (td1['encodings'].indexOf(link['mediaType']) < 0) {
                td1['encodings'].push(link['mediaType']);
            }
        }
        delete inter['links'];
    }
}
function transformTDV2ObjToV1Obj(td2) {
    return transformTDV2StringToV1String(JSON.stringify(td2));
}
exports.transformTDV2ObjToV1Obj = transformTDV2ObjToV1Obj;
function transformTDV3StringToV1String(td3) {
    var td1 = JSON.parse(td3);
    if (td1['base'] != null) {
        td1['uris'] = [];
        td1['uris'].push(td1['base']);
        delete td1['base'];
    }
    if (td1['interaction'] != null && Array.isArray(td1['interaction'])) {
        for (var _i = 0, _a = td1['interaction']; _i < _a.length; _i++) {
            var inter = _a[_i];
            if (inter['@type'] != null && Array.isArray(inter['@type'])) {
                if (inter['@type'].indexOf('Property') >= 0) {
                    if (td1['properties'] == null) {
                        td1['properties'] = [];
                    }
                    td1['properties'].push(inter);
                    if (inter['outputData'] != null) {
                        inter['valueType'] = inter['outputData'];
                        delete inter['outputData'];
                    }
                    fixLinksV3toHrefsEncodingsV1(td1, inter);
                }
                if (inter['@type'].indexOf('Action') >= 0) {
                    if (td1['actions'] == null) {
                        td1['actions'] = [];
                    }
                    td1['actions'].push(inter);
                    if (inter['outputData'] != null && inter['outputData']['type'] != null) {
                        inter['outputData']['valueType'] = {};
                        inter['outputData']['valueType']['type'] = inter['outputData']['type'];
                        delete inter['outputData']['type'];
                    }
                    if (inter['inputData'] != null && inter['inputData']['type'] != null) {
                        inter['inputData']['valueType'] = {};
                        inter['inputData']['valueType']['type'] = inter['inputData']['type'];
                        delete inter['inputData']['type'];
                    }
                    fixLinksV3toHrefsEncodingsV1(td1, inter);
                }
                if (inter['@type'].indexOf('Event') >= 0) {
                    if (td1['events'] == null) {
                        td1['events'] = [];
                    }
                    td1['events'].push(inter);
                    if (inter['outputData'] != null) {
                        inter['valueType'] = inter['outputData'];
                        delete inter['outputData'];
                    }
                    fixLinksV3toHrefsEncodingsV1(td1, inter);
                }
            }
        }
        delete td1['interaction'];
    }
    return td1;
}
exports.transformTDV3StringToV1String = transformTDV3StringToV1String;
function transformTDV3ObjToV1Obj(td3) {
    return transformTDV3StringToV1String(JSON.stringify(td3));
}
exports.transformTDV3ObjToV1Obj = transformTDV3ObjToV1Obj;
function fixLinksV3toHrefsEncodingsV1(td1, inter) {
    if (inter['link'] != null && Array.isArray(inter['link'])) {
        for (var _i = 0, _a = inter['link']; _i < _a.length; _i++) {
            var link = _a[_i];
            if (inter['hrefs'] == null) {
                inter['hrefs'] = [];
            }
            inter['hrefs'].push(link['href']);
            if (td1['encodings'] == null) {
                td1['encodings'] = [];
            }
            if (td1['encodings'].indexOf(link['mediaType']) < 0) {
                td1['encodings'].push(link['mediaType']);
            }
        }
        delete inter['links'];
    }
}
//# sourceMappingURL=td-transformer.js.map
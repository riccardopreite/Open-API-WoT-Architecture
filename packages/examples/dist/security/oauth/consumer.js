Object.defineProperty(exports, "__esModule", { value: true });
/********************************************************************************
 * Copyright (c) 2018 - 2020 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the W3C Software Notice and
 * Document License (2015-05-13) which is available at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document.
 *
 * SPDX-License-Identifier: EPL-2.0 OR W3C-20150513
 ********************************************************************************/
require("wot-typescript-definitions");
let WoT;
let WoTHelpers;
WoTHelpers.fetch("http://localhost:8080/OAuth").then(td => {
    //Call oAuth server instead of the servient.
    td.actions.sayOk.forms[0].href = "https://localhost:3000/resource";
    td.actions.sayOk.forms[0]["htv:methodName"] = "GET";
    WoT.consume(td).then(async (thing) => {
        const result = await thing.invokeAction("sayOk");
        console.log("oAuth token was", result);
    });
});

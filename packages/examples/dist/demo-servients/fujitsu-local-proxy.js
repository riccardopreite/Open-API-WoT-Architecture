/********************************************************************************
 * Copyright (c) 2018 - 2019 Contributors to the Eclipse Foundation
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
Object.defineProperty(exports, "__esModule", { value: true });
// node-wot implementation of W3C WoT Servient 
const core_1 = require("@node-wot/core");
// exposed protocols
const binding_fujitsu_1 = require("@node-wot/binding-fujitsu");
const binding_http_1 = require("@node-wot/binding-http");
// consuming protocols
const binding_coap_1 = require("@node-wot/binding-coap");
const binding_file_1 = require("@node-wot/binding-file");
let servient = new core_1.Servient();
servient.addServer(new binding_http_1.HttpServer());
servient.addServer(new binding_fujitsu_1.FujitsuServer("ws://wot.f-ncs.ad.jp/websocket/"));
servient.addClientFactory(new binding_coap_1.CoapClientFactory());
servient.addClientFactory(new binding_file_1.FileClientFactory());
// get WoT object for privileged script
servient.start().then(async (WoT) => {
    console.info("FujitsuLocalProxy started");
    WoT.produce({
        id: "urn:dev:wot:siemens:festofake",
        title: "FestoFake"
    })
        .then((thing) => {
        if (thing instanceof core_1.ExposedThing) {
            let exposedThing = thing;
            console.info(exposedThing.title + " produced");
            exposedThing.addProperty("PumpStatus", { type: "boolean", readOnly: true }, false);
            exposedThing.addProperty("ValveStatus", { type: "boolean", readOnly: true }, false);
            // upper tank (102)
            exposedThing.addProperty("Tank102LevelValue", { type: "number", readOnly: true }, 0.0);
            exposedThing.addProperty("Tank102OverflowStatus", { type: "boolean", readOnly: true }, false);
            // lower tank (101)
            exposedThing.addProperty("Tank101MaximumLevelStatus", { type: "boolean", readOnly: true }, false);
            exposedThing.addProperty("Tank101MinimumLevelStatus", { type: "boolean", readOnly: true }, false);
            exposedThing.addProperty("Tank101OverflowStatus", { type: "boolean", readOnly: true }, false);
            // actuators
            exposedThing.addAction("StartPump", {}, () => {
                return new Promise((resolve, reject) => {
                    console.warn(">>> Startung pump!");
                    resolve();
                });
            });
            exposedThing.addAction("StopPump", {}, () => {
                return new Promise((resolve, reject) => {
                    console.warn(">>> Stopping pump!");
                    resolve();
                });
            });
            exposedThing.addAction("OpenValve", {}, () => {
                return new Promise((resolve, reject) => {
                    console.warn(">>> Opening valve!");
                    resolve();
                });
            });
            exposedThing.addAction("CloseValve", {}, () => {
                return new Promise((resolve, reject) => {
                    console.warn(">>> Closing valve!");
                    resolve();
                });
            });
            exposedThing.expose()
                .then(() => { console.info(exposedThing.name + " ready"); })
                .catch((err) => { console.error("Expose error: " + err); });
        }
    });
}).catch(err => { console.error("Servient start error: " + err); });

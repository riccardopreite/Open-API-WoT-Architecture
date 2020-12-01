#!/usr/bin/env node
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
const binding_http_1 = require("@node-wot/binding-http");
// exposed protocols
const binding_coap_1 = require("@node-wot/binding-coap");
// tools
const net = require('net');
// the UnicornHat API daemon listens on a Unix socket at /var/run/mysocket
const client = net.createConnection('/var/run/unicornd.socket');
client.on('connect', () => { main(); });
client.on('error', (err) => { console.error('unicornd error: ' + err.message); });
client.on('data', (data) => { console.debug('unicornd data: ' + data.toString()); });
let unicorn;
let gradient;
let gradientTimer;
let gradIndex = 0;
let gradNow;
let gradNext;
let gradVector;
// main logic after connecting to UnicornHat daemon
function main() {
    // init hardware
    setBrightness(100);
    setAll(0, 0, 0);
    console.info("UnicornHAT initilized");
    let servient = new core_1.Servient();
    servient.addServer(new binding_http_1.HttpServer());
    servient.addServer(new binding_coap_1.CoapServer());
    // get WoT object for privileged script
    servient.start().then((myWoT) => {
        console.info("RaspberryServient started");
        try {
            let template = { name: "Unicorn" };
            myWoT.produce(template)
                .then((thing) => {
                if (thing instanceof core_1.ExposedThing) {
                    let unicorn = thing;
                    unicorn
                        .addProperty("brightness", {
                        type: "integer",
                        minimum: 0,
                        maximum: 255
                    }, 100)
                        .setPropertyWriteHandler("brightness", (value) => {
                        return new Promise((resolve, reject) => {
                            setBrightness(value);
                            resolve(value);
                        });
                    });
                    unicorn.addProperty("color", {
                        type: "object",
                        properties: {
                            r: { type: "integer", minimum: 0, maximum: 255 },
                            g: { type: "integer", minimum: 0, maximum: 255 },
                            b: { type: "integer", minimum: 0, maximum: 255 },
                        }
                    }, { r: 0, g: 0, b: 0 })
                        .setPropertyWriteHandler("color", (value) => {
                        return new Promise((resolve, reject) => {
                            if (typeof value !== "object") {
                                reject(new Error("color" + " requires application/json"));
                            }
                            else {
                                setAll(value.r, value.g, value.b);
                                resolve(value);
                            }
                        });
                    });
                    unicorn.addAction("gradient", {
                        input: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    r: { type: "integer", minimum: 0, maximum: 255 },
                                    g: { type: "integer", minimum: 0, maximum: 255 },
                                    b: { type: "integer", minimum: 0, maximum: 255 },
                                }
                            },
                            "minItems": 2
                        }
                    }, (input) => {
                        return new Promise((resolve, reject) => {
                            if (input.length < 2) {
                                return '{ "minItems": 2 }';
                            }
                            unicorn.invokeAction('cancel');
                            gradient = input;
                            gradIndex = 0;
                            gradNow = gradient[0];
                            gradNext = gradient[1];
                            gradVector = {
                                r: (gradNext.r - gradNow.r) / 20,
                                g: (gradNext.g - gradNow.g) / 20,
                                b: (gradNext.b - gradNow.b) / 20
                            };
                            gradientTimer = setInterval(gradientStep, 50);
                            resolve(true);
                        });
                    })
                        .addAction("forceColor", {
                        input: {
                            type: "object",
                            properties: {
                                r: { type: "integer", minimum: 0, maximum: 255 },
                                g: { type: "integer", minimum: 0, maximum: 255 },
                                b: { type: "integer", minimum: 0, maximum: 255 }
                            }
                        }
                    }, (input) => {
                        return new Promise((resolve, reject) => {
                            unicorn.invokeAction('cancel');
                            unicorn.writeProperty('color', input);
                            resolve();
                        });
                    })
                        .addAction("cancel", {}, () => {
                        return new Promise((resolve, reject) => {
                            if (gradientTimer) {
                                console.info('>> canceling timer');
                                clearInterval(gradientTimer);
                                gradientTimer = null;
                            }
                            resolve();
                        });
                    });
                    unicorn.expose().then(() => { console.info(unicorn.name + " ready"); });
                }
            });
        }
        catch (err) {
            console.error("Unicorn setup error: " + err);
        }
    }).catch((err) => {
        console.error("Servient start error: " + err);
    });
}
// helpers
function roundColor(color) {
    return { r: Math.round(color.r), g: Math.round(color.g), b: Math.round(color.b) };
}
function gradientStep() {
    gradNow = {
        r: (gradNow.r + gradVector.r),
        g: (gradNow.g + gradVector.g),
        b: (gradNow.b + gradVector.b)
    };
    unicorn.writeProperty('color', roundColor(gradNow));
    if (gradNow.r === gradNext.r && gradNow.g === gradNext.g && gradNow.b === gradNext.b) {
        gradNow = gradient[gradIndex];
        gradIndex = ++gradIndex % gradient.length;
        gradNext = gradient[gradIndex];
        console.debug('> step new index ' + gradIndex);
        gradVector = {
            r: (gradNext.r - gradNow.r) / 20,
            g: (gradNext.g - gradNow.g) / 20,
            b: (gradNext.b - gradNow.b) / 20
        };
    }
}
function setBrightness(val) {
    if (!client) {
        console.error('not connected');
        return;
    }
    client.write(Buffer.from([0, val, 3]));
}
function setPixel(x, y, r, g, b) {
    if (!client) {
        console.error('not connected');
        return;
    }
    client.write(Buffer.from([1, x, y, g, r, b]));
}
function show() {
    if (!client) {
        console.error('not connected');
        return;
    }
    client.write(Buffer.from([3]));
}
function setAll(r, g, b) {
    if (!client) {
        console.error('not connected');
        return;
    }
    let all = [2];
    for (let i = 0; i < 64; ++i) {
        all.push(g);
        all.push(r);
        all.push(b);
    }
    all.push(3);
    client.write(Buffer.from(all));
}

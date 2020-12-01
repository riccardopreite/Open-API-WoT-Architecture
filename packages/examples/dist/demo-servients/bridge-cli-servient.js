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
// protocols used
const binding_http_1 = require("@node-wot/binding-http");
const binding_fujitsu_1 = require("@node-wot/binding-fujitsu");
const binding_oracle_1 = require("@node-wot/binding-oracle");
const binding_file_1 = require("@node-wot/binding-file");
const binding_http_2 = require("@node-wot/binding-http");
const binding_http_3 = require("@node-wot/binding-http");
const binding_coap_1 = require("@node-wot/binding-coap");
const binding_coap_2 = require("@node-wot/binding-coap");
class BridgeServient extends core_1.Servient {
    constructor(password, config) {
        super();
        // init config
        this.config = (typeof config === "object") ? config : BridgeServient.defaultConfig;
        if (!this.config.http)
            this.config.http = BridgeServient.defaultConfig.http;
        // load credentials from config
        this.addCredentials(this.config.credentials);
        // remove secrets from original for displaying config (already added)
        if (this.config.credentials)
            delete this.config.credentials;
        // display
        console.info("BridgeServient configured with");
        console.dir(this.config);
        // http server for local control and monitoring
        let httpServer = (typeof this.config.http.port === "number") ? new binding_http_1.HttpServer(this.config.http.port) : new binding_http_1.HttpServer();
        this.addServer(httpServer);
        // remote proxy bridges
        if (this.config.fujitsu)
            this.addServer(new binding_fujitsu_1.FujitsuServer(this.config.fujitsu.remote));
        if (this.config.oracle)
            this.addServer(new binding_oracle_1.OracleServer(this.config.oracle.store, password));
        // clients for consuming
        this.addClientFactory(new binding_file_1.FileClientFactory());
        this.addClientFactory(new binding_http_2.HttpClientFactory(this.config.http));
        this.addClientFactory(new binding_http_3.HttpsClientFactory(this.config.http));
        this.addClientFactory(new binding_coap_1.CoapClientFactory());
        this.addClientFactory(new binding_coap_2.CoapsClientFactory());
    }
    /**
     * start
     */
    start() {
        return new Promise((resolve, reject) => {
            super.start().then((myWoT) => {
                console.info("BridgeServient started");
                // pass on WoTFactory
                resolve(myWoT);
            }).catch((err) => reject(err));
        });
    }
}
exports.default = BridgeServient;
BridgeServient.defaultConfig = {
    http: {
        port: 8080,
        selfSigned: false
    },
    fujitsu: {
        remote: "ws://wot.f-ncs.ad.jp/websocket/"
    },
    oracle: {
        store: "W3CWOT-GATEWAY"
    }
};

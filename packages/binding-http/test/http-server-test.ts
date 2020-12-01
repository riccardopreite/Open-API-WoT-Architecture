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

/**
 * Protocol test suite to test protocol implementations
 */

import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect, should, assert } from "chai";
// should must be called to augment all variables
should();

import * as rp from "request-promise";

import HttpServer from "../src/http-server";
import { ExposedThing, Helpers } from "@node-wot/core";

@suite("HTTP server implementation")
class HttpServerTest {

  @test async "should start and stop a server"() {
    let httpServer = new HttpServer({ port: 58080 });

    await httpServer.start(null);
    expect(httpServer.getPort()).to.eq(58080); // from test

    await httpServer.stop();
    expect(httpServer.getPort()).to.eq(-1); // from getPort() when not listening
  }

  @test async "should change resource from 'off' to 'on' and try to invoke"() {
    let httpServer = new HttpServer({ port: 0 });

    await httpServer.start(null);

    let testThing = new ExposedThing(null);
    testThing = Helpers.extend({
      title: "Test",
      properties: {
        test: {
          type: "string"
        }
      },
      actions: {
        try: {
          output: { type: "string" }
        }
      }
    }, testThing);
    testThing.extendInteractions();
    await testThing.writeProperty("test", "off")
    testThing.properties.test.forms = [];
    testThing.setActionHandler("try", (input) => { return new Promise<string>( (resolve, reject) => { resolve("TEST"); }); });
    testThing.actions.try.forms = [];

    await httpServer.expose(testThing);

    let uri = `http://localhost:${httpServer.getPort()}/Test/`;
    let body;

    console.log("Testing", uri);

    body = await rp.get(uri+"properties/test");
    expect(body).to.equal("\"off\"");

    body = await rp.put(uri+"properties/test", { body: "on" });
    expect(body).to.equal("");

    body = await rp.get(uri+"properties/test");
    expect(body).to.equal("\"on\"");

    body = await rp.post(uri+"actions/try", { body: "toggle" });
    expect(body).to.equal("\"TEST\"");

    return httpServer.stop();
  }

  @test async "should cause EADDRINUSE error when already running"() {
    let httpServer1 = new HttpServer({ port: 0 });

    await httpServer1.start(null);
    expect(httpServer1.getPort()).to.be.above(0);

    let httpServer2 = new HttpServer({ port: httpServer1.getPort() });

    try {
      await httpServer2.start(null); // should fail
    } catch (err) {
      console.log("HttpServer failed correctly on EADDRINUSE");
      assert(true);
    };

    expect(httpServer2.getPort()).to.eq(-1);

    let uri = `http://localhost:${httpServer1.getPort()}/`;

    return rp.get(uri).then(async body => {
      expect(body).to.equal("[]");

      await httpServer1.stop();
      await httpServer2.stop();
    });
  }

  // https://github.com/eclipse/thingweb.node-wot/issues/181
  @test async "should start and stop a server with no security"() {
    let httpServer = new HttpServer({ port: 58080, security: {scheme: "nosec"}});

    await httpServer.start(null);
    expect(httpServer.getPort()).to.eq(58080); // port test
    expect(httpServer.getHttpSecurityScheme()).to.eq("NoSec"); // HTTP security scheme test (nosec -> NoSec)
    await httpServer.stop();
  }

  // https://github.com/eclipse/thingweb.node-wot/issues/181
  @test async "should not override a valid security scheme"() {
    let httpServer = new HttpServer({
      port: 58081, 
      serverKey : "./test/server.key",
      serverCert: "./test/server.cert",
      security: {
        scheme: "bearer"
      }
    });
    await httpServer.start(null);
    let testThing = new ExposedThing(null);
    testThing.securityDefinitions = {
      "bearer" : {
        scheme:"bearer"
      }
    }
    httpServer.expose(testThing,{});
    await httpServer.stop()

    expect(testThing.securityDefinitions["bearer"]).not.to.be.undefined;
  }

  @test async "should not accept an unsupported scheme"() {
    console.log("START SHOULD")
    let httpServer = new HttpServer({
      port: 58081, 
      serverKey: "./test/server.key",
      serverCert: "./test/server.cert",
      security: {
        scheme: "bearer"
      }
    });
    await httpServer.start(null);
    
    let testThing = new ExposedThing(null);
    testThing.securityDefinitions = {
      "oauth2" : {
        scheme:"oauth2"
      }
    }

    expect(() => { httpServer.expose(testThing, {});}).throw()
    await httpServer.stop();

  }
}

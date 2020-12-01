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

import * as TD from "@node-wot/td-tools";

import { Subscription } from "rxjs/Subscription";

import Servient from "./servient";
import ExposedThing from "./exposed-thing";

export interface ProtocolClient {

  /** this client is requested to perform a "read" on the resource with the given URI */
  readResource(form: TD.Form): Promise<Content>;

  /** this cliet is requested to perform a "write" on the resource with the given URI  */
  writeResource(form: TD.Form, content: Content): Promise<void>;

  /** this client is requested to perform an "invoke" on the resource with the given URI */
  invokeResource(form: TD.Form, content: Content): Promise<Content>;

  /** this client is requested to perform an "unlink" on the resource with the given URI */
  unlinkResource(form: TD.Form): Promise<void>;

  subscribeResource(form: TD.Form, next: ((content: Content) => void), error?: (error: any) => void, complete?: () => void): Subscription;

  /** start the client (ensure it is ready to send requests) */
  start(): boolean;
  /** stop the client */
  stop(): boolean;

  /** apply TD security metadata */
  setSecurity(metadata: Array<TD.SecurityScheme>, credentials?: any): boolean;
}

export interface ProtocolClientFactory {
  readonly scheme: string;
  getClient(): ProtocolClient;
  init(): boolean;
  destroy(): boolean;
}

export interface ProtocolServer {
  readonly scheme: string;
  expose(thing: ExposedThing, tdTemplate?: WoT.ThingDescription): Promise<void>;
  start(servient: Servient): Promise<void>;
  stop(): Promise<void>;
  getPort(): number;
}

export interface Content {
  type: string,
  body: Buffer
}

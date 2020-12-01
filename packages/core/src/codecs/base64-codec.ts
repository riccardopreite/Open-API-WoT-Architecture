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

import { ContentSerdes, ContentCodec } from "../content-serdes";
import * as TD from "@node-wot/td-tools";

export default class Base64Codec implements ContentCodec {

  private subMediaType: string;

  constructor(subMediaType: string) {
    this.subMediaType = subMediaType;
  }

  getMediaType(): string {
    return this.subMediaType;
  }

  bytesToValue(bytes: Buffer, schema: TD.DataSchema, parameters: {[key: string]: string}): any {
    let parsed: any;
    parsed = bytes.toString("ascii");
    return parsed;
  }

  valueToBytes(value: any, schema: TD.DataSchema, parameters?: {[key: string]: string}): Buffer {
    let body = "";
    if (value !== undefined) {
      body = value;
    }
    return Buffer.from(body, "base64");
  }
}

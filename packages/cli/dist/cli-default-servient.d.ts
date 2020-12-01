import * as WoT from "wot-typescript-definitions";
import { Servient } from "@node-wot/core";
export default class DefaultServient extends Servient {
    private static readonly defaultConfig;
    readonly config: any;
    logLevel: string;
    constructor(clientOnly: boolean, config?: any);
    start(): Promise<WoT.WoT>;
    private readonly loggers;
    private setLogLevel;
}

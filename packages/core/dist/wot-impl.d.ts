import * as WoT from "wot-typescript-definitions";
import Servient from "./servient";
export default class WoTImpl implements WoT.WoT {
    private srv;
    constructor(srv: Servient);
    discover(filter?: WoT.ThingFilter): WoT.ThingDiscovery;
    consume(td: WoT.ThingDescription): Promise<WoT.ConsumedThing>;
    addDefaultLanguage(thing: any): void;
    produce(td: WoT.ThingDescription): Promise<WoT.ExposedThing>;
}
export declare enum DiscoveryMethod {
    "any" = 0,
    "local" = 1,
    "directory" = 2,
    "multicast" = 3
}
export declare class ThingDiscoveryImpl implements WoT.ThingDiscovery {
    filter?: WoT.ThingFilter;
    active: boolean;
    done: boolean;
    error?: Error;
    constructor(filter?: WoT.ThingFilter);
    start(): void;
    next(): Promise<WoT.ThingDescription>;
    stop(): void;
}
export declare enum DataType {
    boolean = "boolean",
    number = "number",
    integer = "integer",
    string = "string",
    object = "object",
    array = "array",
    null = "null"
}

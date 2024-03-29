import Servient from "./servient";
export default class Helpers {
    private srv;
    constructor(srv: Servient);
    private static staticAddress;
    static extractScheme(uri: string): string;
    static setStaticAddress(address: string): void;
    static getAddresses(): Array<string>;
    static toUriLiteral(address: string): string;
    static generateUniqueName(name: string): string;
    fetch(uri: string): Promise<WoT.ThingDescription>;
    static extend<T, U>(first: T, second: U): T & U;
}

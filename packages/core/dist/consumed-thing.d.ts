import * as WoT from "wot-typescript-definitions";
import * as TD from "@node-wot/td-tools";
import Servient from "./servient";
import { ProtocolClient } from "./protocol-interfaces";
declare enum Affordance {
    PropertyAffordance = 0,
    ActionAffordance = 1,
    EventAffordance = 2
}
export default class ConsumedThing extends TD.Thing implements WoT.ConsumedThing {
    properties: {
        [key: string]: TD.ThingProperty;
    };
    actions: {
        [key: string]: TD.ThingAction;
    };
    events: {
        [key: string]: TD.ThingEvent;
    };
    private getServient;
    private getClients;
    constructor(servient: Servient);
    getThingDescription(): WoT.ThingDescription;
    emitEvent(name: string, data: any): void;
    extendInteractions(): void;
    findForm(forms: Array<TD.Form>, op: string, affordance: Affordance, schemes: string[], idx: number): TD.Form;
    ensureClientSecurity(client: ProtocolClient): void;
    getClientFor(forms: Array<TD.Form>, op: string, affordance: Affordance, options?: WoT.InteractionOptions): ClientAndForm;
    readProperty(propertyName: string, options?: WoT.InteractionOptions): Promise<any>;
    _readProperties(propertyNames: string[]): Promise<WoT.PropertyValueMap>;
    readAllProperties(options?: WoT.InteractionOptions): Promise<WoT.PropertyValueMap>;
    readMultipleProperties(propertyNames: string[], options?: WoT.InteractionOptions): Promise<WoT.PropertyValueMap>;
    writeProperty(propertyName: string, value: any, options?: WoT.InteractionOptions): Promise<void>;
    writeMultipleProperties(valueMap: WoT.PropertyValueMap, options?: WoT.InteractionOptions): Promise<void>;
    invokeAction(actionName: string, parameter?: any, options?: WoT.InteractionOptions): Promise<any>;
    observeProperty(name: string, listener: WoT.WotListener, options?: WoT.InteractionOptions): Promise<void>;
    unobserveProperty(name: string, options?: WoT.InteractionOptions): Promise<void>;
    subscribeEvent(name: string, listener: WoT.WotListener, options?: WoT.InteractionOptions): Promise<void>;
    unsubscribeEvent(name: string, options?: WoT.InteractionOptions): Promise<void>;
    handleUriVariables(form: TD.Form, options?: WoT.InteractionOptions): TD.Form;
}
export interface ClientAndForm {
    client: ProtocolClient;
    form: TD.Form;
}
export {};

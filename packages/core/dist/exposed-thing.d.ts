import * as WoT from "wot-typescript-definitions";
import * as TD from "@node-wot/td-tools";
import Servient from "./servient";
export default class ExposedThing extends TD.Thing implements WoT.ExposedThing {
    security: Array<String>;
    securityDefinitions: {
        [key: string]: TD.SecurityScheme;
    };
    id: string;
    title: string;
    base: string;
    forms: Array<TD.Form>;
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
    private getSubjectTD;
    constructor(servient: Servient);
    extendInteractions(): void;
    getThingDescription(): WoT.ThingDescription;
    emitEvent(name: string, data: any): void;
    expose(): Promise<void>;
    destroy(): Promise<void>;
    setPropertyReadHandler(propertyName: string, handler: WoT.PropertyReadHandler): WoT.ExposedThing;
    setPropertyWriteHandler(propertyName: string, handler: WoT.PropertyWriteHandler): WoT.ExposedThing;
    setActionHandler(actionName: string, handler: WoT.ActionHandler): WoT.ExposedThing;
    readProperty(propertyName: string, options?: WoT.InteractionOptions): Promise<any>;
    _readProperties(propertyNames: string[], options?: WoT.InteractionOptions): Promise<WoT.PropertyValueMap>;
    readAllProperties(options?: WoT.InteractionOptions): Promise<WoT.PropertyValueMap>;
    readMultipleProperties(propertyNames: string[], options?: WoT.InteractionOptions): Promise<WoT.PropertyValueMap>;
    writeProperty(propertyName: string, value: any, options?: WoT.InteractionOptions): Promise<void>;
    writeMultipleProperties(valueMap: WoT.PropertyValueMap, options?: WoT.InteractionOptions): Promise<void>;
    invokeAction(actionName: string, parameter?: any, options?: WoT.InteractionOptions): Promise<any>;
    observeProperty(name: string, listener: WoT.WotListener, options?: WoT.InteractionOptions): Promise<void>;
    unobserveProperty(name: string): Promise<void>;
    subscribeEvent(name: string, listener: WoT.WotListener, options?: WoT.InteractionOptions): Promise<void>;
    unsubscribeEvent(name: string): Promise<void>;
}

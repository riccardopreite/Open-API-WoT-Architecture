import { ProtocolClient, Content } from '@node-wot/core';
import * as TD from '@node-wot/td-tools';
import { MqttForm } from './mqtt';
export default class MqttClient implements ProtocolClient {
    private user;
    private psw;
    constructor(config?: any, secure?: boolean);
    private client;
    subscribeResource(form: MqttForm, next: ((value: any) => void), error?: (error: any) => void, complete?: () => void): any;
    readResource: (form: MqttForm) => Promise<Content>;
    writeResource: (form: MqttForm, content: Content) => Promise<void>;
    invokeResource: (form: MqttForm, content: Content) => Promise<Content>;
    unlinkResource: (form: TD.Form) => Promise<void>;
    start: () => boolean;
    stop: () => boolean;
    setSecurity(metadata: Array<TD.SecurityScheme>, credentials?: any): boolean;
    private mapQoS;
    private logError;
}

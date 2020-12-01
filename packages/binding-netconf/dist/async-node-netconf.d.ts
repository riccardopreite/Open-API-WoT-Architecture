export declare class Client {
    private router;
    constructor();
    getRouter(): any;
    deleteRouter(): void;
    initializeRouter(host: string, port: number, credentials: any): Promise<unknown>;
    openRouter(): Promise<unknown>;
    rpc(xpath_query: string, method: string, NSs: any, target: string, payload?: any): Promise<unknown>;
    closeRouter(): void;
}

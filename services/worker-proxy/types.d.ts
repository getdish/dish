declare module "@dish/worker-proxy" {
    export function ensurePage(forceRefresh?: boolean): Promise<any>;
    export function fetchBrowser(uriBase: string, type: 'html' | 'json' | 'hyperscript', selector?: string, maxTries?: number): any;
    export function fetchBrowserJSON(uri: string, retry?: number): any;
    export function fetchBrowserHTML(uri: string): Promise<any>;
    export function fetchBrowserHyperscript(uri: string, selector: string): Promise<any>;
}
//# sourceMappingURL=types.d.ts.map

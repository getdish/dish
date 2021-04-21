/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/worker-proxy" {
    import { Page } from "playwright";
    export function ensurePage(forceRefresh?: boolean): Promise<Page>;
    export function fetchBrowser(uriBase: string, type: 'html' | 'json' | 'hyperscript', selector?: string, maxTries?: number): any;
    export function fetchBrowserJSON(uri: string, retry?: number): any;
    export function fetchBrowserHTML(uri: string): Promise<string>;
    export function fetchBrowserHyperscript(uri: string, selector: string): Promise<any>;
}
//# sourceMappingURL=types.d.ts.map

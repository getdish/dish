declare module "@dish/puppet-proxy" {
    export function fetchBrowser(uri: string, type: 'html' | 'json' | 'script-data', selectors?: string[] | null, retry?: number): any;
    export function fetchBrowserJSON(uri: string, retry?: number): any;
    export function fetchBrowserHTML(uri: string, retry?: number): Promise<any>;
    export function fetchBrowserScriptData(uri: string, selectors: string[], retry?: number): Promise<any[] | undefined>;
}
//# sourceMappingURL=types.d.ts.map

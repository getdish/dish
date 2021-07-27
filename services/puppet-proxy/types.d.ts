declare module "@dish/puppet-proxy" {
    export function fetchBrowser(uri: string, type: 'html' | 'json' | 'script-data', { headers, retry, selectors, }?: {
        retry?: number;
        headers?: Object;
        selectors?: string[] | null;
    }): any;
    export function fetchBrowserJSON(uri: string, headers?: {
        [key: string]: any;
    }, retry?: number): any;
    export function fetchBrowserHTML(uri: string, retry?: number): Promise<string>;
    export function fetchBrowserScriptData(uri: string, selectors: string[], retry?: number): Promise<any[] | undefined>;
}
//# sourceMappingURL=types.d.ts.map

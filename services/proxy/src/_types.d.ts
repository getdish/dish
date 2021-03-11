/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/proxy" {
    import { Page } from "playwright";
    export function ensurePage(forceRefresh?: boolean): Promise<Page>;
    export function fetchBrowser(uri: string, type: "html" | "json", maxTries?: number): any;
    export function fetchBrowserJSON(uri: string): Promise<{
        [key: string]: any;
    } | null>;
    export function fetchBrowserHTML(uri: string): Promise<string | null>;
}

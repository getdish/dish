/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/common" {
    export const sentryMessage: (message: string, data?: any, tags?: {
        [key: string]: string;
    } | undefined) => void;
    export const sentryException: (error: Error, data?: any, tags?: {
        [key: string]: string;
    } | undefined) => void;
}

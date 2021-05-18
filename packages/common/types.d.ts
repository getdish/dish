declare module "@dish/common" {
    export const sentryMessage: (message: string, { data, tags, logger, }?: {
        data?: any;
        tags?: {
            [key: string]: string;
        } | undefined;
        logger?: ((...args: any[]) => void) | undefined;
    }) => void;
    export const sentryException: (error: Error, { data, tags, logger, }?: {
        data?: any;
        tags?: {
            [key: string]: string;
        } | undefined;
        logger?: ((...args: any[]) => void) | undefined;
    }) => void;
}
//# sourceMappingURL=types.d.ts.map

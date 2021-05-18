declare module "@dish/common" {
    export const sentryMessage: (message: string, data?: any, tags?: {
        [key: string]: string;
    } | undefined) => void;
    export const sentryException: ({ error, data, tags, logger, }: {
        error: Error;
        data?: any;
        tags?: {
            [key: string]: string;
        } | undefined;
        logger?: ((...args: any[]) => void) | undefined;
    }) => void;
}
//# sourceMappingURL=types.d.ts.map

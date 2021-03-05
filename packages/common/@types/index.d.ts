declare module "load_env" { }
declare module "@dish/common" {
    import "load_env";
    export const sentryMessage: (message: string, data?: any, tags?: {
        [key: string]: string;
    } | undefined) => void;
    export const sentryException: (error: Error, data?: any, tags?: {
        [key: string]: string;
    } | undefined) => void;
}

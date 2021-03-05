declare module "cancellablePromise" {
    export type CancelFn = () => void;
    export class CancellablePromise<T> extends Promise<T> {
        cancel: () => any;
        constructor(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
    }
    export const createCancellablePromise: <A>(cb: (res: (value?: any) => any, rej: (value?: any) => any, onCancel: Function) => A) => CancellablePromise<A>;
    export const cancelPromise: (promise: CancellablePromise<any> | Promise<any>) => void;
}
declare module "requestIdle" {
    export const requestIdle: () => import("cancellablePromise").CancellablePromise<void>;
}
declare module "sleep" {
    export const sleep: (ms: number) => import("cancellablePromise").CancellablePromise<void>;
}
declare module "fullyIdle" {
    export function fullyIdle({ min, max, }?: {
        min?: number;
        max?: number;
    }): Promise<[void, void]>;
}
declare module "idle" {
    export const idle: (max: number) => Promise<void>;
}
declare module "series" {
    export function series(fns: (Function | ((x?: any) => any))[]): {
        (): void;
        value(): any;
    };
}
declare module "@dish/async" {
    export * from "cancellablePromise";
    export * from "series";
    export * from "sleep";
    export * from "requestIdle";
    export * from "fullyIdle";
    export * from "idle";
}

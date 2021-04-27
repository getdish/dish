/// <reference lib="dom" />
/// <reference lib="esnext" />
declare module "@dish/fast-compare" {
    export const EQUALITY_KEY: unique symbol;
    export type IsEqualOptions = {
        ignoreKeys?: {
            [key: string]: boolean;
        };
        simpleCompareKeys?: {
            [key: string]: boolean;
        };
        log: boolean;
    };
    export function isEqual(a: any, b: any, options?: IsEqualOptions): boolean;
}
//# sourceMappingURL=types.d.ts.map

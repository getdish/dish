declare module "assertHelpers" {
    export class AssertionError extends Error {
    }
    export class AsserionNullError extends AssertionError {
    }
    export type NonNullish = string | number | boolean | symbol | bigint | object;
    type AssertOpts = {
        onAssertFail?: (why?: string) => any;
    };
    export function configureAssertHelpers(opts: AssertOpts): void;
    export function assertPresent(value: any, why?: string): asserts value is NonNullish;
    export function assertSame<T>(a: T, b: T): void;
    export function assertIsString(val: unknown, why?: string): asserts val is string;
    export function assertInstanceOf<T>(val: unknown, clazz: new (...args: any[]) => T, why?: string): asserts val is T;
    export function assert(value: unknown, why?: string): asserts value;
    export function assertNever(value: never, why?: string): void;
    export function assertNonNull<T>(value: T, why?: string): NonNullable<T>;
    export function handleAssertionError(err: any): void;
}
declare module "constants" {
    export const isNative: boolean;
    export const defaultSmall: boolean;
    export const supportsTouchWeb: boolean;
    export const isSafari: boolean;
}
declare module "doesStringContainTag" {
    export function doesStringContainTag(text: string, tag: any): boolean;
}
declare module "fetchBertSentiment" {
    export function fetchBertSentiment(sentence: string): Promise<any>;
    export function bertResultToNumber(bert_sentiment: [string, number]): number;
    export function fetchBertSentimentNumber(text: string): Promise<number>;
}
declare module "reduce" {
    export function reduce<A extends {
        [key: string]: any;
    }>(obj: A, transform: (key: keyof A, val: any) => any): {
        [key in keyof A]: any;
    };
}
declare module "@dish/helpers" {
    export * from "constants";
    export * from "assertHelpers";
    export * from "reduce";
    export * from "fetchBertSentiment";
    export * from "doesStringContainTag";
    export const stringify: (a: any) => string;
    export function ellipseText(str: string, { maxLength, ellipse, }?: {
        maxLength?: number;
        ellipse?: string;
    }): string;
    export function hasProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown>;
    export function isPresent<T extends Object>(input: null | undefined | T): input is T;
    export function breakIntoSentences(text: string): string[];
}
declare module "polyfill-localStorage.native" { }

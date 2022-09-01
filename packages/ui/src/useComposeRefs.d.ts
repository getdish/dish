import { Ref } from 'react';
declare type OptionalRef<T> = Ref<T> | undefined;
export declare function combineRefs<T>(...refs: [OptionalRef<T>, OptionalRef<T>, ...Array<OptionalRef<T>>]): Ref<T>;
export {};

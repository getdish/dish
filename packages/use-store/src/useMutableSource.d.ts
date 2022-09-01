declare const TARGET = "_uMS_T";
declare const GET_VERSION = "_uMS_V";
declare type MutableSource<T, V> = {
    [TARGET]: T;
    [GET_VERSION]: (target: T) => V;
};
export declare const createMutableSource: <T, V>(target: T, getVersion: (target: T) => V) => MutableSource<T, V>;
export declare const useMutableSource: <T, V, S>(source: MutableSource<T, V>, getSnapshot: (target: T) => S, subscribe: (target: T, callback: () => void) => () => void) => S;
export {};

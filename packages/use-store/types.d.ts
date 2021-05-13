declare module "@dish/use-store" {
    export type Selector<A = unknown, B = unknown> = (x: A) => B;
    export type UseStoreSelector<Store, Res> = (store: Store) => Res;
    export type UseStoreOptions<Store = any, SelectorRes = any> = {
        selector?: UseStoreSelector<Store, SelectorRes>;
        once?: boolean;
    };
    export type StoreInfo<A = any> = {
        store: A;
        source: any;
        storeInstance: any;
        getters: {
            [key: string]: any;
        };
        actions: any;
        getVersion(): number;
        triggerUpdate(): void;
        stateKeys: string[];
        gettersState: {
            getCache: Map<string, any>;
            depsToGetter: Map<string, Set<string>>;
            curGetKeys: Set<string>;
            isGetting: boolean;
        };
    };
    export type UseStoreConfig = {
        logLevel?: 'debug' | 'info' | 'error';
    };
}

declare module "@dish/use-store" {
    export const useCurrentComponent: () => any;
    export function useDebugStoreComponent(StoreCons: any): void;
    export const shouldDebug: (component: any, info: Pick<StoreInfo, 'storeInstance'>) => boolean | undefined;
    export const DebugComponents: Map<any, Set<any>>;
    export const DebugStores: Set<any>;
}

declare module "@dish/use-store" {
    export const TRIGGER_UPDATE: unique symbol;
    export const ADD_TRACKER: unique symbol;
    export const TRACK: unique symbol;
    export const SHOULD_DEBUG: unique symbol;
    export type StoreTracker = {
        isTracking: boolean;
        tracked: Set<string>;
        dispose: () => void;
        component?: any;
        firstRun: boolean;
    };
    export class Store<Props extends Object | null = null> {
        props: Props;
        private _listeners;
        private _trackers;
        constructor(props: Props);
        subscribe(onChanged: Function): () => void;
        [TRIGGER_UPDATE](): void;
        [ADD_TRACKER](tracker: StoreTracker): () => void;
        [TRACK](key: string): void;
        [SHOULD_DEBUG](): boolean;
    }
}

declare module "@dish/use-store" {
    export let configureOpts: UseStoreConfig;
    export function configureUseStore(opts: UseStoreConfig): void;
}

declare module "@dish/use-store" {
    export const UNWRAP_PROXY: unique symbol;
    export const defaultOptions: {
        once: boolean;
        selector: undefined;
    };
}

declare module "@dish/use-store" {
    export function getStoreUid(Constructor: any, props: string | Object | void): string;
    export const UNWRAP_STORE_INFO: unique symbol;
    export const cache: Map<string, StoreInfo<any>>;
    export function getStoreDescriptors(storeInstance: any): {
        [x: string]: TypedPropertyDescriptor<any> & PropertyDescriptor;
    };
    export function get<A>(_: A, b?: any): A extends new (props?: any) => infer B ? B : A;
    export function getKey(props: Object): string;
    export default function useConstant<T>(fn: () => T): T;
    export function simpleStr(arg: any): any;
    export function getStoreDebugInfo(store: any): any;
}

declare module "@dish/use-store" {
    export function isEqualSubsetShallow(prev: Object, next: Object): boolean;
}

declare module "@dish/use-store" {
    export const createMutableSource: (target: any, getVersion: any) => any;
    export const useMutableSource: (source: any, getSnapshot: any, subscribe: any) => any;
}

declare module "@dish/use-store" {
    export function useStore<A extends Store<B>, B>(StoreKlass: (new (props: B) => A) | (new () => A), props?: B, options?: UseStoreOptions<A, any>): A;
    export function useStoreDebug<A extends Store<B>, B>(StoreKlass: (new (props: B) => A) | (new () => A), props?: B, selector?: any): A;
    export function createStore<A extends Store<B>, B>(StoreKlass: new (props: B) => A | (new () => A), props?: B): A;
    export function useStoreInstance<A extends Store<B>, B>(instance: A, debug?: boolean): A;
    export function useStoreInstanceSelector<A extends Store<B>, B, Selector extends (store: A) => any>(instance: A, selector: Selector, memo?: any[], debug?: boolean): Selector extends (a: A) => infer C ? C : unknown;
    export function createUseStore<Props, Store>(StoreKlass: (new (props: Props) => Store) | (new () => Store)): <Res, C extends Selector<Store, Res>>(props?: Props | undefined, selector?: C | undefined) => C extends Selector<any, infer B> ? B extends Object ? B : Store : Store;
    export function createUseStoreSelector<A extends Store<Props>, Props, Selected>(StoreKlass: (new (props: Props) => A) | (new () => A), selector: Selector<A, Selected>): (props?: Props) => Selected;
    export function useStoreSelector<A extends Store<B>, B, S extends Selector<any, Selected>, Selected>(StoreKlass: (new (props: B) => A) | (new () => A), selector: S, props?: B): Selected;
    type StoreAccessTracker = (store: any) => void;
    export function trackStoresAccess(cb: StoreAccessTracker): () => void;
    export function useStoreOnce<A extends Store<B>, B>(StoreKlass: (new (props: B) => A) | (new () => A), props?: B, selector?: any): A;
    export function getStore<A extends Store<B>, B>(StoreKlass: (new (props: B) => A) | (new () => A), props?: B): A;
    export const allStores: {};
    export const subscribe: (store: Store, callback: () => any) => () => void;
}

declare module "@dish/use-store" {
    export function selector(fn: () => any): () => void;
    export function useSelector<A>(fn: () => A): A;
}

declare module "@dish/use-store" {
    export function reaction<StoreInstance extends Store<any>, Selector extends (a: StoreInstance) => any>(store: StoreInstance, selector: Selector, receiver: Selector extends (a: StoreInstance) => infer Derived ? (a: Derived) => any : unknown, equalityFn?: (a: any, b: any) => boolean): () => void;
}
//# sourceMappingURL=types.d.ts.map

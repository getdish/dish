import { Store } from './Store';
export declare type Selector<A = unknown, B = unknown> = (x: A) => B;
export declare type UseStoreSelector<Store, Res> = (store: Store) => Res;
export declare type UseStoreOptions<Store = any, SelectorRes = any> = {
    debug?: boolean;
    selector?: UseStoreSelector<Store, SelectorRes>;
    once?: boolean;
};
export declare type StoreInfo<A = Store> = {
    keyComparators?: {
        [key: string]: (a: any, b: any) => boolean;
    };
    store: A;
    storeInstance: any;
    getters: {
        [key: string]: any;
    };
    actions: any;
    stateKeys: string[];
    gettersState: {
        getCache: Map<string, any>;
        depsToGetter: Map<string, Set<string>>;
        curGetKeys: Set<string>;
        isGetting: boolean;
    };
};
export declare type UseStoreConfig = {
    logLevel?: 'debug' | 'info' | 'error';
};

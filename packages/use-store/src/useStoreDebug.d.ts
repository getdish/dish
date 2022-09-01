import { StoreInfo } from './interfaces';
export declare const useCurrentComponent: () => any;
export declare function useDebugStoreComponent(StoreCons: any): void;
export declare const shouldDebug: (component: any, info: Pick<StoreInfo, 'storeInstance'>) => boolean | undefined;
export declare const DebugComponents: Map<any, Set<any>>;
export declare const DebugStores: Set<any>;

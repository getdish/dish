import { Store } from '@dish/use-store';
import * as React from 'react';
import { Router as TinyRouter } from 'tiny-request-router';
export interface RoutesTable {
    [key: string]: Route<any>;
}
export declare type RouteName = string;
export declare type RouteAlert<A extends RoutesTable> = {
    condition: (next: 'unload' | NavigateItem<A>) => boolean;
    message: string;
};
export declare type HistoryType = 'push' | 'pop' | 'replace';
export declare type HistoryDirection = 'forward' | 'backward' | 'none';
export declare type RouteData = {
    [key: string]: any;
};
export declare type HistoryItem<A extends RouteName = string> = {
    id: string;
    name: A;
    path: string;
    type: HistoryType;
    search: string;
    params: Exclude<RoutesTable[A]['params'], void> | {
        [key: string]: string;
    };
    direction: HistoryDirection;
    data?: RouteData;
};
export declare type OnRouteChangeCb = (item: HistoryItem) => Promise<void>;
declare type RouterProps = {
    routes: RoutesTable;
    skipInitial?: boolean;
};
declare type HistoryCb = (cb: HistoryItem) => void;
export declare class Router<Props extends RouterProps, RT extends RoutesTable = Props['routes']> extends Store<Props> {
    router: TinyRouter<any>;
    routes: RoutesTable;
    routeNames: string[];
    routePathToName: {};
    notFound: boolean;
    history: HistoryItem[];
    stack: HistoryItem[];
    stackIndex: number;
    alert: RouteAlert<RT> | null;
    getPathFromParams: any;
    mount(): void;
    get prevPage(): HistoryItem<string>;
    get curPage(): HistoryItem<string>;
    get prevHistory(): HistoryItem<string>;
    get curHistory(): HistoryItem<string>;
    private handlePath;
    private routeChangeListeners;
    onRouteChange(cb: HistoryCb, ignoreHistory?: boolean): () => void;
    getShouldNavigate(navItem: NavigateItem<RT>): boolean;
    private getNormalizedParams;
    getIsRouteActive(navItem: NavigateItem<RT>): boolean;
    private nextNavItem;
    navigate(navItem: NavigateItem<RT>): void;
    setParams(params: any): void;
    back(): void;
    forward(): void;
    setRouteAlert(alert: RouteAlert<RT> | null): () => void;
}
export declare function getPathFromParams({ routes }: Router<any>, { name, params, }: {
    name?: string;
    params?: Object | void;
}): string;
export declare function getHistoryItem(router: Router<any>, navItem: NavigateItem): HistoryItem;
export declare type ProvideRouterProps = {
    children: any;
} & {
    routes: RoutesTable;
};
export declare function ProvideRouter(props: ProvideRouterProps): JSX.Element;
export declare function useRouter(): Router<RouterProps, RoutesTable>;
export declare function useRouterSelector<A extends (a: Router<any>) => any, Res = A extends (a: Router<any>) => infer B ? B : unknown>(selector: A): Res;
export declare type LoadableView = React.FunctionComponent & {
    fetchData: (params: HistoryItem) => Promise<any>;
};
export declare type PageRouteView = LoadableView | Promise<LoadableView>;
export declare class Route<A extends Object | void = void> {
    path: string;
    page?: PageRouteView | undefined;
    params?: A | undefined;
    constructor(path: string, page?: PageRouteView | undefined, params?: A | undefined);
    toString(): string;
}
export declare type NavigableItems<Table extends RoutesTable> = {
    [Property in keyof Table]: Table[Property]['params'] extends void ? {
        name: Property;
        search?: string;
        params?: void;
        replace?: boolean;
        callback?: OnRouteChangeCb;
    } : {
        name: Property;
        params: Table[Property]['params'];
        search?: string;
        replace?: boolean;
        callback?: OnRouteChangeCb;
    };
};
export declare type NavigateItem<RT extends RoutesTable = any, Items extends NavigableItems<RT> = NavigableItems<RT>> = Items[keyof Items] & {
    data?: RouteData;
};
export {};

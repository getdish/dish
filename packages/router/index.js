import { Store, useStore, useStoreSelector } from '@dish/use-store';
import { createBrowserHistory, createMemoryHistory } from 'history';
import * as React from 'react';
import { createContext, useContext } from 'react';
import { Router as TinyRouter } from 'tiny-request-router';
const USE_MEMORY = process.env.TARGET === 'node' ||
    typeof document === 'undefined' ||
    (navigator === null || navigator === void 0 ? void 0 : navigator.userAgent.includes('jsdom'));
const history = USE_MEMORY ? createMemoryHistory() : createBrowserHistory();
export class Router extends Store {
    constructor() {
        super(...arguments);
        this.router = new TinyRouter();
        this.routes = {};
        this.routeNames = [];
        this.routePathToName = {};
        this.notFound = false;
        this.history = [];
        this.stack = [];
        this.stackIndex = 0;
        this.alert = null;
        this.getPathFromParams = getPathFromParams.bind(null, this);
        this.routeChangeListeners = new Set();
        this.nextNavItem = null;
    }
    mount() {
        var _a, _b, _c, _d, _e, _f;
        const { routes } = this.props;
        this.routes = routes;
        this.routeNames = Object.keys(routes);
        this.routePathToName = Object.keys(routes).reduce((acc, key) => {
            acc[routes[key].path] = key;
            return acc;
        }, {});
        let nextRouter = this.router;
        for (const name of this.routeNames) {
            nextRouter = nextRouter.get(routes[name].path, name);
        }
        nextRouter = nextRouter.all('*', '404');
        this.router = nextRouter;
        history.listen((event) => {
            const state = event.location.state;
            const id = state === null || state === void 0 ? void 0 : state.id;
            const prevItems = this.stack.slice(0, this.stackIndex);
            const nextItems = this.stack.slice(this.stackIndex + 1);
            let direction = event.action === 'POP'
                ? prevItems.some((x) => x.id === id)
                    ? 'backward'
                    : nextItems.some((x) => x.id === id)
                        ? 'forward'
                        : 'none'
                : 'none';
            let type = event.action === 'REPLACE' ? 'replace' : event.action === 'POP' ? 'pop' : 'push';
            if (type === 'pop' && direction == 'none') {
                type = 'push';
                direction = 'forward';
            }
            this.handlePath(event.location.pathname, {
                id,
                direction,
                type,
            });
        });
        if (!this.props.skipInitial) {
            const pathname = ((_b = (_a = window.location) === null || _a === void 0 ? void 0 : _a.pathname) !== null && _b !== void 0 ? _b : '')
                .replace(/\/debugger-ui.*/g, '/');
            history.push({
                pathname,
                search: (_d = (_c = window.location) === null || _c === void 0 ? void 0 : _c.search) !== null && _d !== void 0 ? _d : '',
                hash: (_f = (_e = window.location) === null || _e === void 0 ? void 0 : _e.hash) !== null && _f !== void 0 ? _f : '',
            }, {
                id: uid(),
            });
        }
    }
    get prevPage() {
        return this.stack[this.stackIndex - 1];
    }
    get curPage() {
        var _a;
        return (_a = this.stack[this.stackIndex]) !== null && _a !== void 0 ? _a : defaultPage;
    }
    get prevHistory() {
        return this.history[this.history.length - 2];
    }
    get curHistory() {
        var _a;
        return (_a = this.history[this.history.length - 1]) !== null && _a !== void 0 ? _a : defaultPage;
    }
    handlePath(pathname, item) {
        var _a, _b;
        const match = this.router.match('GET', pathname);
        if (!match) {
            console.log('no match', pathname, item);
            return;
        }
        const next = {
            name: match.handler,
            path: pathname,
            params: {
                ...Object.keys(match.params).reduce((acc, key) => {
                    var _a;
                    acc[key] = decodeURIComponent((_a = match.params[key]) !== null && _a !== void 0 ? _a : '');
                    return acc;
                }, {}),
            },
            search: (_b = (_a = window.location) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : '',
            ...(item.type === 'push' &&
                this.nextNavItem && {
                data: this.nextNavItem.data,
            }),
            ...item,
        };
        this.history = [...this.history, next];
        switch (item.direction) {
            case 'forward':
                if (this.stackIndex === this.stack.length - 1) {
                    return;
                }
                this.stackIndex++;
                break;
            case 'backward':
                if (this.stackIndex === 0) {
                    return;
                }
                this.stackIndex--;
                break;
            case 'none':
                if (item.type === 'replace') {
                    this.stack[this.stackIndex] = next;
                    this.stack = [...this.stack];
                }
                else {
                    if (this.stackIndex < this.stack.length) {
                        this.stack = this.stack.slice(0, this.stackIndex + 1);
                    }
                    this.stack = [...this.stack, next];
                    this.stackIndex = this.stack.length - 1;
                }
                break;
        }
        this.routeChangeListeners.forEach((x) => x(next));
    }
    onRouteChange(cb, ignoreHistory = false) {
        if (!ignoreHistory) {
            if (this.history.length) {
                for (const item of this.history) {
                    cb(item);
                }
            }
        }
        this.routeChangeListeners.add(cb);
        return () => {
            this.routeChangeListeners.delete(cb);
        };
    }
    getShouldNavigate(navItem) {
        const historyItem = getHistoryItem(this, navItem);
        const sameName = historyItem.name === this.curPage.name;
        const sameParams = isEqual(this.getNormalizedParams(historyItem.params), this.getNormalizedParams(this.curPage.params));
        return !sameName || !sameParams;
    }
    getNormalizedParams(params) {
        const obj = params !== null && params !== void 0 ? params : {};
        return Object.keys(obj).reduce((acc, cur) => {
            if (obj[cur]) {
                acc[cur] = obj[cur];
            }
            return acc;
        }, {});
    }
    getIsRouteActive(navItem) {
        return !this.getShouldNavigate(navItem);
    }
    navigate(navItem) {
        var _a, _b;
        const item = getHistoryItem(this, navItem);
        if (this.notFound) {
            this.notFound = false;
        }
        if (!this.getShouldNavigate(navItem)) {
            return;
        }
        this.nextNavItem = navItem;
        const params = {
            id: (_a = item === null || item === void 0 ? void 0 : item.id) !== null && _a !== void 0 ? _a : uid(),
        };
        if ((_b = this.alert) === null || _b === void 0 ? void 0 : _b.condition(navItem)) {
            if (!confirm(this.alert.message)) {
                return;
            }
        }
        const to = item.path;
        if (item.type === 'replace') {
            history.replace(to, params);
        }
        else {
            history.push(to, params);
        }
    }
    setParams(params) {
        this.navigate({
            name: this.curPage.name,
            search: this.curPage.search,
            params: {
                ...this.curPage.params,
                ...params,
            },
            replace: true,
        });
    }
    back() {
        history.back();
    }
    forward() {
        history.forward();
    }
    setRouteAlert(alert) {
        const prev = this.alert;
        this.alert = alert;
        setUnloadCondition(alert);
        return () => {
            setUnloadCondition(prev);
            this.alert = prev;
        };
    }
}
const stripExtraPathSegments = (path) => {
    return path.replace(/\/:[a-zA-Z-_]+[\?]?/g, '');
};
export function getPathFromParams({ routes }, { name, params, }) {
    var _a;
    if (!name) {
        return ``;
    }
    let route = routes[name];
    if (!route) {
        console.log(`no route`, name, routes);
        return ``;
    }
    if (!route.path) {
        console.log(`no route path`, route, name, routes);
        return ``;
    }
    let path = route.path;
    if (!params) {
        return stripExtraPathSegments(path);
    }
    let replaceSplatParams = [];
    for (const key in params) {
        if (typeof params[key] === 'undefined') {
            continue;
        }
        if (path.includes(':')) {
            path = path.replace(new RegExp(`:${key}[\?]?`), (_a = params[key]) !== null && _a !== void 0 ? _a : '-');
        }
        else if (path.indexOf('*') > -1) {
            replaceSplatParams.push(key);
        }
    }
    if (path.includes('/:')) {
        path = stripExtraPathSegments(path);
    }
    if (replaceSplatParams.length) {
        path = path.replace('*', replaceSplatParams.map((key) => `${key}/${params[key]}`).join('/'));
    }
    return path;
}
export function getHistoryItem(router, navItem) {
    var _a, _b;
    const params = {};
    if ('params' in navItem) {
        const p = navItem['params'];
        for (const key in p) {
            const val = p[key];
            if (typeof val !== 'undefined') {
                params[key] = val;
            }
        }
    }
    return {
        id: uid(),
        direction: 'none',
        name: navItem.name,
        type: navItem.replace ? 'replace' : 'push',
        params,
        path: getPathFromParams(router, {
            name: navItem.name,
            params,
        }),
        search: (_b = (_a = window.location) === null || _a === void 0 ? void 0 : _a.search) !== null && _b !== void 0 ? _b : '',
    };
}
const RouterPropsContext = createContext(null);
export function ProvideRouter(props) {
    return (React.createElement(RouterPropsContext.Provider, { value: props.routes }, props.children));
}
export function useRouter() {
    const routes = useContext(RouterPropsContext);
    if (!routes) {
        throw new Error(`Must <ProvideRouter /> above this component`);
    }
    return useStore(Router, { routes });
}
export function useRouterSelector(selector) {
    const routes = useContext(RouterPropsContext);
    if (!routes) {
        throw new Error(`Must <ProvideRouter /> above this component`);
    }
    return useStoreSelector(Router, selector, { routes });
}
export class Route {
    constructor(path, page, params) {
        this.path = path;
        this.page = page;
        this.params = params;
    }
    toString() {
        return JSON.stringify({
            path: this.path,
            params: this.params,
        });
    }
}
const defaultPage = {
    id: '0',
    name: 'null',
    path: '/',
    params: {},
    type: 'push',
    search: '',
    direction: 'none',
};
const uid = () => `${Math.random()}`.replace('.', '');
const isObject = (x) => x && `${x}` === `[object Object]`;
const isEqual = (a, b) => {
    const eqLen = Object.keys(a).length === Object.keys(b).length;
    if (!eqLen) {
        return false;
    }
    for (const k in a) {
        if (k in b) {
            if (isObject(a[k]) && isObject(b[k])) {
                if (!isEqual(a[k], b[k])) {
                    return false;
                }
            }
            if (a[k] !== b[k]) {
                return false;
            }
        }
    }
    return true;
};
function setUnloadCondition(alert) {
    window.onbeforeunload = () => ((alert === null || alert === void 0 ? void 0 : alert.condition('unload')) ? alert.message : null);
}

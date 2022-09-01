import { ADD_TRACKER, SHOULD_DEBUG, TRACK, TRIGGER_UPDATE, disableTracking, setDisableStoreTracking, } from './Store';
import { isEqualSubsetShallow } from './comparators';
import { configureOpts } from './configureUseStore';
import { UNWRAP_PROXY, defaultOptions } from './constants';
import { UNWRAP_STORE_INFO, cache, getStoreDescriptors, getStoreUid, simpleStr, } from './helpers';
import { DebugStores, shouldDebug, useCurrentComponent, useDebugStoreComponent, } from './useStoreDebug';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
const idFn = (_) => _;
export function useStore(StoreKlass, props, options = defaultOptions) {
    const selectorCb = useCallback(options.selector || idFn, []);
    const selector = options.selector ? selectorCb : options.selector;
    if (options.debug) {
        useDebugStoreComponent(StoreKlass);
    }
    const info = getOrCreateStoreInfo(StoreKlass, props);
    return useStoreFromInfo(info, selector);
}
export function useStoreDebug(StoreKlass, props, selector) {
    useDebugStoreComponent(StoreKlass);
    return useStore(StoreKlass, props, selector);
}
export function createStore(StoreKlass, props) {
    return getOrCreateStoreInfo(StoreKlass, props).store;
}
export function useStoreInstance(instance, debug) {
    const store = instance[UNWRAP_PROXY];
    const uid = getStoreUid(store.constructor, store.props);
    const info = cache.get(uid);
    if (!info) {
        throw new Error(`This store not created using createStore()`);
    }
    if (debug) {
        useDebugStoreComponent(store.constructor);
    }
    return useStoreFromInfo(info);
}
export function useStoreInstanceSelector(instance, selector, debug) {
    const store = instance[UNWRAP_PROXY];
    const uid = getStoreUid(store.constructor, store.props);
    const info = cache.get(uid);
    if (!info) {
        throw new Error(`This store not created using createStore()`);
    }
    if (debug) {
        useDebugStoreComponent(store.constructor);
    }
    return useStoreFromInfo(info, selector);
}
export function createUseStore(StoreKlass) {
    return function (props, options) {
        return useStore(StoreKlass, props, options);
    };
}
export function createUseStoreSelector(StoreKlass, selector) {
    return (props) => {
        return useStore(StoreKlass, props, { selector });
    };
}
export function useStoreSelector(StoreKlass, selector, props) {
    return useStore(StoreKlass, props, { selector });
}
const storeAccessTrackers = new Set();
export function trackStoresAccess(cb) {
    storeAccessTrackers.add(cb);
    return () => {
        storeAccessTrackers.delete(cb);
    };
}
export function useStoreOnce(StoreKlass, props, selector) {
    return useStore(StoreKlass, props, { selector, once: true });
}
export function getStore(StoreKlass, props) {
    return getOrCreateStoreInfo(StoreKlass, props).store;
}
function getOrCreateStoreInfo(StoreKlass, props, opts, propsKeyCalculated) {
    var _a;
    const uid = getStoreUid(StoreKlass, propsKeyCalculated !== null && propsKeyCalculated !== void 0 ? propsKeyCalculated : props);
    if (!(opts === null || opts === void 0 ? void 0 : opts.avoidCache)) {
        const cached = cache.get(uid);
        if (cached) {
            if (cached.storeInstance.constructor.toString() !== StoreKlass.toString()) {
                console.warn('Error: Stores must have a unique name (ignore if this is a hot reload)');
            }
            else {
                return cached;
            }
        }
    }
    const storeInstance = new StoreKlass(props);
    const getters = {};
    const actions = {};
    const stateKeys = [];
    const descriptors = getStoreDescriptors(storeInstance);
    for (const key in descriptors) {
        const descriptor = descriptors[key];
        if (typeof descriptor.value === 'function') {
            actions[key] = descriptor.value;
        }
        else if (typeof descriptor.get === 'function') {
            getters[key] = descriptor.get;
        }
        else {
            if (key !== 'props' && key[0] !== '_') {
                stateKeys.push(key);
            }
        }
    }
    const keyComparators = storeInstance['_comparators'];
    const storeInfo = {
        keyComparators,
        storeInstance,
        getters,
        stateKeys,
        actions,
        gettersState: {
            getCache: new Map(),
            depsToGetter: new Map(),
            curGetKeys: new Set(),
            isGetting: false,
        },
    };
    const store = createProxiedStore(storeInfo);
    if (process.env.NODE_ENV === 'development') {
        allStores[uid] = store;
    }
    (_a = store.mount) === null || _a === void 0 ? void 0 : _a.call(store);
    const value = {
        ...storeInfo,
        store,
    };
    if (!(opts === null || opts === void 0 ? void 0 : opts.avoidCache)) {
        cache.set(uid, value);
    }
    return value;
}
export const allStores = {};
const emptyObj = {};
const selectKeys = (obj, keys) => {
    if (!keys.length) {
        return emptyObj;
    }
    const res = {};
    for (const key of keys) {
        res[key] = obj[key];
    }
    return res;
};
let isInReaction = false;
export const setIsInReaction = (val) => {
    isInReaction = val;
};
function useStoreFromInfo(info, userSelector) {
    const { store } = info;
    if (!store) {
        return null;
    }
    const internal = useRef();
    const component = useCurrentComponent();
    if (!internal.current) {
        internal.current = {
            component,
            isTracking: false,
            firstRun: true,
            tracked: new Set(),
            dispose: null,
            last: null,
            lastKeys: null,
        };
        const dispose = store[ADD_TRACKER](internal.current);
        internal.current.dispose = dispose;
    }
    const curInternal = internal.current;
    const shouldPrintDebug = !!process.env.LOG_LEVEL &&
        (configureOpts.logLevel === 'debug' || shouldDebug(component, info));
    const getSnapshot = useCallback(() => {
        const curInternal = internal.current;
        const keys = curInternal.firstRun ? info.stateKeys : [...curInternal.tracked];
        const nextKeys = `${store._version}${keys.join('')}${(userSelector === null || userSelector === void 0 ? void 0 : userSelector.toString()) || ''}`;
        if (nextKeys === curInternal.lastKeys) {
            if (shouldPrintDebug) {
                console.log('avoid update', nextKeys, curInternal.lastKeys);
            }
            return curInternal.last;
        }
        curInternal.lastKeys = nextKeys;
        let snap;
        setDisableStoreTracking(store, true);
        const last = curInternal.last;
        if (userSelector) {
            snap = userSelector(store);
        }
        else {
            snap = selectKeys(store, keys);
        }
        setDisableStoreTracking(store, false);
        const isUnchanged = typeof last !== 'undefined' &&
            isEqualSubsetShallow(last, snap, {
                keyComparators: info.keyComparators,
            });
        if (shouldPrintDebug) {
            console.log('🌑 getSnapshot', { userSelector, info, isUnchanged, component, keys, snap, curInternal });
        }
        if (isUnchanged) {
            return last;
        }
        curInternal.last = snap;
        return snap;
    }, []);
    const state = useSyncExternalStore(store.subscribe, getSnapshot);
    useEffect(() => {
        return curInternal.dispose;
    }, []);
    if (!userSelector) {
        curInternal.isTracking = true;
        useLayoutEffect(() => {
            curInternal.isTracking = false;
            curInternal.firstRun = false;
            if (shouldPrintDebug) {
                console.log('🌑 finish render, tracking', [...curInternal.tracked]);
            }
        });
    }
    else {
        return state;
    }
    return new Proxy(store, {
        get(target, key) {
            const curVal = Reflect.get(target, key);
            if (isInReaction) {
                return curVal;
            }
            if (Reflect.has(state, key)) {
                return Reflect.get(state, key);
            }
            return curVal;
        },
    });
}
let setters = new Set();
const logStack = new Set();
function createProxiedStore(storeInfo) {
    const { actions, storeInstance, getters, gettersState } = storeInfo;
    const { getCache, curGetKeys, depsToGetter } = gettersState;
    const constr = storeInstance.constructor;
    let didSet = false;
    let isInAction = false;
    const wrappedActions = {};
    for (const key in actions) {
        if (key === 'subscribe') {
            continue;
        }
        const actionFn = actions[key];
        const isGetFn = key.startsWith('get');
        wrappedActions[key] = function useStoreAction(...args) {
            let res;
            try {
                if (isGetFn || gettersState.isGetting) {
                    return Reflect.apply(actionFn, proxiedStore, args);
                }
                if (process.env.NODE_ENV === 'development' && DebugStores.has(constr)) {
                    console.log('(debug) startAction', key, { isInAction });
                }
                isInAction = true;
                res = Reflect.apply(actionFn, proxiedStore, args);
                if (res instanceof Promise) {
                    return res.then(finishAction);
                }
                finishAction();
                return res;
            }
            catch (err) {
                console.error(err.message, err.stack);
                return res;
            }
        };
        if (process.env.NODE_ENV === 'development') {
            if (!key.startsWith('get') && !key.startsWith('_') && key !== 'subscribe') {
                const ogAction = wrappedActions[key];
                wrappedActions[key] = new Proxy(ogAction, {
                    apply(target, thisArg, args) {
                        const isDebugging = DebugStores.has(constr);
                        const shouldLog = process.env.LOG_LEVEL !== '0' &&
                            (isDebugging || configureOpts.logLevel !== 'error');
                        if (!shouldLog) {
                            return Reflect.apply(target, thisArg, args);
                        }
                        setters = new Set();
                        const curSetters = setters;
                        const isTopLevelLogger = logStack.size == 0;
                        const logs = new Set();
                        logStack.add(logs);
                        let res;
                        const id = counter++;
                        try {
                            res = Reflect.apply(target, thisArg, args);
                        }
                        finally {
                            logStack.add('end');
                            const name = constr.name;
                            const color = strColor(name);
                            const simpleArgs = args.map(simpleStr);
                            logs.add([
                                `%c 🌑 ${id} ${name.padStart(isTopLevelLogger ? 8 : 4)}%c.${key}(${simpleArgs.join(', ')})${isTopLevelLogger && logStack.size > 1 ? ` (+${logStack.size - 1})` : ''}`,
                                `color: ${color};`,
                                'color: black;',
                            ]);
                            if (curSetters.size) {
                                curSetters.forEach(({ key, value }) => {
                                    if (typeof value === 'string' ||
                                        typeof value === 'number' ||
                                        typeof value === 'boolean') {
                                        logs.add([` SET ${key} ${value}`, value]);
                                    }
                                    else {
                                        logs.add([` SET ${key}`, value]);
                                    }
                                });
                            }
                            if (isTopLevelLogger) {
                                let error = null;
                                try {
                                    for (const item of [...logStack]) {
                                        if (item === 'end') {
                                            console.groupEnd();
                                            continue;
                                        }
                                        const [head, ...rest] = item;
                                        if (head) {
                                            console.groupCollapsed(...head);
                                            console.groupCollapsed('...');
                                            console.log('args', args);
                                            console.log('response', res);
                                            console.groupCollapsed('trace');
                                            console.trace();
                                            console.groupEnd();
                                            console.groupEnd();
                                            for (const [name, ...log] of rest) {
                                                console.groupCollapsed(name);
                                                console.log(...log);
                                                console.groupEnd();
                                            }
                                        }
                                        else {
                                            console.log('Weird log', head, ...rest);
                                        }
                                    }
                                }
                                catch (err) {
                                    error = err;
                                }
                                for (const _ of [...logStack]) {
                                    console.groupEnd();
                                }
                                if (error) {
                                    console.error(`error loggin`, error);
                                }
                                logStack.clear();
                            }
                            return res;
                        }
                    },
                });
            }
        }
    }
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
    function strColor(str) {
        return `hsl(${hashCode(str) % 360}, 90%, 40%)`;
    }
    const finishAction = () => {
        var _a;
        if (process.env.NODE_ENV === 'development' && DebugStores.has(constr)) {
            console.log('(debug) finishAction', { didSet });
        }
        isInAction = false;
        if (didSet) {
            (_a = storeInstance[TRIGGER_UPDATE]) === null || _a === void 0 ? void 0 : _a.call(storeInstance);
            didSet = false;
        }
    };
    const proxiedStore = new Proxy(storeInstance, {
        get(_, key) {
            if (key in wrappedActions) {
                return wrappedActions[key];
            }
            if (passThroughKeys[key]) {
                return Reflect.get(storeInstance, key);
            }
            if (key === UNWRAP_PROXY) {
                return storeInstance;
            }
            if (key === UNWRAP_STORE_INFO) {
                return storeInfo;
            }
            if (disableTracking.get(storeInstance)) {
                return Reflect.get(storeInstance, key);
            }
            if (typeof key !== 'string') {
                return Reflect.get(storeInstance, key);
            }
            if (storeAccessTrackers.size && !storeAccessTrackers.has(storeInstance)) {
                for (const t of storeAccessTrackers) {
                    t(storeInstance);
                }
            }
            const shouldPrintDebug = process.env.NODE_ENV === 'development' && DebugStores.has(constr);
            if (gettersState.isGetting) {
                gettersState.curGetKeys.add(key);
            }
            else {
                storeInstance[TRACK](key, shouldPrintDebug);
            }
            if (key in getters) {
                if (getCache.has(key)) {
                    return getCache.get(key);
                }
                curGetKeys.clear();
                const isSubGetter = gettersState.isGetting;
                gettersState.isGetting = true;
                const res = getters[key].call(proxiedStore);
                if (!isSubGetter) {
                    gettersState.isGetting = false;
                }
                for (const gk of curGetKeys) {
                    if (!depsToGetter.has(gk)) {
                        depsToGetter.set(gk, new Set());
                    }
                    const cur = depsToGetter.get(gk);
                    cur.add(key);
                }
                getCache.set(key, res);
                return res;
            }
            return Reflect.get(storeInstance, key);
        },
        set(target, key, value, receiver) {
            var _a;
            const cur = Reflect.get(target, key);
            const res = Reflect.set(target, key, value, receiver);
            if (res && cur !== value) {
                if (typeof key === 'string') {
                    clearGetterCache(key);
                }
                if (process.env.LOG_LEVEL && configureOpts.logLevel !== 'error') {
                    setters.add({ key, value });
                    if (storeInstance[SHOULD_DEBUG]()) {
                        console.log('(debug) SET', res, key, value);
                    }
                }
                if (process.env.NODE_ENV === 'development' && DebugStores.has(constr)) {
                    console.log('SET...', { key, value, isInAction });
                }
                if (isInAction) {
                    didSet = true;
                }
                else {
                    (_a = storeInstance[TRIGGER_UPDATE]) === null || _a === void 0 ? void 0 : _a.call(storeInstance);
                }
            }
            return res;
        },
    });
    function clearGetterCache(setKey) {
        const getters = depsToGetter.get(setKey);
        getCache.delete(setKey);
        if (!getters) {
            return;
        }
        for (const gk of getters) {
            getCache.delete(gk);
            if (depsToGetter.has(gk)) {
                clearGetterCache(gk);
            }
        }
    }
    return proxiedStore;
}
let counter = 0;
const passThroughKeys = {
    subscribe: true,
    _version: true,
    _trackers: true,
    $$typeof: true,
    _listeners: true,
    _enableTracking: true,
};

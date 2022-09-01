import { isEqualSubsetShallow } from './comparators';
import { UNWRAP_PROXY } from './constants';
import { setIsInReaction, trackStoresAccess } from './useStore';
import { useEffect, useState } from 'react';
const logUpdate = process.env.NODE_ENV === 'development'
    ? (fn, stores, last, next) => {
        const getStoreLogName = (store) => {
            var _a, _b;
            const str = (_a = store[UNWRAP_PROXY]) !== null && _a !== void 0 ? _a : store;
            return `${str.constructor.name}${((_b = store.props) === null || _b === void 0 ? void 0 : _b.id) ? `:${store.props.id}` : ''}`;
        };
        const storeNames = stores.map(getStoreLogName).join(', ');
        const name = `🌑  ▶️ %c${fn.name} ${storeNames} () ${last} => ${next}`;
        console.groupCollapsed(name, 'color: tomato;');
        console.groupCollapsed('trace >');
        console.trace();
        console.groupEnd();
        console.log('  next', next);
        console.groupEnd();
    }
    : null;
export function selector(fn) {
    let prev = runStoreSelector(fn);
    let disposeValue = null;
    const subscribe = () => {
        return subscribeToStores([...prev.stores], () => {
            try {
                disposeValue === null || disposeValue === void 0 ? void 0 : disposeValue();
                setIsInReaction(true);
                const next = runStoreSelector(fn);
                if (typeof next.value === 'function') {
                    disposeValue = next.value;
                    if (process.env.NODE_ENV === 'development') {
                        logUpdate(fn, [...next.stores], '(fn)', '(fn)');
                    }
                    return;
                }
                if (isEqualSubsetShallow(prev.stores, next.stores) &&
                    isEqualSubsetShallow(prev.value, next.value)) {
                    return;
                }
                if (process.env.NODE_ENV === 'development') {
                    logUpdate(fn, [...next.stores], prev.value, next.value);
                }
                prev = next;
                dispose();
                dispose = subscribe();
            }
            finally {
                setIsInReaction(false);
            }
        });
    };
    let dispose = subscribe();
    return () => {
        dispose();
        disposeValue === null || disposeValue === void 0 ? void 0 : disposeValue();
    };
}
export function useSelector(fn) {
    const [state, setState] = useState(() => {
        return runStoreSelector(fn);
    });
    useEffect(() => {
        let dispose;
        const unsub = subscribeToStores([...state.stores], () => {
            dispose === null || dispose === void 0 ? void 0 : dispose();
            const next = runStoreSelector(fn);
            if (typeof next.value === 'function') {
                if (process.env.NODE_ENV === 'development') {
                    logUpdate(fn, [...next.stores], '(fn)', '(fn)');
                }
                dispose = next.value;
                return;
            }
            setState((prev) => {
                if (isEqualSubsetShallow(prev.stores, next.stores) &&
                    isEqualSubsetShallow(prev.value, next.value)) {
                    return prev;
                }
                if (process.env.NODE_ENV === 'development') {
                    logUpdate(fn, [...next.stores], prev.value, next.value);
                }
                return next;
            });
        });
        return () => {
            unsub();
            dispose === null || dispose === void 0 ? void 0 : dispose();
        };
    }, [...state.stores]);
    return state.value;
}
function runStoreSelector(selector) {
    const stores = new Set();
    const dispose = trackStoresAccess((store) => {
        stores.add(store);
    });
    const value = selector();
    dispose();
    return {
        value,
        stores,
    };
}
function subscribeToStores(stores, onUpdate) {
    const disposes = [];
    for (const store of stores) {
        disposes.push(store.subscribe(onUpdate));
    }
    return () => {
        disposes.forEach((x) => x());
    };
}

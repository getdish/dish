import { useRef } from 'react';
const wkm = new WeakMap();
const weakKey = (obj, prefix = '') => {
    if (wkm.has(obj))
        return wkm.get(obj);
    const key = `${prefix}-${Math.random()}`;
    wkm.set(obj, key);
    return key;
};
export function getStoreUid(Constructor, props) {
    const storeName = process.env.NODE_ENV === 'development' ? Constructor.name : weakKey(Constructor);
    return `${storeName}${!props ? '' : typeof props === 'string' ? props : getKey(props)}`;
}
export const UNWRAP_STORE_INFO = Symbol('UNWRAP_STORE_INFO');
export const cache = new Map();
export function getStoreDescriptors(storeInstance) {
    const proto = Object.getPrototypeOf(storeInstance);
    const instanceDescriptors = Object.getOwnPropertyDescriptors(storeInstance);
    const protoDescriptors = Object.getOwnPropertyDescriptors(proto);
    const descriptors = {
        ...protoDescriptors,
        ...instanceDescriptors,
    };
    delete descriptors.constructor;
    return descriptors;
}
export function get(_, b) {
    return _;
}
export function getKey(props) {
    let s = '';
    const sorted = Object.keys(props).sort();
    for (const key of sorted) {
        const v = props[key];
        if (v && typeof v === 'object') {
            s += getKey(v);
        }
        else {
            s += `.${key}:${v}`;
        }
    }
    return s;
}
export default function useConstant(fn) {
    const ref = useRef();
    if (!ref.current) {
        ref.current = { v: fn() };
    }
    return ref.current.v;
}
export function simpleStr(arg) {
    return typeof arg === 'function'
        ? 'fn'
        : typeof arg === 'string'
            ? `"${arg}"`
            : !arg
                ? arg
                : typeof arg !== 'object'
                    ? arg
                    : Array.isArray(arg)
                        ? '[...]'
                        : `{...}`;
}
export function getStoreDebugInfo(store) {
    var _a;
    return (_a = store[UNWRAP_STORE_INFO]) !== null && _a !== void 0 ? _a : cache.get(getStoreUid(store.constructor, store.props));
}

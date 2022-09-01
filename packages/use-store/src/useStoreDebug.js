import React, { useLayoutEffect } from 'react';
const { ReactCurrentOwner } = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
export const useCurrentComponent = () => {
    return ReactCurrentOwner && ReactCurrentOwner.current && ReactCurrentOwner.current.elementType
        ? ReactCurrentOwner.current.elementType
        : {};
};
export function useDebugStoreComponent(StoreCons) {
    const cmp = useCurrentComponent();
    DebugStores.add(StoreCons);
    if (!DebugComponents.has(cmp)) {
        DebugComponents.set(cmp, new Set());
    }
    const stores = DebugComponents.get(cmp);
    stores.add(StoreCons);
    useLayoutEffect(() => {
        return () => {
            DebugStores.delete(StoreCons);
            stores.delete(StoreCons);
        };
    }, []);
}
export const shouldDebug = (component, info) => {
    var _a, _b;
    const StoreCons = (_a = info.storeInstance) === null || _a === void 0 ? void 0 : _a.constructor;
    return (_b = DebugComponents.get(component)) === null || _b === void 0 ? void 0 : _b.has(StoreCons);
};
export const DebugComponents = new Map();
export const DebugStores = new Set();

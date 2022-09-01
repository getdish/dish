import { isEqualSubsetShallow } from './comparators';
import { UNWRAP_PROXY } from './constants';
import { setIsInReaction } from './useStore';
import { useMemo } from 'react';
const dispose = (d) => {
    if (typeof d === 'function') {
        d();
    }
};
export function useReaction(store, selector, receiver, equalityFn = isEqualSubsetShallow, memoArgs) {
    return useMemo(() => reaction(store, selector, receiver, equalityFn), [memoArgs]);
}
export function reaction(store, selector, receiver, equalityFn = isEqualSubsetShallow) {
    let last = undefined;
    let innerDispose;
    function updateReaction() {
        var _a;
        try {
            setIsInReaction(true);
            const storeInstance = store[UNWRAP_PROXY] || store;
            const next = selector(storeInstance);
            if (!equalityFn(last, next)) {
                if (process.env.NODE_ENV === 'development') {
                    console.groupCollapsed(`🌑  ⏭ %c${receiver.name.padStart(24)} (${storeInstance.constructor.name}${((_a = store.props) === null || _a === void 0 ? void 0 : _a.id) ? `:${store.props.id}` : ''}) ${last} => ${next}`, 'color: chocolate;');
                    console.groupCollapsed('trace >');
                    console.trace();
                    console.groupEnd();
                    console.log('  ARG', next);
                    console.groupEnd();
                }
                dispose(innerDispose);
                last = next;
                innerDispose = receiver(next);
            }
        }
        finally {
            setIsInReaction(false);
        }
    }
    const disposeSubscribe = store.subscribe(updateReaction);
    updateReaction();
    return () => {
        disposeSubscribe();
        dispose(innerDispose);
    };
}

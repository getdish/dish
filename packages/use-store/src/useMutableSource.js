import { useEffect, useRef, useState } from 'react';
const TARGET = '_uMS_T';
const GET_VERSION = '_uMS_V';
export const createMutableSource = (target, getVersion) => ({
    [TARGET]: target,
    [GET_VERSION]: getVersion,
});
export const useMutableSource = (source, getSnapshot, subscribe) => {
    const lastVersion = useRef();
    const currentVersion = source[GET_VERSION](source[TARGET]);
    const [state, setState] = useState(() => [
        source,
        getSnapshot,
        subscribe,
        currentVersion,
        getSnapshot(source[TARGET]),
    ]);
    let currentSnapshot = state[4];
    if (state[0] !== source || state[1] !== getSnapshot || state[2] !== subscribe) {
        currentSnapshot = getSnapshot(source[TARGET]);
        setState([
            source,
            getSnapshot,
            subscribe,
            currentVersion,
            currentSnapshot,
        ]);
    }
    else if (currentVersion !== state[3] && currentVersion !== lastVersion.current) {
        currentSnapshot = getSnapshot(source[TARGET]);
        if (!Object.is(currentSnapshot, state[4])) {
            setState([
                source,
                getSnapshot,
                subscribe,
                currentVersion,
                currentSnapshot,
            ]);
        }
    }
    useEffect(() => {
        let didUnsubscribe = false;
        const checkForUpdates = () => {
            if (didUnsubscribe) {
                return;
            }
            try {
                const nextSnapshot = getSnapshot(source[TARGET]);
                const nextVersion = source[GET_VERSION](source[TARGET]);
                lastVersion.current = nextVersion;
                setState((prev) => {
                    if (prev[0] !== source || prev[1] !== getSnapshot || prev[2] !== subscribe) {
                        return prev;
                    }
                    if (Object.is(prev[4], nextSnapshot)) {
                        return prev;
                    }
                    return [
                        prev[0],
                        prev[1],
                        prev[2],
                        nextVersion,
                        nextSnapshot,
                    ];
                });
            }
            catch (e) {
                setState((prev) => [...prev]);
            }
        };
        const unsubscribe = subscribe(source[TARGET], checkForUpdates);
        checkForUpdates();
        return () => {
            didUnsubscribe = true;
            unsubscribe();
        };
    }, [source, getSnapshot, subscribe]);
    return currentSnapshot;
};

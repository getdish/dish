import { UNWRAP_PROXY } from './constants';
import { shouldDebug } from './useStoreDebug';
export const TRIGGER_UPDATE = Symbol();
export const ADD_TRACKER = Symbol();
export const TRACK = Symbol();
export const SHOULD_DEBUG = Symbol();
export const disableTracking = new WeakMap();
export const setDisableStoreTracking = (storeInstance, val) => {
    var _a;
    const store = (_a = storeInstance[UNWRAP_PROXY]) !== null && _a !== void 0 ? _a : storeInstance;
    disableTracking.set(store, val);
};
export class Store {
    constructor(props) {
        this.props = props;
        this._listeners = new Set();
        this._trackers = new Set();
        this._version = 0;
        this.subscribe = (onChanged) => {
            this._listeners.add(onChanged);
            return () => {
                this._listeners.delete(onChanged);
            };
        };
    }
    [TRIGGER_UPDATE]() {
        this._version = (this._version + 1) % Number.MAX_SAFE_INTEGER;
        for (const cb of this._listeners) {
            if (typeof cb !== 'function') {
                console.error('error', cb, this._listeners);
                continue;
            }
            cb();
        }
    }
    [ADD_TRACKER](tracker) {
        this._trackers.add(tracker);
        return () => {
            this._trackers.delete(tracker);
        };
    }
    [TRACK](key, debug) {
        if (key[0] === '_' || key[0] === '$' || key === 'props' || key === 'toJSON') {
            return;
        }
        if (debug) {
            console.log('(debug) CHECK TRACKERS FOR', key);
        }
        for (const tracker of this._trackers) {
            if (tracker.isTracking) {
                tracker.tracked.add(key);
                if (debug) {
                    console.log('(debug) TRACK', key, tracker);
                }
            }
        }
    }
    [SHOULD_DEBUG]() {
        const info = { storeInstance: this };
        return [...this._trackers].some((tracker) => tracker.component && shouldDebug(tracker.component, info));
    }
}

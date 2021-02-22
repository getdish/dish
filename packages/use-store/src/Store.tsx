import { shouldDebug } from './useStoreDebug'

export const TRIGGER_UPDATE = Symbol()
export const ADD_TRACKER = Symbol()
export const TRACK = Symbol()
export const SHOULD_DEBUG = Symbol()

export type StoreTracker = {
  isTracking: boolean
  tracked: Set<string>
  dispose: () => void
  component?: any
  firstRun: boolean
}

export class Store<Props extends Object | null = null> {
  private _listeners = new Set<Function>()
  private _trackers = new Set<StoreTracker>()

  constructor(public props: Props) {}

  subscribe(onChanged: Function) {
    this._listeners.add(onChanged)
    return () => {
      this._listeners.delete(onChanged)
    }
  }

  [TRIGGER_UPDATE]() {
    this._listeners.forEach((cb) => cb())
  }

  [ADD_TRACKER](tracker: StoreTracker) {
    let tracked = new Set<string>()
    this._trackers.add(tracker)
    return () => {
      this._trackers.delete(tracker)
    }
  }

  [TRACK](key: string) {
    this._trackers.forEach((tracker) => {
      if (tracker.isTracking) {
        tracker.tracked.add(key)
      }
    })
  }

  [SHOULD_DEBUG]() {
    const info = { storeInstance: this }
    return [...this._trackers].some(
      (tracker) => tracker.component && shouldDebug(tracker.component, info)
    )
  }
}

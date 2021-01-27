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
}

export class Store<Props extends Object | null = null> {
  private listeners = new Set<Function>()
  private trackers = new Set<StoreTracker>()

  constructor(public props: Props) {}

  subscribe(onChanged: Function) {
    this.listeners.add(onChanged)
    return () => {
      this.listeners.delete(onChanged)
    }
  }

  [TRIGGER_UPDATE]() {
    this.listeners.forEach((cb) => cb())
  }

  [ADD_TRACKER](tracker: StoreTracker) {
    let tracked = new Set<string>()
    this.trackers.add(tracker)
    return () => {
      this.trackers.delete(tracker)
    }
  }

  [TRACK](key: string) {
    this.trackers.forEach((tracker) => {
      if (tracker.isTracking) {
        tracker.tracked.add(key)
      }
    })
  }

  [SHOULD_DEBUG]() {
    return [...this.trackers].some(
      (tracker) => tracker.component && shouldDebug(tracker.component, this)
    )
  }
}

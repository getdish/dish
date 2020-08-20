export const TRIGGER_UPDATE = Symbol()

export class Store<A extends Object | null = null> {
  private listeners = new Set<Function>()

  constructor(public props: A) {}

  mount() {}

  subscribe(onChanged: Function) {
    this.listeners.add(onChanged)
    return () => {
      this.listeners.delete(onChanged)
    }
  }

  [TRIGGER_UPDATE] = () => {
    this.listeners.forEach((cb) => cb())
  }
}

import { DebugStores } from '.'

export const TRIGGER_UPDATE = Symbol()
const LISTENERS = Symbol()

export class Store<A extends Object | null = null> {
  private [LISTENERS] = new Set<Function>()

  constructor(public props: A) {}

  mount() {}

  subscribe(onChanged: Function) {
    this[LISTENERS].add(onChanged)
    return () => {
      this[LISTENERS].delete(onChanged)
    }
  }

  [TRIGGER_UPDATE] = () => {
    this[LISTENERS].forEach((cb) => cb())
    if (
      process.env.NODE_ENV === 'development' &&
      DebugStores.has(this.constructor)
    ) {
      console.log(
        `📤 ${this.constructor.name} - updating components (${this[LISTENERS].size})`
      )
    }
  }
}

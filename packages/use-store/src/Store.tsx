export const TRIGGER_UPDATE = Symbol()
const LISTENERS = Symbol('listeners')

export class Store<Props extends Object | null = null> {
  private [LISTENERS] = new Set<Function>()

  constructor(public props: Props) {}

  subscribe(onChanged: Function) {
    this[LISTENERS].add(onChanged)
    return () => {
      this[LISTENERS].delete(onChanged)
    }
  }

  [TRIGGER_UPDATE]() {
    this[LISTENERS].forEach((cb) => cb())
  }
}

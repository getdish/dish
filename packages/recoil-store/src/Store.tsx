export class Store<A extends Object | null = null> {
  constructor(public props: A) {}
}

import { RestaurantOnlyIdsPartial } from '@dish/graph'
import { Store, createStore } from '@dish/use-store'

class HomePageStore extends Store {
  results: RestaurantOnlyIdsPartial[] = []

  setResults(next: RestaurantOnlyIdsPartial[]) {
    this.results = next
  }
}

export const homePageStore = createStore(HomePageStore)

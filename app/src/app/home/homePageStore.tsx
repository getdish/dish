import { RestaurantOnlyIdsPartial } from '@dish/graph'
import { Store, createStore } from '@tamagui/use-store'

class HomePageStore extends Store {
  results: RestaurantOnlyIdsPartial[] = []

  setResults(next: RestaurantOnlyIdsPartial[]) {
    this.results = next
  }
}

export const homePageStore = createStore(HomePageStore)

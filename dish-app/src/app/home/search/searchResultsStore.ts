import { Store, createStore, useStoreInstance } from '@dish/use-store'

class SearchResultsStore extends Store {
  restaurantPositions: Record<string, number | undefined> = {}

  setRestaurantPositions(obj: Record<string, number>) {
    this.restaurantPositions = obj
  }
}

export const searchResultsStore = createStore(SearchResultsStore)
export const useSearchResultsStore = () => useStoreInstance(searchResultsStore)

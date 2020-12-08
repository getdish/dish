import { Store } from '@dish/use-store'

export class SearchResultsStore extends Store {
  restaurantPositions: Record<string, number | undefined> = {}

  setRestaurantPositions(obj: Record<string, number>) {
    this.restaurantPositions = obj
  }
}

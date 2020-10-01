import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'

export const getRestaurantDeliverySources = (restaurantSources: any) => {
  return Object.keys(restaurantSources ?? {})
    .map((id) => ({
      ...thirdPartyCrawlSources[id],
      ...restaurantSources[id],
      id,
    }))
    .filter((x) => x?.delivery)
}

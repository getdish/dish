import { DISH_DEBUG } from '../constants'
import { scrapeGetData } from '../scrape-helpers'
import { Self } from './Self'

// Note that there is no unit or reference point for these values. All that
// matters is simply the relative differences between them. For example therefore
// there is no need to ensure that the maximum value is 1.0 or 100%.
export const RESTAURANT_WEIGHTS = {
  yelp: 0.6,
  tripadvisor: 0.6,
  michelin: 1.0,
  infatuated: 0.9,
  ubereats: 0.2,
  doordash: 0.2,
  grubhub: 0.2,
  google: 0.4,
}

export class RestaurantRatings {
  crawler: Self

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  getRatings() {
    const rating = (r: any) => (typeof r === 'string' ? +r : r ?? null)
    const ratings = {
      yelp: rating(scrapeGetData(this.crawler.yelp, (x) => x.json.aggregateRating.ratingValue)),
      ubereats: rating(scrapeGetData(this.crawler.ubereats, (x) => x.main.rating.ratingValue)),
      infatuated: rating(this._infatuatedRating()),
      tripadvisor: rating(
        scrapeGetData(this.crawler.tripadvisor, (x) => x.overview.rating.primaryRating)
      ),
      michelin: rating(this._getMichelinRating()),
      doordash: rating(this._doorDashRating()),
      grubhub: rating(scrapeGetData(this.crawler.grubhub, (x) => x.main.rating.rating_value)),
      google: rating(scrapeGetData(this.crawler.google, (x) => x.rating)),
    }
    return {
      rating: this.weightRatings(ratings, RESTAURANT_WEIGHTS),
      ratings,
    }
  }

  _infatuatedRating() {
    const rating = scrapeGetData(
      this.crawler.infatuated,
      (x) => x.data_from_search_list_item.post.rating
    )
    if (rating < 0) return NaN
    return parseFloat(rating) / 2
  }

  _doorDashRating() {
    const rating = scrapeGetData(
      this.crawler.doordash,
      (x) => x.main.averageRating ?? x.main.rating.ratingValue
    )
    return rating == 0 ? null : rating
  }

  weightRatings(
    ratings: { [source: string]: number | null },
    master_weights: { [source: string]: number }
  ) {
    const weights: { [source: string]: number } = {}
    let total_weight = 0
    let final_rating = 0
    const denulledRatings: { [source: string]: number } = {}

    for (const source in ratings) {
      const rating = ratings[source]
      // rating === 0 should be impossible and mean no votes at all, so ignore that too
      if (Number.isNaN(rating) || typeof rating !== 'number' || rating === 0) {
        continue
      } else {
        weights[source] = master_weights[source]
        denulledRatings[source] = rating
        total_weight += master_weights[source]
      }
    }

    for (const source in denulledRatings) {
      const rating = denulledRatings[source]
      const normalised_weight = weights[source] / total_weight
      final_rating += rating * normalised_weight
    }

    if (DISH_DEBUG > 1) {
      console.log('Calculated final rating', { final_rating, total_weight, ratings, weights })
    }

    return final_rating
  }

  private _getMichelinRating() {
    const rating = scrapeGetData(this.crawler.michelin, (x) => x.main.michelin_award)
    if (rating == '') {
      return NaN
    }
    switch (rating) {
      case 'ONE_STAR':
        return 4.8
      case 'TWO_STARS':
        return 4.9
      case 'THREE_STARS':
        return 5.0
      default:
        return 4.7
    }
  }
}

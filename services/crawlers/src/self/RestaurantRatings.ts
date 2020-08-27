import { RESTAURANT_WEIGHTS } from '@dish/graph'

import { scrapeGetData } from '../scrape-helpers'
import { Self } from './Self'

export class RestaurantRatings {
  crawler: Self

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  mergeRatings() {
    this.crawler.ratings = {
      yelp: parseFloat(
        scrapeGetData(this.crawler.yelp, 'data_from_map_search.rating')
      ),
      ubereats: parseFloat(
        scrapeGetData(this.crawler.ubereats, 'main.rating.ratingValue')
      ),
      infatuated: this._infatuatedRating(),
      tripadvisor: parseFloat(
        scrapeGetData(this.crawler.tripadvisor, 'overview.rating.primaryRating')
      ),
      michelin: this._getMichelinRating(),
      doordash: this._doorDashRating(),
      grubhub: parseFloat(
        scrapeGetData(this.crawler.grubhub, 'main.rating.rating_value')
      ),
      google: parseFloat(scrapeGetData(this.crawler.google, 'rating')),
    }
    this.crawler.restaurant.rating = this.weightRatings(
      this.crawler.ratings,
      RESTAURANT_WEIGHTS
    )
  }

  _infatuatedRating() {
    const rating = scrapeGetData(
      this.crawler.infatuated,
      'data_from_map_search.post.rating'
    )
    if (rating < 0) return NaN
    return parseFloat(rating) / 2
  }

  _doorDashRating() {
    const rating = scrapeGetData(this.crawler.doordash, 'main.averageRating')
    return rating == 0 ? null : rating
  }

  weightRatings(
    ratings: { [source: string]: number },
    master_weights: { [source: string]: number }
  ) {
    let weights: { [source: string]: number } = {}
    let total_weight = 0
    let final_rating = 0
    Object.entries(ratings).forEach(([source, rating]) => {
      if (Number.isNaN(rating) || typeof rating !== 'number') {
        delete ratings[source]
      } else {
        weights[source] = master_weights[source]
        total_weight += master_weights[source]
      }
    })
    Object.entries(ratings).forEach(([source, rating]) => {
      const normalised_weight = weights[source] / total_weight
      final_rating += rating * normalised_weight
    })
    return final_rating
  }

  private _getMichelinRating() {
    const rating = scrapeGetData(this.crawler.michelin, 'main.michelin_award')
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

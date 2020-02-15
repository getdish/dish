import '@dish/common'

import _ from 'lodash'

import { QueueOptions, JobOptions } from 'bull'
import { WorkerJob } from '@dish/worker'
import { Scrape, Restaurant, Dish } from '@dish/models'

const PER_PAGE = 50

export class Self extends WorkerJob {
  yelp!: Scrape
  ubereats!: Scrape
  restaurant!: Restaurant

  static queue_config: QueueOptions = {
    limiter: {
      max: 3,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async main() {
    const total = await Restaurant.allCount()
    for (let page = 0; page * PER_PAGE <= total; page++) {
      this.runOnWorker('fetchBatch', [page])
    }
  }

  async fetchBatch(page: number) {
    const restaurants = await Restaurant.fetchBatch(PER_PAGE, page)
    for (let restaurant of restaurants) {
      this.mergeAll(restaurant)
    }
  }

  async mergeAll(restaurant: Restaurant) {
    this.restaurant = restaurant
    await this.getScrapeData()
    if (!('data' in this.yelp)) {
      return
    }
    this.mergeName()
    this.mergeTelephone()
    this.mergeAddress()
    this.mergeRatings()
    this.mergeImage()
    this.mergeCategories()
    this.mergePhotos()
    await this.restaurant.update()
    await this.upsertUberDishes()
  }

  async getScrapeData() {
    this.yelp = await this.restaurant.getLatestScrape('yelp')
    this.ubereats = await this.restaurant.getLatestScrape('ubereats')
  }

  mergeName() {
    this.restaurant.name = this.merge([
      this.yelp.getData('data_from_map_search.name'),
      this.ubereats.getData('main.title'),
    ])
  }

  mergeTelephone() {
    this.restaurant.telephone = this.merge([
      this.yelp.getData('data_from_map_search.phone'),
      this.ubereats.getData('main.phoneNumber'),
    ])
  }

  mergeRatings() {
    let ratings = [
      this.yelp.getData('data_from_map_search.rating'),
      this.ubereats.getData('main.ratingBadge[0].children[0].text'),
    ]
    ratings = ratings.map(r => parseFloat(r))
    for (const rating of ratings) {
      if (Number.isNaN(rating)) {
        return
      }
    }
    this.restaurant.rating = _.mean(ratings)
  }

  mergeAddress() {
    const yelp_address_path =
      'data_from_html_embed.mapBoxProps.addressProps.addressLines'
    this.restaurant.address = this.merge([
      this.yelp.getData(yelp_address_path, ['']).join(', '),
      this.ubereats.getData('main.location.address'),
    ])
  }

  mergeImage() {
    const heroes = this.yelp.getData(
      'data_from_html_embed.photoHeaderProps.photoHeaderMedias'
    )
    if (heroes) {
      this.restaurant.image = heroes[0].srcUrl
    }
  }

  mergeCategories() {
    this.restaurant.categories = this.yelp
      .getData('data_from_map_search.categories', [])
      .map(c => c.title)
  }

  // TODO: If we really want to be careful about being found out for scraping then we
  // need at least 2 identical sources and something better than just resorting to the
  // shortest version.
  merge(strings: string[]) {
    let overlaps: string[] = []
    for (let pair of Self.allPairs(strings)) {
      const overlap = Self.findOverlap(pair[0], pair[1])
      if (overlap) {
        overlaps.push(overlap)
      }
    }

    const shortest_string = Self.shortestString(strings)
    const shortest_overlap = Self.shortestString(overlaps)
    if (shortest_overlap.length) {
      return shortest_overlap
    } else {
      return shortest_string
    }
  }

  async upsertUberDishes() {
    if (!this.ubereats.id) {
      return
    }
    for (const data of this.ubereats.data.dishes) {
      const dish = new Dish({
        restaurant_id: this.restaurant.id,
        name: data.title,
        description: data.description,
        price: data.price,
        image: data.imageUrl,
      })
      await dish.upsert()
    }
  }

  mergePhotos() {
    let photos: string[] = []
    let page = 0
    let key: string
    while (true) {
      key = 'photosp' + page
      if (key in this.yelp.data) {
        photos = photos.concat(this.yelp.data[key].map(p => p.src))
      } else {
        break
      }
      if (photos.length > 50) {
        break
      }
      page++
    }
    this.restaurant.photos = photos
  }

  private static shortestString(arr: string[]) {
    if (arr.length) {
      return arr.reduce((a, b) => (a.length <= b.length ? a : b))
    } else {
      return ''
    }
  }

  private static allPairs(arr: string[]) {
    return arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat()
  }

  private static findOverlap(a: string, b: string) {
    if (a.includes(b)) {
      return b
    }
    if (b.includes(a)) {
      return a
    }
    return null
  }
}

import '@dish/common'

import _ from 'lodash'

import { QueueOptions, JobOptions } from 'bull'
import { WorkerJob } from '@dish/worker'
import { Scrape, Restaurant, Dish } from '@dish/models'

const PER_PAGE = 50

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

const sanfran = {
  location: {
    _st_d_within: {
      distance: 0.5,
      from: {
        type: 'Point',
        coordinates: [-122.421351, 37.759251],
      },
    },
  },
}

export class Self extends WorkerJob {
  yelp!: Scrape
  ubereats!: Scrape
  infatuated!: Scrape
  michelin!: Scrape
  tripadvisor!: Scrape
  restaurant!: Restaurant

  static queue_config: QueueOptions = {
    limiter: {
      max: 50,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async main() {
    let previous_id = '00000000-0000-0000-0000-000000000000'
    while (true) {
      const results = await Restaurant.fetchBatch(
        PER_PAGE,
        previous_id,
        {},
        sanfran
      )
      if (results.length == 0) {
        break
      }
      for (const result of results) {
        this.runOnWorker('mergeAll', [result.id])
        previous_id = result.id
        if (process.env.RUN_WITHOUT_WORKER == 'true') {
          await sleep(100)
        }
      }
    }
  }

  async mergeAll(id: string) {
    let restaurant = new Restaurant()
    await restaurant.findOne('id', id)
    this.restaurant = restaurant
    console.log('Merging: ' + this.restaurant.name)
    await this.getScrapeData()
    if (!('data' in this.yelp) && !('data' in this.ubereats)) {
      console.log(
        `Deleting ${this.restaurant.name} for not having any scrape data`
      )
      await this.restaurant.delete()
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
    this.infatuated = await this.restaurant.getLatestScrape('infatuated')
    this.michelin = await this.restaurant.getLatestScrape('michelin')
    this.tripadvisor = await this.restaurant.getLatestScrape('tripadvisor')
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

  mergeName() {
    this.restaurant.name = this.merge([
      this.yelp.getData('data_from_map_search.name'),
      this.ubereats.getData('main.title'),
      this.infatuated.getData('data_from_map_search.name'),
      this.michelin.getData('main.name'),
      this.tripadvisor.getData('overview.name'),
    ])
  }

  mergeTelephone() {
    this.restaurant.telephone = this.merge([
      this.yelp.getData('data_from_map_search.phone'),
      this.ubereats.getData('main.phoneNumber'),
      this.infatuated.getData('data_from_html_embed.phone_number'),
      this.tripadvisor.getData('overview.contact.phone'),
    ])
  }

  mergeRatings() {
    let ratings = [
      this.yelp.getData('data_from_map_search.rating'),
      this.ubereats.getData('main.ratingBadge[0].children[0].text'),
      parseFloat(this.infatuated.getData('data_from_map_search.post.rating')) /
        2,
      this.tripadvisor.getData('overview.rating.primaryRating'),
    ]
    ratings = ratings.concat(this._getMichelinRating())
    ratings = ratings.map(r => parseFloat(r))
    for (const rating of ratings) {
      if (Number.isNaN(rating)) {
        return
      }
    }
    this.restaurant.rating = _.mean(ratings)
  }

  private _getMichelinRating() {
    const rating = this.michelin.getData('main.michelin_award')
    switch (rating) {
      case 'ONE_STAR':
        return [5.0, 5.0]
      case 'TWO_STARS':
        return [5.0, 5.0, 5.0]
      case 'THREE_STARS':
        return [5.0, 5.0, 5.0, 5.0]
      default:
        return [5.0]
    }
  }

  mergeAddress() {
    const yelp_address_path =
      'data_from_html_embed.mapBoxProps.addressProps.addressLines'
    this.restaurant.address = this.merge([
      this.yelp.getData(yelp_address_path, ['']).join(', '),
      this.ubereats.getData('main.location.address'),
      this.infatuated.getData('data_from_map_search.street'),
      this.michelin.getData('main.title'),
      this.tripadvisor.getData('overview.contact.address'),
    ])
  }

  mergeImage() {
    let hero = ''
    const yelps = this.yelp.getData(
      'data_from_html_embed.photoHeaderProps.photoHeaderMedias'
    )
    if (yelps) {
      hero = yelps[0].srcUrl
    }
    const infatuateds = this.infatuated.getData(
      'data_from_map_search.post.venue_image'
    )
    if (infatuateds) {
      hero = infatuateds
    }
    const michelins = this.michelin.getData('main.image')
    if (michelins) {
      hero = michelins
    }

    this.restaurant.image = hero
  }

  mergeCategories() {
    const yelps = this.yelp
      .getData('data_from_map_search.categories', [])
      .map(c => c.title)
    const tripadvisors = this.tripadvisor
      .getData('overview.detailCard.tagTexts.cuisines.tags', [])
      .map(c => c.tagValue)
    this.restaurant.categories = _.uniq(yelps.concat(tripadvisors))
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
    photos = this._getYelpPhotos()
    photos = photos.concat(this.tripadvisor.getData('photos', []))
    this.restaurant.photos = photos
  }

  private _getYelpPhotos() {
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
    return photos
  }

  private static shortestString(arr: string[]) {
    arr = arr.filter(el => {
      return el != null && el != ''
    })
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

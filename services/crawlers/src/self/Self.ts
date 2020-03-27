import '@dish/common'

import _ from 'lodash'
import { Base64 } from 'js-base64'

import { QueueOptions, JobOptions } from 'bull'
import { WorkerJob } from '@dish/worker'
import { Scrape, Restaurant, Dish } from '@dish/models'
import { Tripadvisor } from '../tripadvisor/Tripadvisor'
import { db } from '../utils'

const PER_PAGE = 50

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

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
  ratings!: { [key: string]: number }

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
    db.start()
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
    await db.client.end()
  }

  async mergeAll(id: string) {
    let restaurant = new Restaurant()
    await restaurant.findOne('id', id)
    this.restaurant = restaurant
    console.log('Merging: ' + this.restaurant.name)
    await this.getScrapeData()
    this.mergeName()
    this.mergeTelephone()
    this.mergeAddress()
    this.mergeRatings()
    this.mergeImage()
    await this.mergeTags()
    this.mergePhotos()
    this.addWebsite()
    this.addSources()
    this.addPriceRange()
    this.addHours()
    await this.restaurant.update()
    await this.upsertUberDishes()
    return this.restaurant
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
    const tripadvisor_name = Tripadvisor.cleanName(
      this.tripadvisor.getData('overview.name')
    )
    this.restaurant.name = this.merge([
      this.yelp.getData('data_from_map_search.name'),
      this.ubereats.getData('main.title'),
      this.infatuated.getData('data_from_map_search.name'),
      this.michelin.getData('main.name'),
      tripadvisor_name,
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
    this.ratings = {
      yelp: parseFloat(this.yelp.getData('data_from_map_search.rating')),
      ubereats: parseFloat(
        this.ubereats.getData('main.ratingBadge[0].children[0].text')
      ),
      infatuated:
        parseFloat(
          this.infatuated.getData('data_from_map_search.post.rating')
        ) / 2,
      tripadvisor: parseFloat(
        this.tripadvisor.getData('overview.rating.primaryRating')
      ),
      michelin: this._getMichelinRating(),
    }
    this.restaurant.rating = this.weightRatings(
      this.ratings,
      Restaurant.WEIGHTS
    )
  }

  weightRatings(
    ratings: { [source: string]: number },
    master_weights: { [source: string]: number }
  ) {
    let weights: { [source: string]: number } = {}
    let total_weight = 0
    let final_rating = 0
    Object.entries(ratings).forEach(([source, rating]) => {
      if (Number.isNaN(rating)) {
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
    const rating = this.michelin.getData('main.michelin_award')
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

  addWebsite() {
    let website = this.tripadvisor.getData('overview.contact.website')
    website = Base64.decode(website)
    const parts = website.split('_')
    parts.shift()
    parts.pop()
    this.restaurant.website = parts.join('_')
  }

  addPriceRange() {
    this.restaurant.price_range = this.tripadvisor.getData(
      'overview.detailCard.numericalPrice'
    )
  }

  addHours() {
    this.restaurant.hours = this.yelp.getData(
      'data_from_html_embed.bizHoursProps.hoursInfoRows',
      []
    )
  }

  addSources() {
    let url: string
    let path: string
    let parts: string[]

    this.restaurant.sources = {} as {
      [key: string]: { url: string; rating: number }
    }

    path = this.tripadvisor.getData('overview.links.warUrl')
    if (path != '') {
      parts = path.split('-')
      parts.shift()
      url = 'https://www.tripadvisor.com/' + parts.join('-')
      this.restaurant.sources.tripadvisor = {
        url: url,
        rating: this.ratings?.tripadvisor,
      }
    }

    path = this.yelp.getData('data_from_map_search.businessUrl')
    if (path != '') {
      this.restaurant.sources.yelp = {
        url: 'https://www.yelp.com' + path,
        rating: this.ratings?.yelp,
      }
    }

    path = this.infatuated.getData('data_from_map_search.post.review_link')
    if (path != '') {
      this.restaurant.sources.infatuation = {
        url: 'https://www.theinfatuation.com' + path,
        rating: this.ratings?.infatuation,
      }
    }

    path = this.michelin.getData('main.url')
    if (path != '') {
      this.restaurant.sources.michelin = {
        url: 'https://guide.michelin.com' + path,
        rating: this.ratings?.michelin,
      }
    }

    const json = JSON.parse(this.ubereats.getData('main.metaJson', '"{}"'))
    if (json['@id']) {
      this.restaurant.sources.ubereats = {
        url: json['@id'],
        rating: this.ratings?.ubereats,
      }
    }
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

  async mergeTags() {
    const yelps = this.yelp
      .getData('data_from_map_search.categories', [])
      .map((c) => c.title)
    const tripadvisors = this.tripadvisor
      .getData('overview.detailCard.tagTexts.cuisines.tags', [])
      .map((c) => c.tagValue)
    await this.restaurant.upsertTags(_.uniq([...yelps, ...tripadvisors]))
    await this.updateTagRankings()
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
    this.restaurant.photos = [
      ...this._getYelpPhotos(),
      ...this.tripadvisor.getData('photos', []),
    ]
  }

  async updateTagRankings() {
    const tag_rankings = await Promise.all(
      this.restaurant.tag_names.map(async (tag) => {
        return [tag, await this.getRankForTag(tag)]
      })
    )
    this.restaurant.tag_rankings = tag_rankings
  }

  async getRankForTag(tag: string) {
    const RADIUS = 0.1
    tag = tag.toLowerCase()
    const result = await db.client.query(
      `SELECT rank FROM (
        SELECT id, DENSE_RANK() OVER(ORDER BY rating DESC NULLS LAST) AS rank
        FROM restaurant WHERE
          ST_DWithin(location, location, ${RADIUS})
          AND
          tag_names @> '"${tag}"'
      ) league
      WHERE id = '${this.restaurant.id}'`
    )
    return parseInt(result.rows[0].rank)
  }

  private _getYelpPhotos() {
    let photos: string[] = []
    let page = 0
    let key: string
    if (!this.yelp.data) {
      return []
    }
    while (true) {
      key = 'photosp' + page
      if (key in this.yelp.data) {
        photos = photos.concat(this.yelp.data[key].map((p) => p.src))
      } else {
        // Allow scrapers to start their pages on both 0 and 1
        if (page > 0) {
          break
        }
      }
      if (photos.length > 50) {
        break
      }
      page++
    }
    return photos
  }

  private static shortestString(arr: string[]) {
    arr = arr.filter((el) => {
      return el != null && el != ''
    })
    if (arr.length) {
      return arr.reduce((a, b) => (a.length <= b.length ? a : b))
    } else {
      return ''
    }
  }

  private static allPairs(arr: string[]) {
    return arr.map((v, i) => arr.slice(i + 1).map((w) => [v, w])).flat()
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

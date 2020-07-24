import {
  PhotoXref,
  RestaurantTag,
  Tag,
  convertSimpleTagsToRestaurantTags,
  restaurantGetAllPossibleTags,
  scrapeGetData,
  tagFindCountries,
  tagSlug,
} from '@dish/graph'
import { mean, uniq } from 'lodash'
import Sentiment from 'sentiment'

import { sql } from '../utils'
import { Self } from './Self'

export class Tagging {
  crawler: Self
  restaurant_tags: RestaurantTag[] = []
  restaurant_tag_ratings: {
    [key: string]: number[]
  } = {}
  all_tags: Tag[] = []
  _found_tags: { [key: string]: Partial<RestaurantTag> } = {}
  SPECIAL_FILTER_THRESHOLD = 3

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  async main() {
    const yelps = scrapeGetData(
      this.crawler.yelp,
      'data_from_map_search.categories',
      []
    ).map((c) => c.title)
    const tripadvisors = scrapeGetData(
      this.crawler.tripadvisor,
      'overview.detailCard.tagTexts.cuisines.tags',
      []
    ).map((c) => c.tagValue)
    const tags = uniq([...yelps, ...tripadvisors])
    const orphan_tags = await this.upsertCountryTags(tags)
    if (orphan_tags.length) {
      await this.addSimpleTags(orphan_tags)
    }
  }

  async addSimpleTags(tags: string[]) {
    this.addRestaurantTags(await convertSimpleTagsToRestaurantTags(tags))
  }

  addRestaurantTags(restaurant_tags: RestaurantTag[]) {
    this.restaurant_tags = [...this.restaurant_tags, ...restaurant_tags]
  }

  async upsertCountryTags(tags: string[]) {
    this.crawler._start_time = process.hrtime()
    const country_tags = await tagFindCountries(tags)
    this.addRestaurantTags(
      country_tags.map((tag: Tag) => {
        return {
          tag_id: tag.id,
        } as RestaurantTag
      })
    )
    const orphan_tags = this._extractOrphanTags(tags, country_tags)
    this.crawler.logTime('upsert country tags')
    return orphan_tags
  }

  _extractOrphanTags(tags: string[], country_tags: Tag[]) {
    return tags.filter((tag) => {
      const is_a_country_name = country_tags.find((ct) => {
        const is_common_name_match = ct.name == tag
        const is_alternate_name_match = (ct.alternates || ['']).includes(tag)
        return is_common_name_match || is_alternate_name_match
      })
      return !is_a_country_name
    })
  }

  async updateTagRankings() {
    await Promise.all(
      (this.crawler.restaurant.tags || []).map(async (i) => {
        this.restaurant_tags.push({
          tag_id: i.tag.id,
          rank: await this.getRankForTag(i.tag),
        })
      })
    )
  }

  async getRankForTag(tag: Tag) {
    const RADIUS = 0.1
    const tag_name = tagSlug(tag)
    const result = await sql(
      `SELECT rank FROM (
        SELECT id, DENSE_RANK() OVER(ORDER BY rating DESC NULLS LAST) AS rank
        FROM restaurant WHERE
          ST_DWithin(location, location, ${RADIUS})
          AND
          tag_names @> '"${tag_name}"'
      ) league
      WHERE id = '${this.crawler.restaurant.id}'`
    )
    return parseInt(result.rows[0].rank)
  }

  async setDefaultTagImages() {
    await sql(
      `UPDATE tag set default_images = (
         SELECT photos FROM restaurant_tag rt
         WHERE rt.tag_id = tag.id
           AND photos IS NOT NULL
         ORDER BY rt.rating DESC NULLS LAST
         LIMIT 1
      )`
    )
  }

  async scanCorpus() {
    this._found_tags = {}
    this.all_tags = await restaurantGetAllPossibleTags(this.crawler.restaurant)
    this.restaurant_tag_ratings = {}
    const all_reviews = [
      ...this._scanYelpReviewsForTags(),
      ...this._scanTripadvisorReviewsForTags(),
      ...this._scanGoogleReviewsForTags(),
      ...this._scanMenuItemsForTags(),
    ]
    this.findDishesInText(all_reviews)
    await this.findVegInText(all_reviews)
    await this._averageAndPersistTagRatings()
  }

  async findPhotosForTags() {
    const all_possible_tags = await restaurantGetAllPossibleTags(
      this.crawler.restaurant
    )
    const all_tag_photos: PhotoXref[] = []
    if (this.crawler.yelp?.data) {
      const photos = this.crawler.getPaginatedData(
        this.crawler.yelp?.data,
        'photos'
      )
      for (const tag of all_possible_tags) {
        let restaurant_tag: RestaurantTag = {
          tag_id: tag.id,
          // @ts-ignore
          photos: [] as string[],
        }
        let is_at_least_one_photo = false
        for (const photo of photos) {
          if (this._doesStringContainTag(photo.media_data?.caption, tag.name)) {
            is_at_least_one_photo = true
            all_tag_photos.push({
              restaurant_id: this.crawler.restaurant.id,
              tag_id: tag.id,
              photo: {
                url: photo.src,
              },
            })
          }
        }
        if (is_at_least_one_photo) {
          this.restaurant_tags.push(restaurant_tag)
        }
      }
    }
    return all_tag_photos
  }

  findDishesInText(all_reviews: string[]) {
    for (const text of all_reviews) {
      for (const tag of this.all_tags) {
        if (!this._doesStringContainTag(text, tag.name ?? '')) continue
        this._found_tags[tag.id] = { tag_id: tag.id } as RestaurantTag
        this.measureSentiment(text, tag)
      }
    }
  }

  async findVegInText(all_reviews: string[]) {
    let matches = 0
    for (const text of all_reviews) {
      if (this._doesStringContainTag(text, 'vegetarian')) matches += 1
      if (this._doesStringContainTag(text, 'vegan')) matches += 1
    }
    if (matches > this.SPECIAL_FILTER_THRESHOLD) {
      await this.addSimpleTags(['veg'])
    }
  }

  _doesStringContainTag(text: string, tag_name: string | undefined) {
    if (typeof tag_name === 'undefined') return false
    const regex = new RegExp(`\\b${tag_name}\\b`, 'i')
    return regex.test(text)
  }

  measureSentiment(text: string, tag: Tag) {
    const sentiment = new Sentiment()
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
    this.restaurant_tag_ratings[tag.id] =
      this.restaurant_tag_ratings[tag.id] || []
    for (const sentence of sentences) {
      if (!this._doesStringContainTag(sentence, tag.name ?? '')) continue
      const rating = sentiment.analyze(sentence).score
      this.restaurant_tag_ratings[tag.id].push(rating)
    }
  }

  async _averageAndPersistTagRatings() {
    for (const tag_id of Object.keys(this.restaurant_tag_ratings)) {
      this.restaurant_tags.push({
        tag_id: tag_id,
        rating: this._calculateTagRating(this.restaurant_tag_ratings[tag_id]),
      })
    }
  }

  _calculateTagRating(ratings: number[]) {
    const averaged = mean(ratings)
    const normalised = this._normaliseTagRating(averaged)
    const max_restaurant_rating = 5
    const neutral = max_restaurant_rating / 2
    const amplifier = (this.crawler.restaurant.rating - neutral) / neutral
    let potential = 0
    if (amplifier > 0) {
      potential = (1 - normalised) / 2
    } else {
      potential = normalised / 2
    }
    const weight = potential * amplifier
    const weighted = normalised + weight
    return weighted
  }

  _normaliseTagRating(rating: number) {
    let normalised: number = 0
    const percentiles = this._getApproximatedDistribution()
    let lower: number = 0
    let upper: number = 0
    if (rating <= percentiles[0]) return 0
    if (rating >= percentiles[percentiles.length - 1]) return 1
    for (let i = 0; i < percentiles.length; i++) {
      normalised = i
      lower = percentiles[i]
      upper = percentiles[i + 1]
      if (rating >= lower && rating < upper) break
    }
    const distance_between = 1 - (upper - rating) / (upper - lower)
    normalised += distance_between
    return normalised / (percentiles.length - 1)
  }

  // All the percentiles for our tag rankings. You can get them with statements like:
  // ```
  // select percentile_disc(0.5) within group (order by restaurant_tag.rating)
  //   from restaurant_tag
  // ```
  _getApproximatedDistribution() {
    return [-15, -0.001, 0.001, 0.666, 1.081, 1.5, 2, 2.272, 3, 4, 44]
  }

  _scanYelpReviewsForTags() {
    const reviews = this.crawler.getPaginatedData(
      // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
      this.crawler.yelp?.data,
      'reviews'
    )
    let texts: string[] = []
    for (const review of reviews) {
      texts.push(
        [
          review.comment?.text,
          review.lightboxMediaItems?.map((i) => i.caption).join(' '),
        ].join(' ')
      )
    }
    return texts
  }

  _scanTripadvisorReviewsForTags() {
    const td_data = this.crawler.tripadvisor?.data || {}
    const reviews = this.crawler.getPaginatedData(td_data, 'reviews')
    let texts: string[] = []
    for (const review of reviews) {
      texts.push([review.text].join(' '))
    }
    return texts
  }

  _scanGoogleReviewsForTags() {
    // @ts-ignore
    const reviews = this.crawler.google?.data?.reviews || []
    let texts: string[] = []
    for (const review of reviews) {
      const text = review.split('\n')[3]
      if (!text) continue
      texts.push(text)
    }
    return texts
  }

  _scanMenuItemsForTags() {
    let texts: string[] = []
    for (const review of this.crawler.menu_items) {
      const text = review.description
      if (!text) continue
      texts.push(text)
    }
    return texts
  }

  deDepulicateTags() {
    const map = new Map()
    this.restaurant_tags.forEach((rt: RestaurantTag) => {
      map.set(rt.tag_id, {
        ...rt,
        ...map.get(rt.tag_id),
      })
    })
    this.restaurant_tags = Array.from(map.values())
  }
}

import { sentryMessage } from '@dish/common'
import {
  PhotoXref,
  RestaurantTag,
  Review,
  Tag,
  convertSimpleTagsToRestaurantTags,
  externalUserUUID,
  globalTagId,
  restaurantGetAllPossibleTags,
  reviewExternalUpsert,
  tagFindCountries,
  tagSlug,
} from '@dish/graph'
import * as chrono from 'chrono-node'
import { mean, uniq } from 'lodash'
import moment from 'moment'
import Sentiment from 'sentiment'

import { scrapeGetData } from '../scrape-helpers'
import { main_db, toDBDate } from '../utils'
import { Self } from './Self'

type TextSource = Review | string
const isReview = (variableToCheck: any): variableToCheck is Review =>
  (variableToCheck as Review).text !== undefined

export class Tagging {
  crawler: Self
  restaurant_tags: RestaurantTag[] = []
  restaurant_tag_ratings: {
    [key: string]: number[]
  } = {}
  all_tags: Tag[] = []
  _found_tags: { [key: string]: Partial<RestaurantTag> } = {}
  SPECIAL_FILTER_THRESHOLD = 3
  GEM_UIID = 'da0e0c85-86b5-4b9e-b372-97e133eccb43'
  sentiment = new Sentiment()
  reviews: Review[] = []

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
    this.tagIfGem()
  }

  tagIfGem() {
    if (this.crawler.restaurant.rating > 4) {
      this.restaurant_tags.push({
        tag_id: this.GEM_UIID,
      })
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
    const result = await main_db.query(
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

  async scanCorpus() {
    this._found_tags = {}
    this.all_tags = await restaurantGetAllPossibleTags(this.crawler.restaurant)
    this.restaurant_tag_ratings = {}
    const all_reviews = [
      ...this._scanYelpReviewsForTags(),
      ...this._scanTripadvisorReviewsForTags(),
      ...this._scanGoogleReviewsForTags(),
    ]
    const all_sources = [...all_reviews, ...this._scanMenuItemsForTags()]
    const reviews_with_sentiments = this.findDishesInText(all_sources)
    await this.findVegInText(all_sources)
    await this._averageAndPersistTagRatings()
    await reviewExternalUpsert(reviews_with_sentiments)
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

  findDishesInText(all_sources: TextSource[]) {
    let text: string
    let updated_reviews: Review[] = []
    for (let source of all_sources) {
      if (!isReview(source)) {
        text = source
      } else {
        text = source.text ?? ''
      }
      for (const tag of this.all_tags) {
        const is_tags_found = this._doesStringContainTag(text, tag.name ?? '')
        if (is_tags_found) {
          source = this.tagFound(tag, source)
        }
      }
      if (isReview(source)) {
        updated_reviews.push(source)
      }
    }
    return updated_reviews
  }

  tagFound(tag: Tag, text_source: TextSource) {
    let text: string
    if (isReview(text_source)) {
      text_source.sentiments = text_source.sentiments ?? []
      text = text_source.text ?? ''
    } else {
      text = text_source as string
    }
    this._found_tags[tag.id] = { tag_id: tag.id } as RestaurantTag
    this.restaurant_tag_ratings[tag.id] =
      this.restaurant_tag_ratings[tag.id] || []
    const sentences = this.matchingSentences(text, tag)
    for (const sentence of sentences) {
      if (!this._doesStringContainTag(sentence, tag.name ?? '')) continue
      const rating = this.measureSentiment(sentence)
      this.restaurant_tag_ratings[tag.id].push(rating)
      if (isReview(text_source)) {
        const sentiment = {
          tag_id: tag.id,
          sentence,
          sentiment: rating,
        }
        text_source.sentiments.push(sentiment)
      }
    }
    return text_source
  }

  async findVegInText(all_sources: TextSource[]) {
    let matches = 0
    for (const source of all_sources) {
      let text = (source as Review).text
      if (!text) {
        text = source as string
      }
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

  matchingSentences(text: string, tag: Tag) {
    return text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
  }

  measureSentiment(sentence: string) {
    return this.sentiment.analyze(sentence).score
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
    const yelp_reviews = this.crawler.getPaginatedData(
      // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
      this.crawler.yelp?.data,
      'reviews'
    )
    let reviews: Review[] = []
    for (const yelp_review of yelp_reviews) {
      reviews.push({
        user_id: externalUserUUID,
        tag_id: globalTagId,
        source: 'yelp',
        username: 'yelp-' + yelp_review.userId,
        authored_at: toDBDate(yelp_review.localizedDate, 'MM/DD/YYYY'),
        restaurant_id: this.crawler.restaurant.id,
        text: [
          yelp_review.comment?.text,
          yelp_review.lightboxMediaItems?.map((i) => i.caption).join(' '),
        ].join(' '),
        rating: yelp_review.rating,
      })
    }
    return reviews
  }

  _scanTripadvisorReviewsForTags() {
    const td_data = this.crawler.tripadvisor?.data || {}
    const tripadvisor_reviews = this.crawler.getPaginatedData(
      td_data,
      'reviews'
    )
    let reviews: Review[] = []
    for (const tripadvisor_review of tripadvisor_reviews) {
      if (!tripadvisor_review.username || tripadvisor_review.username == '') {
        sentryMessage('TRIPADVISOR: Review has no username', tripadvisor_review)
        continue
      }
      reviews.push({
        user_id: externalUserUUID,
        tag_id: globalTagId,
        source: 'tripadvisor',
        username: 'tripadvisor-' + tripadvisor_review.username,
        authored_at: toDBDate(tripadvisor_review.date, 'MMMM D, YYYY'),
        restaurant_id: this.crawler.restaurant.id,
        text: tripadvisor_review.text,
        rating: tripadvisor_review.rating,
      })
    }
    return reviews
  }

  _scanGoogleReviewsForTags() {
    // @ts-ignore
    const google_reviews = this.crawler.google?.data?.reviews || []
    let reviews: Review[] = []
    for (const google_review of google_reviews) {
      const pieces = google_review.split('\n')
      const rating = parseFloat(pieces[0].match(/(\d)/)[1])
      const username = pieces[1]
      const date = this._quantiseGoogleReviewDate(pieces[3])
      const text = pieces[4]
      reviews.push({
        user_id: externalUserUUID,
        tag_id: globalTagId,
        source: 'google',
        username: 'google-' + username,
        authored_at: date,
        restaurant_id: this.crawler.restaurant.id,
        text,
        rating,
      })
    }
    return reviews
  }

  // We only get dates like "2 weeks ago" or "2 years ago" from Google. In order
  // to allow multiple reviews from the same reviewer for the same restaurant we need
  // some way to consistently differentiate reviews, otherwise successive reviews will
  // just clobber the old ones. This way we can at least support 1 review per year. Not
  // perfect, but not too bad either.
  _quantiseGoogleReviewDate(date: string) {
    const chrono_date = chrono.parseDate(date)
    let m = moment(chrono_date)
    const quantised_date = m.year().toString()
    return toDBDate(quantised_date, 'YYYY')
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

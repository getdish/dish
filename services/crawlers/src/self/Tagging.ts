import { sentryMessage } from '@dish/common'
import {
  PhotoXref,
  RestaurantTag,
  Review,
  Tag,
  cleanReviewText,
  convertSimpleTagsToRestaurantTags,
  dedupeReviews,
  dedupeSentiments,
  externalUserUUID,
  globalTagId,
  restaurantGetAllPossibleTags,
  reviewExternalUpsert,
  tagFindCountryMatches,
  tagSlug,
} from '@dish/graph'
import { breakIntoSentences, doesStringContainTag } from '@dish/helpers'
import * as chrono from 'chrono-node'
import { uniq } from 'lodash'
import moment from 'moment'
import Sentiment from 'sentiment'

import { scrapeGetData } from '../scrape-helpers'
import { toDBDate } from '../utils'
import { Self } from './Self'

type TextSource = Review | string
const isReview = (variableToCheck: any): variableToCheck is Review =>
  (variableToCheck as Review).text !== undefined

export const GEM_UIID = 'da0e0c85-86b5-4b9e-b372-97e133eccb43'

export class Tagging {
  crawler: Self
  restaurant_tags: RestaurantTag[] = []
  restaurant_tag_ratings: {
    [key: string]: number[]
  } = {}
  all_tags: Tag[] = []
  found_tags: { [key: string]: Partial<Tag> } = {}
  SPECIAL_FILTER_THRESHOLD = 3
  naive_sentiment = new Sentiment()
  all_reviews: Review[] = []

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
        tag_id: GEM_UIID,
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
    const country_tags = await tagFindCountryMatches(tags)
    this.addRestaurantTags(
      country_tags.map((tag: Tag) => {
        return {
          tag_id: tag.id,
        } as RestaurantTag
      })
    )
    const orphan_tags = this._extractOrphanTags(tags, country_tags)
    this.crawler.log('upsert country tags')
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
    const all_tags = this.crawler.restaurant.tags || []
    await Promise.all(
      all_tags.map((tag) => {
        return this.promisedRankForTag(tag.tag.id)
      })
    )
  }

  async promisedRankForTag(tag_id: string) {
    const rank = await this.getRankForTag(tag_id)
    const existing = this.restaurant_tags.find((rt) => rt.tag_id == tag_id)
    if (existing) {
      existing.rank = rank
    } else {
      const tag = {
        tag_id: tag_id,
        rank,
      }
      this.restaurant_tags.push(tag)
    }
  }

  async getRankForTag(tag_id: string) {
    const RADIUS = 0.1
    const query = `
      SELECT * FROM (
        SELECT
          restaurant.id AS restaurant_id,
          DENSE_RANK() OVER(ORDER BY rt.score DESC NULLS LAST) AS rank
        FROM restaurant
        LEFT JOIN restaurant_tag rt ON rt.restaurant_id = restaurant.id
          WHERE ST_DWithin(location, location, ${RADIUS})
          AND rt.tag_id = '${tag_id}'
      ) league
      WHERE restaurant_id = '${this.crawler.restaurant.id}'`
    const result = await this.crawler.main_db.query(query)
    if (result.rows.length == 0) {
      sentryMessage('No rank for tag', {
        restaurant_id: this.crawler.restaurant.id,
        tag_id: tag_id,
      })
    }
    const rank = parseInt(result.rows[0].rank)
    return rank
  }

  async scanCorpus() {
    this.found_tags = {}
    this.all_tags = await restaurantGetAllPossibleTags(this.crawler.restaurant)
    this.restaurant_tag_ratings = {}
    this.all_reviews = [
      ...this._getYelpReviews(),
      ...this._getTripadvisorReviews(),
      ...this._getGoogleReviews(),
    ]
    let all_sources = [...this.all_reviews, ...this._scanMenuItemsForTags()]
    all_sources = this.cleanAllSources(all_sources) as TextSource[]
    const reviews_with_sentiments = this.findDishesInText(all_sources)
    await this._collectFoundRestaurantTags()
    await reviewExternalUpsert(reviews_with_sentiments)
  }

  cleanAllSources(sources: TextSource[]) {
    return sources
      .map((s) => {
        if (!s) return
        if (isReview(s)) {
          s.text = cleanReviewText(s.text)
        } else {
          s = cleanReviewText(s) as string
        }
        return s
      })
      .filter(Boolean)
  }

  async _collectFoundRestaurantTags() {
    for (const tag_id of Object.keys(this.restaurant_tag_ratings)) {
      this.restaurant_tags.push({
        tag_id: tag_id,
      })
    }
  }

  async findPhotosForTags() {
    const all_possible_tags = await restaurantGetAllPossibleTags(
      this.crawler.restaurant
    )
    const all_tag_photos: PhotoXref[] = []
    const photos = this.getPhotosWithText()
    if (!photos) return []
    for (const tag of all_possible_tags) {
      let restaurant_tag: RestaurantTag = {
        tag_id: tag.id,
        // @ts-ignore
        photos: [] as string[],
      }
      let is_at_least_one_photo = false
      for (const photo of photos) {
        if (doesStringContainTag(photo.text, tag)) {
          is_at_least_one_photo = true
          all_tag_photos.push({
            restaurant_id: this.crawler.restaurant.id,
            tag_id: tag.id,
            photo: {
              url: photo.url,
            },
          })
        }
      }
      if (is_at_least_one_photo) {
        this.restaurant_tags.push(restaurant_tag)
      }
    }
    return all_tag_photos
  }

  getPhotosWithText() {
    let yelps = this.crawler.getPaginatedData(this.crawler.yelp?.data, 'photos')
    yelps = yelps.map((y) => {
      return {
        url: y.src,
        text: y.media_data?.caption,
      }
    })
    let tripadvisors =
      scrapeGetData(this.crawler.tripadvisor, 'photos_with_captions') || []
    tripadvisors = tripadvisors.map((t) => {
      return {
        url: t.url,
        text: t.caption,
      }
    })
    return [...yelps, ...tripadvisors]
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
        const is_tags_found = doesStringContainTag(text, tag)
        if (is_tags_found) {
          source = this.tagFound(tag, source)
        }
      }
      if (isReview(source)) {
        updated_reviews.push(source)
      }
    }
    return dedupeReviews(updated_reviews)
  }

  tagFound(tag: Tag, text_source: TextSource) {
    let text: string
    if (isReview(text_source)) {
      text_source.sentiments = text_source.sentiments ?? []
      text = text_source.text ?? ''
    } else {
      text = text_source as string
    }
    this.found_tags[tag.id] = tag
    this.restaurant_tag_ratings[tag.id] =
      this.restaurant_tag_ratings[tag.id] || []
    const sentences = breakIntoSentences(text)
    for (const sentence of sentences) {
      if (!doesStringContainTag(sentence, tag)) continue
      const rating = this.measureSentiment(sentence)
      this.restaurant_tag_ratings[tag.id].push(rating)
      if (isReview(text_source)) {
        const sentiment = {
          tag_id: tag.id,
          restaurant_id: this.crawler.restaurant.id,
          sentence,
          naive_sentiment: rating,
        }
        text_source.sentiments.push(sentiment)
      }
    }
    if (isReview(text_source)) {
      text_source.sentiments = dedupeSentiments(text_source.sentiments)
    }
    return text_source
  }

  measureSentiment(sentence: string) {
    return this.naive_sentiment.analyze(sentence).score
  }

  _getYelpReviews() {
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

  _getTripadvisorReviews() {
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

  _getGoogleReviews() {
    // @ts-ignore
    const google_reviews = this.crawler.google_review_api?.data?.reviews || []
    let reviews: Review[] = []
    for (const review of google_reviews) {
      const date = this._quantiseGoogleReviewDate(review.ago_text)
      reviews.push({
        user_id: externalUserUUID,
        tag_id: globalTagId,
        source: 'google',
        username: 'google-' + review.user_id,
        authored_at: date,
        restaurant_id: this.crawler.restaurant.id,
        text: review.text,
        rating: parseFloat(review.rating),
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

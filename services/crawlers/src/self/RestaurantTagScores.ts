import { sentryMessage } from '@dish/common'
import { Review, Tag } from '@dish/graph'
import { fetchABSASentiment } from '@dish/helpers'
import { chunk } from 'lodash'

import { main_db } from '../utils'
import { Self } from './Self'

type ReviewTagWhole = {
  review_id: string
  tag_id: string
  sentiment: number
}

type ReviewsToAnalyze = {
  [review_id: string]: {
    review: Review
    tags: Tag[]
  }
}

export class RestaurantTagScores {
  crawler: Self
  breakdown: any = {}

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  async calculateScores() {
    const unscored = await this.findAllUnscored()
    const review_tag_wholes = await this.absaAnalyseReviews(unscored)
    await this.insertReviewTagWholeSentiments(review_tag_wholes)
    await this.updateRestaurantTagScores()
  }

  async findAllUnscored() {
    const restaurant_id = this.crawler.restaurant.id
    const result = await main_db.query(`
      WITH unscored_review_ids AS (
        SELECT DISTINCT(review_id) FROM review_tag_sentences rts
          JOIN review r ON r.id = rts.review_id
          WHERE r.restaurant_id = '${restaurant_id}'
          AND NOT EXISTS (
            SELECT FROM review_tag_whole rtw
            WHERE rtw.review_id = rts.review_id
          )
      )
      SELECT * FROM review WHERE id IN (
        SELECT review_id FROM unscored_review_ids
      )
    `)
    return result.rows as Review[]
  }

  async absaAnalyseReviews(reviews: Review[]) {
    let review_tag_wholes: ReviewTagWhole[] = []
    const tags = this.crawler.tagging.found_tags
    let reviews_to_analyze: ReviewsToAnalyze = {}
    this.crawler.log(`Starting ABSA requests (${reviews.length} to analyze)...`)
    for (const review of reviews) {
      reviews_to_analyze[review.id] = { review, tags: [] }
      for (const tag_id in tags) {
        const tag = tags[tag_id]
        if (!review.text || !tag.name) continue
        const does_review_contain_tag = this.crawler.tagging.doesStringContainTag(
          review.text,
          tag.name
        )
        if (!does_review_contain_tag) continue
        reviews_to_analyze[review.id].tags.push(tag)
      }
    }
    review_tag_wholes = await this.analyzeReviews(reviews_to_analyze)
    this.crawler.log('...ABSA requests done')
    return review_tag_wholes
  }

  async analyzeReviews(reviews_to_analyze: ReviewsToAnalyze) {
    const ABSA_BATCH_SIZE = 10
    let assessed: ReviewTagWhole[] = []
    const review_ids = Object.keys(reviews_to_analyze)
    for (const ids_batch of chunk(review_ids, ABSA_BATCH_SIZE)) {
      let reviews_batch: ReviewsToAnalyze = {}
      for (const id of ids_batch) {
        reviews_batch[id] = reviews_to_analyze[id]
      }
      const batch_results = await this.absaBatch(reviews_batch)
      assessed.push(...batch_results)
    }
    return assessed
  }

  async absaBatch(reviews_to_analyze: ReviewsToAnalyze) {
    this.crawler.log('Sending ABSA batch...')
    const results = await Promise.all(
      Object.keys(reviews_to_analyze).map((i) => {
        const rta = reviews_to_analyze[i]
        return this.absaRequest(rta.review, rta.tags)
      })
    )
    let all_reviews: ReviewTagWhole[] = []
    for (const reviews of results) {
      all_reviews.push(...reviews)
    }
    this.crawler.log('...ABSA batch sent')
    return all_reviews
  }

  async absaRequest(review: Review, tags: Tag[]) {
    if (!review.text) return []
    const results = await this.fetchABSASentimentWithRetries(
      review.text,
      tags.map((t) => t.name ?? '')
    )
    if (!results) return []
    if (results.error) {
      this.crawler.log('ABSA error: ' + results.error)
      sentryMessage('', {
        text: review.text,
        tag: tags.map((t) => t.name),
      })
      return []
    }
    const sentiments = results.results
    let review_tag_wholes: ReviewTagWhole[] = []
    for (const aspect of Object.keys(sentiments)) {
      const result = sentiments[aspect]
      const tag_id = tags.find((t) => t.name == aspect)?.id
      review_tag_wholes.push({
        review_id: review.id,
        tag_id: tag_id,
        sentiment: this._absaSentimentToNumber(result.sentiment),
      })
    }
    return review_tag_wholes
  }

  async fetchABSASentimentWithRetries(
    review_text: string,
    tag_names: string[]
  ) {
    const MAX_RETRIES = 5
    let retries = 0
    while (true) {
      try {
        return await fetchABSASentiment(review_text, tag_names)
      } catch (error) {
        if (!error.message.includes('json')) {
          throw error
        }
        retries += 1
        if (retries > MAX_RETRIES) {
          this.crawler.log('Failed ABSA request: ' + error.message)
          sentryMessage(MAX_RETRIES + ' failed attempts requesting ABSA API', {
            text: review_text,
            tag: tag_names,
          })
          return
        }
        console.log('Retrying ABSA API')
      }
    }
  }

  _absaSentimentToNumber(absa_sentiment: string) {
    switch (absa_sentiment) {
      case 'positive':
        return 1
      case 'negative':
        return -1
      default:
        return 0
    }
  }

  async insertReviewTagWholeSentiments(review_tag_wholes: ReviewTagWhole[]) {
    if (review_tag_wholes.length == 0) return
    const values = review_tag_wholes
      .map((rtw) => {
        return `('${rtw.review_id}', '${rtw.tag_id}', ${rtw.sentiment})`
      })
      .join(',')
    await main_db.query(`
      INSERT INTO review_tag_whole (review_id, tag_id, sentiment)
      VALUES ${values};
    `)
  }

  async updateRestaurantTagScores() {
    const tags = this.crawler.tagging.found_tags // TODO: query DB for all rish tag IDs??
    let all_updates: string[] = []
    for (const tag_id in tags) {
      const score_sql = `
        SELECT SUM(sentiment) FROM review_tag_whole
        JOIN review ON review.id = review_tag_whole.review_id
          AND review.restaurant_id = '${this.crawler.restaurant.id}'
          AND review_tag_whole.tag_id = '${tag_id}'
      `
      const breakdown_sql = this.generateBreakdownSQL(tag_id)
      const sql = `
        UPDATE restaurant_tag SET
          score = (${score_sql}),
          score_breakdown = (${breakdown_sql})
        WHERE restaurant_id = '${this.crawler.restaurant.id}'
        AND tag_id = '${tag_id}';
      `
      all_updates.push(sql)
    }
    const query = all_updates.join('\n')
    await main_db.query(query)
  }

  generateBreakdownSQL(tag_id: string) {
    let sources_sql: string[] = []
    for (const source of this.crawler.ALL_SOURCES) {
      const source_sql = `
        '${source}', json_build_object(
          'score', (${this.sqlForScore(tag_id, source)}),
          'counts', json_build_object(
            'positive', ((${this.sqlForSentiment(tag_id, source, 1)})),
            'neutral', ((${this.sqlForSentiment(tag_id, source, 0)})),
            'negative', ((${this.sqlForSentiment(tag_id, source, -1)}))
          )
        )
      `
      sources_sql.push(source_sql)
    }
    const all = `
      SELECT json_build_object(
          ${sources_sql.join()}
        )
    `
    return all
  }

  sqlForScore(tag_id: string, source: string) {
    return `
      SELECT SUM(sentiment) FROM review_tag_whole
        JOIN review ON review.id = review_tag_whole.review_id
          AND review.restaurant_id = '${this.crawler.restaurant.id}'
          AND review_tag_whole.tag_id = '${tag_id}'
          AND review.source = '${source}'
    `
  }

  sqlForSentiment(tag_id: string, source: string, sentiment: number) {
    return `
      SELECT COUNT(*) FROM review_tag_whole
        JOIN review ON review.id = review_tag_whole.review_id
          AND review.restaurant_id = '${this.crawler.restaurant.id}'
          AND review_tag_whole.tag_id = '${tag_id}'
          AND review.source = '${source}'
          AND review_tag_whole.sentiment = ${sentiment}
    `
  }
}

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
    let reviews_to_analyze: [Review, Tag][] = []
    console.log('Starting ABSA requests...')
    for (const tag_id in tags) {
      const tag = tags[tag_id]
      for (const review of reviews) {
        if (!review.text || !tag.name) continue
        const does_review_contain_tag = this.crawler.tagging.doesStringContainTag(
          review.text,
          tag.name
        )
        if (!does_review_contain_tag) continue
        reviews_to_analyze.push([review, tag])
      }
    }
    review_tag_wholes = await this.analyzeReviews(reviews_to_analyze)
    console.log('...ABSA requests done')
    return review_tag_wholes
  }

  async analyzeReviews(review_with_tag_array: [Review, Tag][]) {
    const ABSA_BATCH_SIZE = 10
    let assessed: ReviewTagWhole[] = []
    for (const batch of chunk(review_with_tag_array, ABSA_BATCH_SIZE)) {
      assessed.push(...(await this.absaBatch(batch)))
    }
    return assessed
  }

  async absaBatch(review_with_tag_array: [Review, Tag][]) {
    const results = await Promise.all(
      review_with_tag_array.map((i) => {
        const review = i[0]
        const tag = i[1]
        return this.absaRequest(review, tag)
      })
    )
    return results.filter((i) => i != null) as ReviewTagWhole[]
  }

  async absaRequest(review: Review, tag: Tag) {
    if (!review.text || !tag.name) return null
    const result = await fetchABSASentiment(review.text, tag.name)
    return {
      review_id: review.id,
      tag_id: tag.id,
      sentiment: this._absaSentimentToNumber(result.sentiment),
    } as ReviewTagWhole
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

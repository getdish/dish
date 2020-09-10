import { main_db } from '../utils'
import { Self } from './Self'

export class RestaurantBaseScore {
  crawler: Self
  breakdown: any = {}

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  async calculateScore() {
    //@ts-ignore
    this.crawler.restaurant.score_breakdown = {}
    await this.scoreFromPhotos()
    await this.scoreFromReviews()
    this.sumScores()
  }

  async scoreFromPhotos() {
    const PHOTO_QUALITY_CRITERIA = 5
    const SCORE_FACTOR = 2
    const result = await main_db.query(`
      SELECT count(DISTINCT p.id) FROM photo_xref px
      JOIN photo p ON px.photo_id = p.id
        WHERE px.restaurant_id = '${this.crawler.restaurant.id}'
        AND p.quality > ${PHOTO_QUALITY_CRITERIA}
    `)
    const count = parseInt(result.rows[0].count)
    const score = count * SCORE_FACTOR
    this.breakdown.photos = {
      meeting_criteria_count: count,
      score,
    }
  }

  async scoreFromReviews() {
    this.breakdown.reviews = {}
    const result = await main_db.query(`
      SELECT
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 4
        ) as _4_to_5,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 3 AND rating <= 4
        ) as _3_to_4,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 2 AND rating <= 3
        ) as _2_to_3,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 0 AND rating <= 2
        ) as _0_to_2
    `)
    const bands = { _4_to_5: 2, _3_to_4: 1, _2_to_3: -1, _0_to_2: -2 }
    const row = result.rows[0]
    let total = 0
    for (const band in bands) {
      const factor = bands[band]
      const count = parseInt(row[band])
      const score = count * factor
      total += score
      this.breakdown.reviews[band] = {
        count,
        score,
      }
    }
    this.breakdown.reviews.score = total
  }

  sumScores() {
    let score = 0
    for (const key in this.breakdown) {
      score = score + this.breakdown[key].score
    }
    this.crawler.restaurant.score = score
    this.crawler.restaurant.score_breakdown = this.breakdown
  }
}

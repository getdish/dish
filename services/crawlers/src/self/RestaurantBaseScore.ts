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
    const SCORE_FACTOR = 0.1
    const result = await this.crawler.main_db.query(`
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

  // 5 = 2, 4 = 1, 3 = 0, 2 = -1, 1 = -2
  async scoreFromReviews() {
    this.breakdown.reviews = {}
    const result = await this.crawler.main_db.query(`
      SELECT
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 4.75
        ) as _5,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 4 AND rating <= 4.75
        ) as _4,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 3 AND rating <= 4
        ) as _3,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 2 AND rating <= 3
        ) as _2,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND rating >= 0 AND rating <= 2
        ) as _1
    `)
    const bands = { _5: 2, _4: 1, _3: 0, _2: -1, _1: -2 }
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
    // @ts-ignore
    this.crawler.restaurant.score = score
    // @ts-ignore
    this.crawler.restaurant.score_breakdown = this.breakdown
  }
}

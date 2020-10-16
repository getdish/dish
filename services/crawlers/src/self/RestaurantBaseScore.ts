import { tagFindOne } from '@dish/graph'

import { Self } from './Self'

const REVIEW_BAND_FACTORS = { _5: 2, _4: 1, _3: 0, _2: -1, _1: -2 }

export class RestaurantBaseScore {
  crawler: Self
  breakdown: any = {}
  unique_tag_id?: string

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  async calculateScore() {
    this.crawler.restaurant.score_breakdown = {}
    this.breakdown.sources = {}
    const all_sources = [...this.crawler.available_sources, 'dish', 'all']
    const unique_tag = await tagFindOne({ name: 'Unique' })
    if (!unique_tag?.id) {
      throw new Error("Couldn't find the 'Unique' lense tag in DB")
    }
    this.unique_tag_id = unique_tag?.id
    for (const source of all_sources) {
      this.breakdown.sources[source] = { ratings: {}, summaries: {} } as any
      if (source != 'dish' && source != 'all') {
        await this.scoreFromExternalratings(source)
      } else {
        delete this.breakdown.sources['dish'].ratings
      }
      await this.generateSummaries(source)
    }
    await this.scoreFromVotes()
    await this.scoreFromPhotos()
    this.sumScores()
    this.crawler.restaurant.source_breakdown = this.breakdown
  }

  async scoreFromPhotos() {
    const PHOTO_SCORE_FACTOR = 0.1
    const PHOTO_QUALITY_CRITERIA = 5.25
    const result = await this.crawler.main_db.query(`
      SELECT count(DISTINCT p.id) FROM photo_xref px
      JOIN photo p ON px.photo_id = p.id
        WHERE px.restaurant_id = '${this.crawler.restaurant.id}'
        AND p.quality > ${PHOTO_QUALITY_CRITERIA}
    `)
    const count = parseInt(result.rows[0].count)
    const score = count * PHOTO_SCORE_FACTOR
    this.breakdown.photos = {
      critera: PHOTO_QUALITY_CRITERIA,
      score_factor: PHOTO_SCORE_FACTOR,
      meeting_criteria_count: count,
      score,
    }
  }

  async scoreFromVotes() {
    const PHOTO_SCORE_FACTOR = 0.1
    const PHOTO_QUALITY_CRITERIA = 5.25
    const result = await this.crawler.main_db.query(`
      WITH votes AS (
        SELECT vote FROM review
        WHERE restaurant_id = '${this.crawler.restaurant.id}'
      )
      SELECT
        (
          SELECT COUNT(vote) FROM votes WHERE vote > 0
        ) AS upvotes,
        (
          SELECT COUNT(vote) FROM votes WHERE vote < 0
        ) AS downvotes
    `)
    const row = result.rows[0]
    const upvotes = parseInt(row.upvotes)
    const downvotes = parseInt(row.downvotes)
    const total = upvotes + downvotes
    this.breakdown.votes = {
      upvotes,
      downvotes,
      score: total,
    }
  }

  async scoreFromExternalratings(source: string) {
    const result = await this.crawler.main_db.query(`
      SELECT
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND source = '${source}'
          AND rating >= 4.75
        ) as _5,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND source = '${source}'
          AND rating >= 4 AND rating <= 4.75
        ) as _4,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND source = '${source}'
          AND rating >= 3 AND rating <= 4
        ) as _3,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND source = '${source}'
          AND rating >= 2 AND rating <= 3
        ) as _2,
        (
          SELECT count(*) FROM review
          WHERE restaurant_id = '${this.crawler.restaurant.id}'
          AND source = '${source}'
          AND rating >= 0 AND rating <= 2
        ) as _1
    `)
    this.breakdown.sources[source] = { ratings: {} } as any
    const row = result.rows[0]
    let total = 0
    for (const band in REVIEW_BAND_FACTORS) {
      const factor = REVIEW_BAND_FACTORS[band]
      const count = parseInt(row[band])
      const score = count * factor
      total += score
      this.breakdown.sources[source].ratings[band] = {
        count,
        score,
      }
    }
    this.breakdown.sources[source].ratings.score = total
  }

  sumScores() {
    const sources_total = this.sumSources()
    let total_score = 0
    total_score += sources_total
    total_score += this.breakdown.photos.score
    total_score += this.breakdown.votes.score
    this.crawler.restaurant.score = total_score
  }

  sumSources() {
    this.breakdown.sources['all'].ratings = { score: 0 }
    for (const band in REVIEW_BAND_FACTORS) {
      this.breakdown.sources['all'].ratings[band] = {
        count: 0,
        score: 0,
      }
    }
    let sources_total = 0
    for (const source of this.crawler.available_sources) {
      this.sumReviewBands(source)
      const source_total = this.breakdown.sources[source].ratings.score
      this.breakdown.sources['all'].ratings.score += source_total
      sources_total += source_total
    }
    return sources_total
  }

  sumReviewBands(source: string) {
    for (const band in REVIEW_BAND_FACTORS) {
      const band_object = this.breakdown.sources[source].ratings[band]
      this.breakdown.sources['all'].ratings[band]['count'] += band_object.count
      this.breakdown.sources['all'].ratings[band]['score'] += band_object.score
    }
  }

  async generateSummaries(source: string) {
    const sub_query_name = source + '_'
    const result = await this.crawler.main_db.query(`
      SELECT json_build_object(
        'reviews', json_build_object(
          'best', (SELECT text FROM (
            ${this.notableReviewSQL('best', source)}
          ) ${sub_query_name}_best ),
          'worst', (SELECT text FROM (
            ${this.notableReviewSQL('worst', source)}
          ) ${sub_query_name}_worst )
        ),
        'sentences', json_build_object(
          'best', (
            ${this.notableSentencesSQL('best', source)}
          ),
          'worst', (
            ${this.notableSentencesSQL('worst', source)}
          )
        ),
        'unique_tags', (${this.uniqueTagsSQL(source)})
      )
    `)
    const summaries = result.rows[0].json_build_object
    this.breakdown.sources[source].summaries = summaries
  }

  notableReviewSQL(type: string, source: string) {
    const source_sql = source != 'all' ? `AND source = '${source}'` : ''
    const order = type == 'best' ? 'DESC' : 'ASC'
    return `
      SELECT SUM(rts.naive_sentiment) AS total_sentiment, text FROM review
      JOIN review_tag_sentence rts ON rts.review_id = review.id
        WHERE review.restaurant_id = '${this.crawler.restaurant.id}'
        ${source_sql}
      GROUP BY review.id
      ORDER BY total_sentiment ${order} NULLS LAST
      LIMIT 1
    `
  }

  notableSentencesSQL(type: string, source: string) {
    const source_sql = source != 'all' ? `AND source = '${source}'` : ''
    const order = type == 'best' ? 'DESC' : 'ASC'
    const filter = type == 'best' ? '> 0' : '< 0'
    const sub_query_name = source + '_notable_sentences'
    return `
      SELECT json_agg(${sub_query_name}.sentence) FROM (
        SELECT DISTINCT sentence, naive_sentiment FROM review_tag_sentence rts
        JOIN review ON rts.review_id = review.id
          WHERE review.restaurant_id = '${this.crawler.restaurant.id}'
          AND ml_sentiment ${filter}
          ${source_sql}
        ORDER BY naive_sentiment ${order} NULLS LAST
        LIMIT 2
      ) ${sub_query_name}
    `
  }

  uniqueTagsSQL(source: string) {
    const source_sql = source != 'all' ? `AND source = '${source}'` : ''
    const sub_query_name = source + '_unique_tags'
    return `
      SELECT json_agg(${sub_query_name}) FROM (
        SELECT id, name FROM tag
        WHERE id IN (
          SELECT DISTINCT tag_id FROM review_tag_sentence
          WHERE sentence IN (
            SELECT DISTINCT sentence FROM review_tag_sentence rts
            JOIN review ON rts.review_id = review.id
            JOIN tag ON rts.tag_id = tag.id
              WHERE review.restaurant_id = '${this.crawler.restaurant.id}'
              AND rts.tag_id = '${this.unique_tag_id}'
              ${source_sql}
          )
        )
        AND id != '${this.unique_tag_id}'
      ) ${sub_query_name}
    `
  }
}

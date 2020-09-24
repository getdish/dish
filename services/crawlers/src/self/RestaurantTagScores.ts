import { sentryException, sentryMessage } from '@dish/common'
import { fetchBertSentiment } from '@dish/helpers'
import { chunk } from 'lodash'

import { Self } from './Self'

type ReviewTagSentence = {
  id: string
  sentence?: string
  ml_sentiment?: number
  ml_score?: number
}

export class RestaurantTagScores {
  crawler: Self
  breakdown: any = {}
  total_sentences = 0
  current_sentence = 0

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  async calculateScores() {
    const unanalysed = await this.findAllUnanalyzed()
    this.total_sentences = unanalysed.length
    this.crawler.log(
      `Starting Bert sentiment requests (${this.total_sentences} to analyze)...`
    )
    const analyzed = await this.analyzeSentences(unanalysed)
    await this.updateAnalyzed(analyzed)
    this.crawler.log(`... ${analyzed.length} Bert sentiment requests done`)
    await this.updateRestaurantTagScores()
  }

  async findAllUnanalyzed() {
    const restaurant_id = this.crawler.restaurant.id
    const result = await this.crawler.main_db.query(`
      SELECT rts.id, sentence FROM review_tag_sentence rts
        JOIN review r ON r.id = rts.review_id
        WHERE r.restaurant_id = '${restaurant_id}'
        AND ml_sentiment IS NULL
    `)
    return result.rows as ReviewTagSentence[]
  }

  async analyzeSentences(review_tag_sentences: ReviewTagSentence[]) {
    const BERT_BATCH_SIZE = 20
    let assessed: ReviewTagSentence[] = []
    for (const batch of chunk(review_tag_sentences, BERT_BATCH_SIZE)) {
      const assessed_batch = await this.fetchBertBatch(batch)
      assessed.push(...assessed_batch)
    }
    return assessed
  }

  async fetchBertBatch(review_tag_sentences: ReviewTagSentence[]) {
    let completed = await Promise.all(
      review_tag_sentences.map((rts) => this.bertAssessSentence(rts))
    )
    return completed.filter(Boolean) as ReviewTagSentence[]
  }

  async bertAssessSentence(review_tag_sentence: ReviewTagSentence) {
    if (!review_tag_sentence.sentence) return
    this.current_sentence = this.current_sentence + 1
    const result = await this.fetchBertSentimentWithRetries(
      review_tag_sentence.sentence
    )
    if (!result) return
    return {
      id: review_tag_sentence.id,
      ml_sentiment: this._bertResultToNumber(result),
    }
  }

  async updateAnalyzed(review_tag_sentences: ReviewTagSentence[]) {
    let sql: string[] = []
    for (const rts of review_tag_sentences) {
      sql.push(`
        UPDATE review_tag_sentence
        SET ml_sentiment = '${rts.ml_sentiment}'
        WHERE id = '${rts.id}';
      `)
    }
    const all = sql.join('\n')
    await this.crawler.main_db.query(all)
  }

  async fetchBertSentimentWithRetries(text: string) {
    const MAX_RETRIES = 5
    let retries = 0
    while (true) {
      try {
        const result = await fetchBertSentiment(text)
        return result.result[0]
      } catch (error) {
        if (!error.message.includes('json')) {
          sentryException(error, {
            function: 'fetchBertSentimentWithRetries',
            restaurant: this.crawler.restaurant.id,
          })
          return
        }
        retries += 1
        if (retries > MAX_RETRIES) {
          this.crawler.log('Failed Bert sentiment request: ' + error.message)
          sentryMessage(MAX_RETRIES + ' failed attempts requesting Bert API', {
            text: text,
          })
          return
        }
        console.log(
          `Retrying Bert sentiment API: ${retries}/${MAX_RETRIES}. ` +
            `Sentence ${this.current_sentence}/${this.total_sentences}`
        )
      }
    }
  }

  _bertResultToNumber(bert_sentiment: [string, number]) {
    const score = bert_sentiment[1]
    switch (bert_sentiment[0]) {
      case 'Positive':
        return 1 * score
      case 'Negative':
        return -1 * score
      default:
        return 0
    }
  }

  async updateRestaurantTagScores() {
    const tags = this.crawler.tagging.found_tags // TODO: query DB for all rish tag IDs??
    let all_updates: string[] = []
    for (const tag_id in tags) {
      const all_sources_score_sql = this._scoreSQL(tag_id)
      const breakdown_sql = this.generateBreakdownSQL(tag_id)
      const sql = `
        UPDATE restaurant_tag SET
          score = (${all_sources_score_sql}),
          score_breakdown = (${breakdown_sql})
        WHERE restaurant_id = '${this.crawler.restaurant.id}'
        AND tag_id = '${tag_id}';
      `
      all_updates.push(sql)
    }
    const query = all_updates.join('\n')
    await this.crawler.main_db.query(query)
  }

  _scoreSQL(tag_id: string, source: string | undefined = undefined) {
    if (source) {
      source = `AND review.source = '${source}'`
    } else {
      source = ''
    }
    return `
      SELECT ROUND(SUM(averaged_ml_sentiment)) FROM (
        SELECT AVG(ml_sentiment) AS averaged_ml_sentiment FROM review_tag_sentence
          JOIN review ON review.id = review_tag_sentence.review_id
          AND review.restaurant_id = '${this.crawler.restaurant.id}'
          AND review_tag_sentence.tag_id = '${tag_id}'
          ${source}
        GROUP BY review.id
      ) s
    `
  }

  generateBreakdownSQL(tag_id: string) {
    let sources_sql: string[] = []
    for (const source of this.crawler.ALL_SOURCES) {
      const source_sql = `
        '${source}', json_build_object(
          'score', (${this.sqlForPerSourceScore(tag_id, source)}),
          'counts', json_build_object(
            'positive', ((${this.sqlForPerSourceSentiment(
              tag_id,
              source,
              '> 0'
            )})),
            'negative', ((${this.sqlForPerSourceSentiment(
              tag_id,
              source,
              '< 0'
            )}))
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

  sqlForPerSourceScore(tag_id: string, source: string) {
    return this._scoreSQL(tag_id, source)
  }

  sqlForPerSourceSentiment(
    tag_id: string,
    source: string,
    sentiment_criteria: string
  ) {
    return `
      SELECT COUNT(DISTINCT review_id) FROM review_tag_sentence
        JOIN review ON review.id = review_tag_sentence.review_id
          AND review.restaurant_id = '${this.crawler.restaurant.id}'
          AND review_tag_sentence.tag_id = '${tag_id}'
          AND review.source = '${source}'
          AND review_tag_sentence.ml_sentiment ${sentiment_criteria}
    `
  }
}

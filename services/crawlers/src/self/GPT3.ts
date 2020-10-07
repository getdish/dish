import { post_prompt, pre_prompt } from './gpt3_prompts_text'
import { Self } from './Self'

const presets = {
  witty_guidebook: {
    max_tokens: 301,
    temperature: 0,
    top_p: 0.91,
    frequency_penalty: 0.2,
    presence_penalty: 0.09,
  },
}

export class GPT3 {
  crawler: Self

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  async generateGPT3Summary() {
    const is_in_sanfran = this.crawler.restaurant.address?.includes('Francisco')
    const is_high_scoring = this.crawler.restaurant.score >= 400
    if (is_in_sanfran && is_high_scoring) {
      this.crawler.log('Running GPT3 summariser for restaurant...')
    } else {
      this.crawler.log(
        `Not running GPT3 for restaurant. ` +
          `Score: ${this.crawler.restaurant.score}, ` +
          `address: ${this.crawler.restaurant.address}`
      )
      return
    }
    const highlights = await this.findHighlights()
    const completion = await this.complete(highlights)
    this.crawler.restaurant.summary = completion
  }

  async findHighlights() {
    const query = this._byDishCountQuery()
    const result = await this.crawler.main_db.query(query)
    const text = result.rows
      .map((r) => r.text)
      .join(' ')
      .replaceAll('\n', ' ')
    return text
  }

  _bySummedSentimentQuery() {
    return `
      SELECT SUM(naive_sentiment), text FROM review
      JOIN review_tag_sentence rts ON rts.review_id = review.id
        WHERE review.restaurant_id = '${this.crawler.restaurant.id}'
        AND LENGTH(text) < 2000
      GROUP BY review.id
      ORDER BY SUM(naive_sentiment) DESC LIMIT 4
    `
  }

  _byDishCountQuery() {
    return `
      SELECT COUNT(rts.id), text FROM review
      JOIN review_tag_sentence rts ON rts.review_id = review.id
        WHERE review.restaurant_id = '${this.crawler.restaurant.id}'
        AND LENGTH(text) < 1800
      GROUP BY review.id
      ORDER BY COUNT(rts.id) DESC LIMIT 4
    `
  }

  async complete(input: string, preset = 'witty_guidebook') {
    let body = presets[preset]
    body.prompt = pre_prompt + '\n' + input + `\n` + post_prompt
    const request: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.GPT3_KEY,
      },
      body: JSON.stringify(body),
    }
    if (process.env.DISH_DEBUG) {
      console.log('Requesting GPT3 summary...')
      console.log(body.prompt)
    }
    const result = await fetch(
      'https://api.openai.com/v1/engines/davinci/completions',
      request
    )
    const response = await result.json()
    let answer = ''
    if (!response.choices || response.choices.length == 0) {
      console.error('GPT3 API error:', response)
    } else {
      answer = response.choices[0].text
    }
    if (process.env.DISH_DEBUG) {
      console.log('...GPT3 summary returned: ')
      console.log(answer)
    }
    return answer
  }
}

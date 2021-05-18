import { sentryMessage } from '@dish/common'

import { post_prompt, pre_prompt } from './gpt3_prompts_text'
import { Self } from './Self'

const presets = {
  witty_guidebook: {
    // this is 4 chars per token roughly
    max_tokens: 100,
    stop: ['\n'],
    // not sure, we may want more temp?
    // What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.
    // We generally recommend altering this or top_p but not both.
    temperature: 0,
    top_p: 1,
    // Number between 0 and 1 that penalizes new tokens based on their existing frequency in the text so far. Decreases the model's likelihood to repeat the same line verbatim
    frequency_penalty: 0.2,
    // Number between 0 and 1 that penalizes new tokens based on whether they appear in the text so far. Increases the model's likelihood to talk about new topics
    // we actually want it to summarize
    presence_penalty: 0,
  },
}

// in order of most powerful => least
type OpenAIEngines = 'davinci' | 'curie' | 'babbage' | 'ada'

export class GPT3 {
  crawler: Self

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  async generateGPT3Summary() {
    const is_in_sanfran = this.crawler.restaurant.address?.includes('Francisco')
    const is_high_scoring = this.crawler.restaurant.score >= 700
    const engine: OpenAIEngines = is_in_sanfran && is_high_scoring ? 'davinci' : 'curie'
    this.crawler.log('Running GPT3 summariser for restaurant...')
    const highlights = await this.findHighlights()
    const completion = await this.complete(highlights, engine)
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
        AND LENGTH(text) < 1000
      GROUP BY review.id
      ORDER BY SUM(naive_sentiment) DESC LIMIT 4
    `
  }

  _byDishCountQuery() {
    return `
      SELECT COUNT(rts.id), text FROM review
      JOIN review_tag_sentence rts ON rts.review_id = review.id
        WHERE review.restaurant_id = '${this.crawler.restaurant.id}'
        AND LENGTH(text) < 1000
      GROUP BY review.id
      ORDER BY COUNT(rts.id) DESC LIMIT 4
    `
  }

  async complete(input: string, engine: OpenAIEngines = 'curie', preset = 'witty_guidebook') {
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
    const result = await fetch(`https://api.openai.com/v1/engines/${engine}/completions`, request)
    const response = await result.json()
    let answer = ''
    if (!response.choices || response.choices.length == 0) {
      console.error('GPT3 API error:', response)
      sentryMessage('GPT3 API error', {
        data: {
          restaurant: this.crawler.restaurant.slug,
          response,
        },
      })
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

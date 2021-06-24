import { sentryMessage } from '@dish/common'

import { getSummary } from './getSummary'
import { Self } from './Self'

const presets = {
  witty_guidebook: {
    // this is 4 chars per token roughly
    max_tokens: 150,
    stop: ['"""'],
    // not sure, we may want more temp?
    // What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.
    // We generally recommend altering this or top_p but not both.
    temperature: 0,
    top_p: 1,
    // Number between 0 and 1 that penalizes new tokens based on their existing frequency in the text so far. Decreases the model's likelihood to repeat the same line verbatim
    frequency_penalty: 0.5,
    // Number between 0 and 1 that penalizes new tokens based on whether they appear in the text so far. Increases the model's likelihood to talk about new topics
    // we actually want it to summarize
    presence_penalty: 0,
  },
}

export const pre_prompt = `Summarize nicely the following as though you were a smart, wry Pixar food critic summarizing your visit to a restaurant:
---
Solid Vietnamese restaurant with pricing almost on par with Orange County! The interior is very spacious. The menu is extensive, lots of protein combinations for the staple dishes. Lovely vermicelli (bún), pho, broken rice (com tam), and beef stew (bo kho). Seriously, is the SF version of Pho Lu (in Westminster, CA) or nah?! We shared the vermicelli with grilled chicken and shrimp ($10.75). The fish sauce was flavorful, albeit not spicy. The grilled chicken had a nice char to it, the noodles were still warm when we got home 30 minutes later. Overall, definitely would order again. Next time I'll skip the nearby boba places and get my boba here because their fruit shakes (including durian!) look delicious and c'mon, you know Viet places only use fresh, real fruit for them!
"""
Summary: Pricey but solid Vietnamese! Large menu, lots of protein combos, amazing bun, pho com tam, and bo kho. Of course fresh real fruit boba smoothies (including durian!). C'mon man! 
---
Hands down my favorite taco joint in San Francisco. I think this is one of the few, if not the only restaurant in SF that serves birria tacos -- they are delicious! The beef stew meat and broth on the side go so well together (remember to add the cheese!) The flavors are intense but not too overwhelming. Another plus: these are HUGE tacos; I can only eat 3 at a time. It's always packed. You order at the counter first then wait for a table to open up. You have to strategize and be quick but still be respectful of others - absolutely not a time to be shy. They throw in complimentary chips and salsa with your order that are honestly great. PS: They also have sangria to-go now. It was perfectly concocted!
"""
Summary: Top tier tacos. Big Birria tacos with amazing flavor (the cheese is a must!). Absolutel UNIT of a taco! Hard to get a table sometimes, order at the counter. Tips: Sangria is to-go now, and decent free chips and salsa.
---
`

export const post_prompt = `"""
Summary:`

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
    const summary = await getSummary(highlights)
    const completion = await this.complete(summary, engine)
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
      ORDER BY SUM(naive_sentiment) DESC LIMIT 6
    `
  }

  _byDishCountQuery() {
    return `
      SELECT COUNT(rts.id), text FROM review
      JOIN review_tag_sentence rts ON rts.review_id = review.id
        WHERE review.restaurant_id = '${this.crawler.restaurant.id}'
        AND LENGTH(text) < 1000
      GROUP BY review.id
      ORDER BY COUNT(rts.id) DESC LIMIT 6
    `
  }

  async complete(input: string, engine: OpenAIEngines = 'curie', preset = 'witty_guidebook') {
    let body = presets[preset]
    body.prompt = `${pre_prompt}${input}${post_prompt}`
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

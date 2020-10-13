import path from 'path'

import {
  Tag,
  restaurantFindOneWithTags,
  restaurantGetAllPossibleTags,
} from '@dish/graph'
import {
  breakIntoSentences,
  doesStringContainTag,
  fetchBertSentimentNumber,
} from '@dish/helpers'
import { Request, Response } from 'express'

import { getUserFromResponse } from '../middlewares/checkRole'

type Analyzed = {
  sentences: Sentence[]
  tags: Tag[]
}

type Sentence = {
  sentence: string
  score?: number
  tags: string[]
}

class ReviewController {
  static analyze = async (req: Request, res: Response) => {
    const restaurant = await restaurantFindOneWithTags({
      id: req.body.restaurant_id,
    })
    if (!restaurant) {
      return ReviewController.error(
        res,
        'Restaurant not found: ' + req.body.restaurant_id
      )
    }
    const all_tags = await restaurantGetAllPossibleTags(restaurant)
    const analysis = await ReviewController.tagAnalyze(req.body.text, all_tags)
    return res.json(analysis)
  }

  static error = (res: Response, message: string) => {
    return res.json({ error: message })
  }

  static async tagAnalyze(text: string, tags: Tag[]) {
    let result: Analyzed = {
      sentences: [],
      tags: [],
    }
    const sentences = breakIntoSentences(text)
    for (const sentence of sentences) {
      let matches: Sentence = {
        sentence,
        tags: [],
      }
      for (const tag of tags) {
        if (!tag.name) continue
        if (!doesStringContainTag(sentence, tag)) continue
        matches.tags.push(tag.name)
        result['tags'].push(tag)
      }
      if (matches.tags.length) {
        matches.score = await fetchBertSentimentNumber(sentence)
        result['sentences'].push(matches)
      }
    }
    return result
  }
}

export default ReviewController

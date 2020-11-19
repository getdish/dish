import '@dish/common'

import { sentryException, sentryMessage } from '@dish/common'
import { Restaurant, globalTagId, restaurantFindOne } from '@dish/graph'
import { WorkerJob } from '@dish/worker'
import * as acorn from 'acorn'
import axios_base from 'axios'
import { JobOptions, QueueOptions } from 'bull'
import * as cheerio from 'cheerio'
import _ from 'lodash'

import { restaurantSaveCanonical } from '../canonical-restaurant'
import { ScrapeData, scrapeInsert, scrapeMergeData } from '../scrape-helpers'
import {
  aroundCoords,
  decodeEntities,
  geocode,
  restaurantFindIDBatchForCity,
} from '../utils'

const GOOGLE_DOMAIN = process.env.GOOGLE_AWS_PROXY || 'https://www.google.com'

const axios = axios_base.create({
  baseURL: GOOGLE_DOMAIN,
  headers: {
    common: {
      'X-My-X-Forwarded-For': 'www.google.com',
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0',
    },
  },
})

const DISH_RESTAURANT_BATCH_SIZE = 250

export class GoogleReviewAPI extends WorkerJob {
  static queue_config: QueueOptions = {
    limiter: {
      max: 5,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async allForCity(city: string) {
    let previous_id = globalTagId
    while (true) {
      const results = await restaurantFindIDBatchForCity(
        DISH_RESTAURANT_BATCH_SIZE,
        previous_id,
        city
      )
      if (results.length == 0) {
        break
      }
      for (const result of results) {
        await this.runOnWorker('getRestaurant', [result.id])
        previous_id = result.id as string
      }
    }
  }

  async getRestaurant(id: string) {
    const restaurant = await restaurantFindOne({ id })
    if (!restaurant) {
      throw 'GoogleReviewAPI: No restaurant found for ID:' + id
    }
    if (!restaurant.geocoder_id) {
      sentryMessage('GoogleReviewAPI: restaurant.geocoder_id is empty', {
        restaurant_id: id,
      })
      return
    }
    let data: any[] = []
    let page = 0
    while (true) {
      console.log(
        `GoogleReviewAPI: fetching page ${page} for ${restaurant.name}`
      )
      const html = await this.fetchReviewPage(restaurant.geocoder_id, page)
      const new_data = this.parseReviewPage(html)
      if (new_data.length == 0) break
      data = [...data, ...new_data]
      page++
    }
    await this.saveRestaurant(restaurant, data)
  }

  // curl \
  //   'https://www.google.com/async/reviewSort?
  //     client=firefox-b-d
  //     &yv=3
  //     &async=feature_id:0x14cab9e770d06d95%3A0x4b55747a9fc0e67a,
  //            review_source:All%20reviews,
  //            sort_by:qualityScore,
  //            start_index:120,
  //            is_owner:false,
  //            filter_text:,
  //            associated_topic:,
  //            next_page_token:120,
  //            _pms:s,
  //            _fmt:pc
  //   '
  //   -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0'
  async fetchReviewPage(geocoder_id: string, page = 0) {
    const GOOGLE_HARDCODED_PAGE_SIZE = 10 // DO NOT CHANGE
    const start = page * GOOGLE_HARDCODED_PAGE_SIZE
    const base_path = 'async/reviewSort?client=firefox-b-d&yv=3&async='
    const options = [
      'feature_id:' + geocoder_id,
      'start_index:' + start,
      'next_page_token:' + start,
      'sort_by:qualityScore',
      'is_owner:false',
      'use_expander:false',
      'is_user_interaction:false',
      'associated_topic:',
      '_pms:qs',
      '_fmt:pc',
    ]
    const path = base_path + options.join(',')
    const response = await axios.get(path)
    if (!response.data) throw 'GoogleReviewAPI: no response'
    return response.data
  }

  parseReviewPage(html) {
    const $ = cheerio.load(html)
    const reviews = $('.gws-localreviews__google-review')
    let data: any[] = []
    for (let i = 0; i < reviews.length; i++) {
      const divs = $(reviews[i]).find('> div > div')
      const user = $(divs[0]).find('a').attr('href')
      const user_id = this.parseUserID(user)
      const name = $(divs[0]).text()
      const stats = $(divs[1])
      const review = $(divs[2])
      const stars_text = review.find('g-review-stars > span').attr('aria-label')
      const rating = this.parseReviewRating(stars_text)
      const ago_text = review
        .find('div > span')
        .filter((i) => i == 0)
        .text()
      let text = review.find('> div > span').text()
      const full_text = review.find('> div .review-full-text').html() || ''
      text = this.parseReviewText(text, full_text)
      const photos = this.parsePhotos($(reviews[i]), $)
      data.push({
        user_id,
        name,
        rating,
        ago_text,
        text,
        photos,
      })
    }
    return data
  }

  parseReviewText(text: string, full_text: string) {
    const parts = text.split('-')
    parts.shift()
    text = parts.join('-')
    const more = '…More'
    if (text.includes(more)) {
      text = full_text.replaceAll('<br>', '\n')
    }
    const translated_by = '(Translated by Google)'
    if (text.includes(translated_by)) {
      text = text.split('(Translated by Google)')[1]
      text = text.split('(Original)')[0].trim()
    }
    return text
  }

  parseReviewRating(stars: string | undefined) {
    if (!stars) return null
    const parts = stars.split(' ')
    return parts[1]
  }

  parseUserID(href: string | undefined) {
    if (!href) return null
    const parts = href.split('/')
    return parts[5]
  }

  parsePhotos(review: cheerio.Cheerio, $: cheerio.Root) {
    let urls: string[] = []
    const anchors = review.find('g-scrolling-carousel div div div a')
    for (let i = 0; i < anchors.length; i++) {
      const style = $(anchors[i]).find('div').attr('style')
      if (!style) continue
      const brackets = style.split('(')
      if (!brackets) continue
      const equals = brackets[1].split('=')
      if (!equals) continue
      const url = equals[0]
      urls.push(url)
    }
    return urls
  }

  async saveRestaurant(restaurant: Restaurant, data: ScrapeData) {
    await scrapeInsert({
      source: 'google_review_api',
      restaurant_id: restaurant.id,
      id_from_source: restaurant.geocoder_id || '',
      location: {
        lon: restaurant.location.coordinates[0],
        lat: restaurant.location.coordinates[1],
      },
      data: {
        reviews: data,
      },
    })
  }

  static getNameAndAddress(scrape: ScrapeData) {}
}

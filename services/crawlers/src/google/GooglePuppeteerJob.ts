import '@dish/common'

import { WorkerJob } from '@dish/worker'
import _ from 'lodash'

import { Puppeteer } from '../Puppeteer'

export class GooglePuppeteerJob extends WorkerJob {
  GOOGLE_DOMAIN = 'https://www.google.com'
  puppeteer: Puppeteer
  booted = false

  constructor() {
    super()
    this.puppeteer = new Puppeteer(
      this.GOOGLE_DOMAIN,
      process.env.GOOGLE_AWS_PROXY
    )
  }

  async boot() {
    await this.puppeteer.boot()
    this.booted = true
  }
}

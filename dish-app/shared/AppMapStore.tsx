import { Store } from '@dish/use-store'

import { sfRegion } from './sfRegion'
import { Region } from './state/home-types'

export class AppMapStore extends Store {
  regions: { [slug: string]: Region | undefined } = {
    // 'san-francisco': sfRegion,
  }

  setRegion(slug: string, region: Region) {
    this.regions = {
      ...this.regions,
      [slug]: region,
    }
  }
}

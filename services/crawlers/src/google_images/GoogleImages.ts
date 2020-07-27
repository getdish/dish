import '@dish/common'

import {
  TagWithId,
  ZeroUUID,
  tagGetAllCuisinesWithDishes,
  tagUpdate,
  tagUpsert,
} from '@dish/graph'
import { WorkerJob } from '@dish/worker'
import axios_base from 'axios'
import { JobOptions, QueueOptions } from 'bull'

import {
  bestPhotosForTag,
  photoXrefUpsert,
  updatePhotoQuality,
  uploadToDO,
} from '../photo-helpers'

// Prototype:
// ```
// curl 'https://6rw3mhsrsb.execute-api.us-west-2.amazonaws.com/fireprox/search?q=kitten\
//   &client=firefox-b-d&gbv=2&source=lnms&tbm=isch&sa=X&biw=1920&bih=1138'
//   -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0'
// ```

if (!process.env.GOOGLE_SEARCH_PROXY) throw 'No GOOGLE_SEARCH_PROXY'

const axios = axios_base.create({
  baseURL: process.env.GOOGLE_SEARCH_PROXY + 'search',
  headers: {
    common: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
    },
  },
})

export class GoogleImages extends WorkerJob {
  max_images = 100

  static queue_config: QueueOptions = {
    limiter: {
      max: 20,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  constructor() {
    super()
  }

  async main() {
    const batch_size = 100
    let page = 0
    while (true) {
      console.log('GOOGLE IMAGES: Dish batch...')
      const dishes_batch = await tagGetAllCuisinesWithDishes(batch_size, page)
      if (dishes_batch.length == 0) break
      for (const dish of dishes_batch) {
        await this.runOnWorker('imagesForDish', [dish])
      }
      page += 1
    }
  }

  async imagesForDish(dish: TagWithId) {
    const dish_query = dish.parent?.name + ' ' + dish.name
    const images = await this.searchForImages(dish_query)
    const photos_xref = images.map((url) => {
      return {
        tag_id: dish.id,
        restaurant_id: ZeroUUID,
        photo: {
          origin: url,
        },
      }
    })
    await photoXrefUpsert(photos_xref)
    await uploadToDO(photos_xref)
    await updatePhotoQuality(photos_xref)
    const best_photos = await bestPhotosForTag(dish.id)
    const default_images = best_photos.map((p) => {
      if (!p.photo || !p.photo.url)
        throw 'imagesForDish(): Photo.url is undefined!?'
      return p.photo.url
    })
    const updated_dish: TagWithId = {
      id: dish.id,
      default_images,
    }
    await tagUpdate(updated_dish)
  }

  async searchForImages(dish: string) {
    const path =
      '?q=' +
      encodeURIComponent(dish) +
      '&client=firefox-b-d&gbv=2&source=lnms&tbm=isch&sa=X&biw=1920&bih=1138'
    let images: string[] = []
    const response = await axios.get(path)
    const expression = /,\["(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)).*/
    var regex = new RegExp(expression)
    for (const line of response.data.split('\n')) {
      if (line.startsWith(',["http') && this.isImageBigEnough(line)) {
        images.push(line.match(regex)[1])
        if (images.length >= this.max_images) break
      }
    }
    return images
  }

  isImageBigEnough(line: string) {
    const matches = line.match(/.*",([0-9]+),.*/)
    if (!matches) return false
    const width = parseInt(matches[1])
    return width > 400
  }
}

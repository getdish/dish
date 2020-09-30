import { TagWithId } from '@dish/graph'

import { GoogleImages } from './GoogleImages'

;(async () => {
  let images = new GoogleImages()
  images.max_images = 1
  await images.imagesForDish({
    id: '2b5c2eea-1139-4682-b667-c96b3375f1eb',
    name: 'Crepe',
    parent: {
      id: '877cd4eb-a804-4e16-8f28-35a285b18e3c',
      name: 'French',
    },
  } as TagWithId)
})()

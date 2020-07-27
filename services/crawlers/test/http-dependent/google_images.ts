import { deleteAllBy, tagFindOne, tagRefresh, tagUpsert } from '@dish/graph'
import test from 'ava'

import { GoogleImages } from '../../src/google_images/GoogleImages'

const parent_id = '3b5c2eea-1139-4682-b667-c96b3375f1eb'
const id = '2b5c2eea-1139-4682-b667-c96b3375f1eb'

test.beforeEach(async () => {
  await deleteAllBy('tag', 'id', id)
  await deleteAllBy('tag', 'id', parent_id)
  const parent_tag = {
    id: parent_id,
    name: 'French',
  }
  await tagUpsert([parent_tag])
  const tag = {
    id: id,
    name: 'Crepe',
    parentId: parent_id,
  }
  await tagUpsert([tag])
})

test('Finds and save images for a dish', async (t) => {
  let images = new GoogleImages()
  images.max_images = 1
  let tag = await tagFindOne({ id: id })
  await images.imagesForDish(tag)
  tag = await tagRefresh(tag)
  t.is(tag.default_images.length, 1)
})

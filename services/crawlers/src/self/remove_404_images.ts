import { deleteByIDs, globalTagId } from '@dish/graph'

import { getTableCount, photoBatchForAll } from '../utils'
import { Self } from './Self'

export async function remove404Images(internal: Self) {
  let previous_id = globalTagId
  let arrived = process.env.START_FROM ? false : true
  let progress = 0
  let page = 0
  console.log('Counting photos...')
  const count = await getTableCount('photo')
  const PER_PAGE = 10000
  console.log('Total photos: ' + count)
  while (true) {
    const results = await getFailableBatch(PER_PAGE, previous_id)
    if (results.length == 0) {
      await internal.job.progress(100)
      break
    }
    for (const result of results) {
      previous_id = result.id as string
      if (!arrived) {
        if (result.id != process.env.START_FROM) {
          continue
        } else {
          arrived = true
        }
      }
      await internal.runOnWorker('checkMaybeDeletePhoto', [
        result.id,
        result.url,
      ])
    }
    page += 1
    progress = ((page * PER_PAGE) / count) * 100
    if (process.env.RUN_WITHOUT_WORKER != 'true') {
      await internal.job.progress(progress)
    } else {
      console.log('Progress: ' + progress)
    }
  }
}

export async function checkMaybeDeletePhoto(photo_id: string, url: string) {
  if (!url) {
    await deletePhoto(photo_id)
    return
  }
  const result = await fetch(url)
  const response = await result.text()
  try {
    const json = JSON.parse(response)
    if (json.status == 404) {
      await deletePhoto(photo_id)
    }
  } catch (e) {
    if (!e.message.includes('Unexpected token')) {
      if (e.message.includes('Unexpected end of JSON input')) {
        await deletePhoto(photo_id)
      } else {
        console.error('Unexpected error for: ' + url)
        throw e
      }
    }
  }
  console.log('Photo OK: ' + url)
}

async function getFailableBatch(per_page: number, previous_id: string) {
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
  let retries = 0
  while (retries < 10) {
    try {
      return await photoBatchForAll(per_page, previous_id)
    } catch (e) {
      retries += 1
      await sleep(5000)
    }
  }
}

async function deletePhoto(id: string) {
  console.log('Deleting photo ' + id)
  await deleteByIDs('photo', [id])
}

if (require.main === module) {
  ;(async () => {
    const internal = new Self()
    await internal.addBigJob('remove404Images', [])
  })()
}

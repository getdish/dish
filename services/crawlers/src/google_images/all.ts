import { GoogleImages } from './GoogleImages'
;(async () => {
  const images = new GoogleImages()
  await images.runOnWorker('main')
})()

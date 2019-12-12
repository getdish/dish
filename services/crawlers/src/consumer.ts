import { Consumer } from 'orkid'

const consumer = new Consumer('crawlers', run)

async function run(data, metadata) {
  console.log(
    `Processing task from Queue: ${metadata.qname}. Task ID: ${metadata.id}. Data:`,
    data,
  )

  // will show in admin UI
  return Math.random()
}

import { Consumer, Producer } from 'orkid'

import { crawlYelp } from './yelp'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

const redisOptions = {
  port: 6379,
  host: 'redis',
}

console.log('Running2!')

type Task = {
  name: string
  intervalMinutes: number
  run: Function
}

const TASKS: Task[] = [
  {
    name: 'crawl-yelp-dishes',
    intervalMinutes: 60,
    run: crawlYelp,
  },
]

function main() {
  console.log('Starting crawlers...')
  for (const task of TASKS) {
    startProducer(task)
    startConsumer(task)
  }
}

async function startProducer(task: Task) {
  const producer = new Producer(task.name, {
    redisOptions,
  })
  let id = 0
  while (true) {
    id++
    await producer.addTask(task as any, `${task.name}-${id}`)
    await sleep(task.intervalMinutes)
  }
}

// TODO move into own processes
async function startConsumer(task: Task) {
  const consumer = new Consumer(task.name, runConsumer, {
    redisOptions,
    consumerOptions: {
      concurrencyPerInstance: 1,
      maxRetry: 1,
      workerFnTimeoutMs: 3000,
    },
  })

  async function runConsumer(data: Task, metadata: any) {
    console.log(
      `Processing task from Queue: ${metadata.qname}. Task ID: ${metadata.id}. Data:`,
      data
    )
    await task.run()
  }

  consumer.start()
}

main()

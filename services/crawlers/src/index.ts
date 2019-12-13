import { Consumer, Producer } from 'orkid'

import { crawlYelp } from './yelp'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

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
  for (const task of TASKS) {
    startProducer(task)
    startConsumer(task)
  }
}

async function startProducer(task: Task) {
  const producer = new Producer(task.name)
  let id = 0
  while (true) {
    id++
    await producer.addTask(task as any, `${task.name}-${id}`)
    await sleep(task.intervalMinutes)
  }
}

// TODO move into own processes
async function startConsumer(task: Task) {
  const consumer = new Consumer(task.name, () => {
    task.run()
  })
  consumer.start()
}

main()

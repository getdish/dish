import { Producer } from 'orkid'

export type Task = {
  name: string
  delaySeconds: number
  timeoutSeconds: number
}

const TASKS: Task[] = [
  {
    name: 'yelp-dishes',
    delaySeconds: 10,
    timeoutSeconds: 10,
  },
]

const producer = new Producer('crawlers')
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

for (const task of TASKS) {
  producer.runTask(task.name, task)
}

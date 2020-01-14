import { Yelp } from './Yelp'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

async function main() {
  const yelp = new Yelp()
  while (true) {
    yelp.run_on_worker()
    await sleep(1000)
  }
}

main()

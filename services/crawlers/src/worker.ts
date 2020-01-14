import { Worker } from '@dish/worker'

import { Yelp } from './Yelp'
import { UberEats } from './UberEats'

const worker = new Worker([new Yelp(), new UberEats()])

worker.run()

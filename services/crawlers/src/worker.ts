import { WorkerDaemon } from '@dish/worker'

import { Yelp } from './Yelp'
import { UberEats } from './UberEats'

const worker = new WorkerDaemon([Yelp, UberEats])

worker.run()

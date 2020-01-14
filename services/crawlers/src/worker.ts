import { WorkerDaemon } from '@dish/worker'

import { UberEats } from './UberEats'

const worker = new WorkerDaemon([UberEats])

worker.run()

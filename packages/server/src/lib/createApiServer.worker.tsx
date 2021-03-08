import { parentPort, workerData } from 'worker_threads'

import express from 'express'

import { createApiServer } from './createApiServer'

const config = workerData
const app = express()
console.log(` [api] worker on port ${config.port}`)
app.listen(config.port)
setTimeout(() => {
  createApiServer(app, config)
})
parentPort?.postMessage('done')

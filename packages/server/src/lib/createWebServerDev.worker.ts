import { parentPort, workerData } from 'worker_threads'

import express from 'express'

import { createWebServerDev } from './createWebServerDev'

const config = workerData
const app = express()
app.listen(config.port)
// setTimeout(() => {
//   createWebServerDev(app, config)
// })
console.log('worker created web server...')
parentPort?.postMessage('done')

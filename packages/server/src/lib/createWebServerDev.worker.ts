import { workerData } from 'worker_threads'

import express from 'express'

import { createWebServerDev } from './createWebServerDev'

const config = workerData
const app = express()
app.listen(config.port)
createWebServerDev(app, config)

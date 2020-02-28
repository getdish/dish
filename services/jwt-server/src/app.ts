import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import routes from './routes'
import { typeOrmConfig } from './config/connection'
import { User } from './models/User'

export default async () => {
  await createConnection(typeOrmConfig)
  await User.ensureAdminUser()
  const app = express()
  app.use(cors())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use('/', routes)
  return app
}

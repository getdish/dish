import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { createConnection } from 'typeorm'

import { typeOrmConfig } from './config/connection'
import { User } from './models/User'
import routes from './routes'

export default async () => {
  console.log('typeOrmConfig', typeOrmConfig)
  await createConnection(typeOrmConfig)
  await User.ensureAdminUser()
  const app = express()
  app.use(cors())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use('/', routes)
  return app
}

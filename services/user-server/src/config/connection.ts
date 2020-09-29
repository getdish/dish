import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

import { User } from '../models/User'

const typeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: 'dish',
  synchronize: false,
  logging: process.env.DISH_ENV == 'production',
  entities: [User],
}

export { typeOrmConfig }

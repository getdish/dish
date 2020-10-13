import { Router } from 'express'

import auth from './auth'
import review from './review'
import user from './user'

const routes = Router()

routes.use('/auth', auth)
routes.use('/user', user)
routes.use('/review', review)

export default routes

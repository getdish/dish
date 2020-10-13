import bodyParser from 'body-parser'
import { Router } from 'express'

import ReviewController from '../controllers/ReviewController'
import { checkJwt } from '../middlewares/checkJwt'
import { checkRole } from '../middlewares/checkRole'

const router = Router()

router.post(
  '/analyze',
  [checkJwt, checkRole(['user', 'admin'])],
  ReviewController.analyze
)

export default router

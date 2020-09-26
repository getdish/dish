import bodyParser from 'body-parser'
import { Router } from 'express'

import AppleAuthController from '../controllers/AppleAuthController'
import AuthController from '../controllers/AuthController'
import { checkJwt } from '../middlewares/checkJwt'

const router = Router()
router.post('/login', AuthController.login)
router.post('/change-password', [checkJwt], AuthController.changePassword)
router.post(
  '/apple_authorize',
  bodyParser.urlencoded({ extended: false }),
  AppleAuthController.authCallback
)

export default router

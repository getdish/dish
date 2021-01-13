import bodyParser from 'body-parser'
import { Router } from 'express'

import AppleAuthController from '../controllers/AppleAuthController'
import AuthController from '../controllers/AuthController'

const router = Router()
router.post('/forgot-password', AuthController.forgotPassword)
router.post('/password-reset', AuthController.passwordReset)

router.post('/apple_verify', AppleAuthController.verify)
router.post(
  '/apple_authorize',
  bodyParser.urlencoded({ extended: false }),
  AppleAuthController.authCallback
)
router.post(
  '/apple_authorize_chrome',
  bodyParser.urlencoded({ extended: false }),
  AppleAuthController.authCallback
)

export default router

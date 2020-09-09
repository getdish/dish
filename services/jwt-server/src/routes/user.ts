import { Router } from 'express'

import AppleAuthController from '../controllers/AppleAuthController'
import UserController from '../controllers/UserController'
import { checkJwt } from '../middlewares/checkJwt'
import { checkRole } from '../middlewares/checkRole'

const router = Router()

//Get all users
router.get('/', [checkJwt, checkRole(['admin'])], UserController.listAll)

// Get one user
router.get(
  '/:username',
  [checkJwt, checkRole(['admin'])],
  UserController.getOneByUsername
)

//Create a new user
router.post('/', [UserController.newUser])

// apple auth
router.post('/apple_authorize', [AppleAuthController.authCallback])

//Edit one user
router.patch(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['admin'])],
  UserController.editUser
)

//Delete one user
router.delete(
  '/:id([0-9]+)',
  [checkJwt, checkRole(['admin'])],
  UserController.deleteUser
)

export default router

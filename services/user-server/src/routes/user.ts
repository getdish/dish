import { Router } from 'express'

import UserController from '../controllers/UserController'
import UserImageController from '../controllers/UserImageController'
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

// user level permissions

//update user
router.post(
  '/updateUser',
  [checkJwt, checkRole(['user', 'admin'])],
  UserController.updateUser
)

// upload image
router.post('/uploadAvatar', [checkJwt], UserImageController.uploadImage)

export default router

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

//Create a new user
router.post('/', [UserController.newUser])

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

// user level permissions

//update user
router.post(
  '/updateUser',
  [checkJwt, checkRole(['user', 'admin'])],
  UserController.updateUser
)

// upload image
router.post('/image_upload', UserImageController.uploadImage)

export default router

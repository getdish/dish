import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { getUserFromResponse } from '../middlewares/checkRole'
import { User } from '../models/User'

class UserController {
  static listAll = async (_: Request, res: Response) => {
    const userRepository = getRepository(User)
    const users = await userRepository.find({
      select: ['id', 'username', 'role'], //We dont want to send the passwords on response
    })

    res.send(users)
  }

  static getOneByUsername = async (req: Request, res: Response) => {
    const username: string = req.params.username

    const userRepository = getRepository(User)
    try {
      const user = await userRepository.findOneOrFail(
        { username: username },
        {
          select: ['id', 'username', 'role'], //We dont want to send the password on response
        }
      )
      res.send(user)
    } catch (error) {
      res.status(404).send('User not found')
    }
  }

  static newUser = async (req: Request, res: Response) => {
    let { username, email, password } = req.body
    let user = new User()
    user.username = username
    user.password = password
    user.email = email
    user.role = 'user'

    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }

    user.hashPassword()

    const userRepository = getRepository(User)
    try {
      await userRepository.save(user)
    } catch (e) {
      res.status(409).json(['Username/email already in use'])
      return
    }

    res.status(201).send('User created')
  }

  static updateUser = async (req: Request, res: Response) => {
    const { username, about, location, charIndex } = req.body
    const { user, error } = await getUserFromResponse(res)

    if (error || !user) {
      return res.status(401).send(error)
    }

    user.has_onboarded = true
    user.email = user.email ?? 'default@dishapp.com'
    if (about !== null) user.about = about
    if (location !== null) user.location = location
    if (charIndex !== null) user.charIndex = charIndex

    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }

    try {
      const userRepository = getRepository(User)
      await userRepository.save(user)
    } catch (e) {
      res.status(409).send('failed')
      return
    }

    res.json({
      email: user.email,
      has_onboarded: user.has_onboarded,
      about: user.about,
      location: user.location,
      charIndex: user.charIndex,
      username: user.username,
    })
  }

  static editUser = async (req: Request, res: Response) => {
    const id = req.params.id

    const { username, email, role } = req.body

    const userRepository = getRepository(User)
    let user
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      res.status(404).send('User not found')
      return
    }

    user.email = email
    user.username = username
    user.role = role
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }

    try {
      await userRepository.save(user)
    } catch (e) {
      res.status(409).send('username already in use')
      return
    }
    res.status(204).send()
  }

  static deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id

    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (error) {
      res.status(404).send('User not found')
      return
    }
    userRepository.delete(id)

    //After all send a 204 (no content, but accepted) response
    res.status(204).send()
  }
}

export default UserController

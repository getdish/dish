import DishAuth from '@dish/auth'
import { User } from '@dish/graph'
import { Restaurant, Review } from '@dish/models'
import { Action, AsyncAction } from 'overmind'

import { Toast } from '../views/Toast'
import { attemptAuthenticatedAction } from './attemptAuthenticatedAction'

type UserState = {
  user: Partial<User>
  loading: boolean
  messages: string[]
  isLoggedIn: boolean
  allReviews: { [id: string]: Review }
  allVotes: { [id: string]: Review }
}

export const state: UserState = {
  user: {} as User,
  loading: false,
  messages: [],
  isLoggedIn: false,
  allReviews: {},
  allVotes: {},
}

const formatErrors = (torm_errors: any) => {
  let errors: string[] = []
  for (const torm_error of torm_errors) {
    for (const entry of Object.entries(torm_error.constraints)) {
      errors.push(entry[1] as string)
    }
  }
  return errors
}

const register: AsyncAction<
  { username: string; password: string },
  boolean
> = async (om, { username, password }) => {
  let result = false
  om.state.user.loading = true
  const [status, data] = await DishAuth.register(username, password)
  switch (status) {
    case 201:
      om.state.user.messages = ['Registered. You can now login.']
      result = true
      break
    case 409:
      om.state.user.messages = [data]
      break
    case status >= 400:
      om.state.user.messages = formatErrors(data)
      break
    default:
      break
  }
  om.state.user.loading = false
  return result
}

const checkForExistingLogin: Action = (om) => {
  if (DishAuth.has_been_logged_out) {
    Toast.show('Session expired: logged out')
  }
  if (DishAuth.isLoggedIn) {
    postLogin(om, DishAuth.user)
  }
}

const login: AsyncAction<{ username: string; password: string }> = async (
  om,
  { username, password }
) => {
  om.state.user.loading = true
  const [status, data] = await DishAuth.login(username, password)
  if (status >= 400) {
    om.state.user.isLoggedIn = false
    if (status == 400 || status == 401) {
      om.state.user.messages = ['Username or password not recognised']
    } else {
      om.state.user.messages = formatErrors(data)
    }
  } else {
    postLogin(om, data)
    Toast.show('Logged in as ' + om.state.user.user.username)
  }
  om.state.user.loading = false
}

const postLogin: Action<Partial<User>> = (om, user: Partial<User>) => {
  om.state.user.isLoggedIn = true
  om.state.user.user = user as any
}

const logout: AsyncAction = async (om) => {
  await DishAuth.logout()
  om.state.user.user = null
  om.state.user.isLoggedIn = false
  Toast.show('Logged out')
}

const ensureLoggedIn: Action<void, boolean> = (om) => {
  if (om.state.user.isLoggedIn) {
    return true
  }
  Toast.show('Login to do this!')
  om.actions.home.setShowUserMenu(true)
  return false
}

const vote: Action<Partial<Review>> = (om, { restaurant, ...val }) => {
  const review = new Review()
  review.restaurant_id = restaurant.id
  Object.assign(review, val)
}

const submitReview: AsyncAction<Review> = async (om, review) => {
  if (!om.state.user.user) {
    console.error('Not logged in')
    return
  }
  try {
    if (typeof review.id == 'undefined') {
      review.user_id = om.state.user.user.id
      await review.insert()
      review.id = review.id
    } else {
      await review.update()
    }
  } catch (err) {
    console.error(err)
    Toast.show(`Error submitting review, may need to re-login`)
  }
}

export const actions = {
  register,
  login,
  logout,
  checkForExistingLogin,
  ensureLoggedIn,
  vote,
  submitReview,
}

import { Toast } from '../views/Toast'
import { Om } from './home-types'

export const attemptAuthenticatedAction = async <
  A extends (...args: any[]) => any
>(
  om: Om,
  cb: A
): Promise<ReturnType<A>> => {
  try {
    return await cb()
  } catch (err) {
    if (`${err.message}`.includes('JWTExpired')) {
      // logout
      Toast.show(`Login has expired`)
      await om.actions.user.logout()
    } else {
      throw err
    }
  }
}

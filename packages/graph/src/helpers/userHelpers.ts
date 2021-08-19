import { User } from '../types'

export const getUserName = (user: User) => {
  return (user.name || user.username) ?? ''
}

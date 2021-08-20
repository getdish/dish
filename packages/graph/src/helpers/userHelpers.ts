import { User } from '../types'

export const getUserName = (user: Partial<User>) => {
  return (user.name || user.username) ?? ''
}

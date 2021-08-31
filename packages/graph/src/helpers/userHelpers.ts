import { user } from '../graphql'

export const getUserName = (user?: Partial<user> | null) => {
  if (!user) return ''
  return (user.name || user.username) ?? ''
}

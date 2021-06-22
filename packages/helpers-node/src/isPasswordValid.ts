import { compareSync } from 'bcryptjs'

export function isPasswordValid(password: string, hash: string) {
  if (password && hash) {
    return compareSync(password, hash)
  }
  return false
}

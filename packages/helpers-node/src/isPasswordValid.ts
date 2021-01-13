import { compareSync } from 'bcryptjs'

export function isPasswordValid(password: string, hash: string) {
  return compareSync(password, hash)
}

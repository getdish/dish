import { hashSync } from 'bcryptjs'

export function hashPassword(password: string) {
  return hashSync(password, 8)
}

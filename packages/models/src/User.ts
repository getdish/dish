import { ModelBase } from './ModelBase'

export class User extends ModelBase<User> {
  username!: string
  password!: string
  role!: string

  constructor(init?: Partial<User>) {
    super()
    Object.assign(this, init)
  }

  static model_name() {
    return 'User'
  }

  static fields() {
    return ['username', 'role']
  }
}

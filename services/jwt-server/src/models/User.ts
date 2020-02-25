import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  getRepository,
} from 'typeorm'
import { Length, IsNotEmpty } from 'class-validator'
import * as bcrypt from 'bcryptjs'

const DEFAULT_PASSWORD = 'password'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD

if (
  process.env.DISH_ENV == 'production' &&
  ADMIN_PASSWORD == DEFAULT_PASSWORD
) {
  throw new Error('Default admin password being used in production')
}

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  @Length(4, 20)
  username!: string

  @Column()
  @Length(4, 100)
  password!: string

  @Column()
  @IsNotEmpty()
  role!: string

  @Column()
  @CreateDateColumn()
  created_at!: Date

  @Column()
  @UpdateDateColumn()
  updated_at!: Date

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8)
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password)
  }

  static async ensureAdminUser() {
    const userRepository = getRepository(User)
    let user = await userRepository.findOne({ username: 'admin' })
    if (!user) {
      user = new User()
      Object.assign(user, {
        username: 'admin',
        role: 'ADMIN',
        password: ADMIN_PASSWORD,
      })
      user.hashPassword()
      await userRepository.insert(user)
    } else {
      user.password = ADMIN_PASSWORD
      user.hashPassword()
      await userRepository.update(user.id, { password: user.password })
    }
  }
}

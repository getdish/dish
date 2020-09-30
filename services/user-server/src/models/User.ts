import * as bcrypt from 'bcryptjs'
import { IsNotEmpty, Length } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  getRepository,
} from 'typeorm'

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
  @Length(4, 250)
  email!: string

  @Column()
  @Length(4, 100)
  password!: string

  @Column()
  @IsNotEmpty()
  role!: string

  @Column()
  about!: string

  @Column()
  location!: string

  @Column()
  charIndex!: number

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
        email: 'team@dishapp.com',
        role: 'admin',
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

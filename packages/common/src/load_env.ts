import path from 'path'
import dotenv from 'dotenv'
import findUp from 'find-up'

const root = findUp.sync('.git', { type: 'directory' })

if (root) {
  const env_path = path.resolve(root + '/../.env')
  console.log('Initializing dotenv at ' + env_path)
  dotenv.config({ path: env_path })
}

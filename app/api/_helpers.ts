import { SQL_DIR } from './_constants'
import { readFile } from 'fs-extra'
import { join } from 'path'

export const getSqlFile = async (name: string) => {
  return await readFile(join(SQL_DIR, name), 'utf-8')
}

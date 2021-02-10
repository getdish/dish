import './lib/env'

import { join } from 'path'

import { run as oclifRun } from '@oclif/command'
import { existsSync, moveSync } from 'fs-extra'

const tsConfFile = join(require.resolve(__dirname), '..', '..', 'tsconfig.json')

export async function run() {
  const tmpFile = `${tsConfFile}.bak`
  moveSync(tsConfFile, tmpFile)

  // prevent oclif from loading ts-node itself grr
  const moveBack = () => {
    if (existsSync(tmpFile)) {
      moveSync(tmpFile, tsConfFile)
    }
  }

  setTimeout(() => {
    moveBack()
  }, 1000)
  process.on('exit', moveBack)

  await oclifRun()
    .then(require('@oclif/command/flush'))
    // @ts-ignore (TS complains about using `catch`)
    .catch(require('@oclif/errors/handle'))
}

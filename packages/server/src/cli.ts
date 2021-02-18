import './lib/env'

import { join } from 'path'

import { run as oclifRun } from '@oclif/command'
import { existsSync, moveSync } from 'fs-extra'

const tsConfFile = join(require.resolve(__dirname), '..', '..', 'tsconfig.json')
const tmpFile = `${tsConfFile}.bak`

// prevent oclif from loading ts-node itself grr
const moveBack = () => {
  if (existsSync(tmpFile)) {
    moveSync(tmpFile, tsConfFile)
  }
}

export async function run() {
  try {
    moveSync(tsConfFile, tmpFile)
  } catch (err) {
    console.log('error moving', tsConfFile, err)
    moveBack()
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

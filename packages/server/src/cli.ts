import './lib/env'

import { run as oclifRun } from '@oclif/command'

export function run() {
  oclifRun()
    .then(require('@oclif/command/flush'))
    // @ts-ignore (TS complains about using `catch`)
    .catch(require('@oclif/errors/handle'))
}

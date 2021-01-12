require('v8-compile-cache')
const cacheFile = require('path').join(__dirname, '.dish-cli-cache')
const lazyLoad = require('@salesforce/lazy-require').default.create(cacheFile)
lazyLoad.start()

import { run as oclifRun } from '@oclif/command'

export function run() {
  oclifRun()
    .then(require('@oclif/command/flush'))
    // @ts-ignore (TS complains about using `catch`)
    .catch(require('@oclif/errors/handle'))
}

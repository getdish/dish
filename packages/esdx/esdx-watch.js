#!/usr/bin/env node

const exec = require('execa')
const legacy = process.argv.reverse()[0] === 'legacy'
const cmd = `chokidar`
const args = [
  `src`,
  `-c`,
  `"node ${__dirname}/esdx.js${legacy ? ' legacy' : ''}"`,
]
console.log(cmd, args.join(' '))
const proc = exec(cmd, args, {
  env: {
    NO_CLEAN: true,
  },
})
proc.stdout.pipe(process.stdout)
proc.stderr.pipe(process.stderr)

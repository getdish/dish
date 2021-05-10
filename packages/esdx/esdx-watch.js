#!/usr/bin/env node

const exec = require('execa')

const legacy = process.argv.includes() === 'legacy'

const cmd = `chokidar`
const args = [`src`, `-c`, `"node ${__dirname}/esdx.js${legacy ? ' legacy' : ''}"`]
console.log(cmd, args.join(' '))
const proc = exec(cmd, args, {
  env: {
    NO_CLEAN: true,
  },
})
proc.stdout.addListener('data', (x) => {
  console.log(x.toString())
})
proc.stderr.pipe(process.stderr)

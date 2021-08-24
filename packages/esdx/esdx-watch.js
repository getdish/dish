#!/usr/bin/env node

// const exec = require('execa')

const chokidar = require('chokidar')

process.env.DISABLE_AUTORUN = true

const esdx = require('./esdx')
const legacy = process.argv.includes('legacy')
// const skipTypes = process.argv.includes('skip-types')

const compile = () => {
  // lets always skip types as it runs in every process
  esdx.go({ legacy, skipTypes: true })
}

chokidar
  .watch('src', {
    persistent: true,
    alwaysStat: false,
    ignoreInitial: true,
  })
  .on('add', compile)
  .on('change', compile)

// compile once on start watch could make this optional
compile()

// const cmd = `chokidar`
// const args = [
//   `src`,
//   `-c`,
//   `"node ${__dirname}/esdx.js${legacy ? ' legacy' : ''}${skipTypes ? ' skip-types' : ''}"`,
// ]

// console.log('esdx watch > ', cmd, args.join(' '))
// const proc = exec(cmd, args, {
//   env: {
//     NO_CLEAN: true,
//   },
// })
// proc.stdout.addListener('data', (x) => {
//   console.log(x.toString())
// })
// proc.stderr.pipe(process.stderr)

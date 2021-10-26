#!/usr/bin/env node

const chokidar = require('chokidar')

process.env.DISABLE_AUTORUN = true

const esdx = require('./esdx')
const legacy = process.argv.includes('legacy')
const skipTypes = process.argv.includes('skip-types')
const jsx = process.argv.includes('--jsx')

const compile = () => {
  // lets always skip types as it runs in every process
  esdx.go({ legacy, skipTypes, jsx })
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

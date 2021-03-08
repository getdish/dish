#!/usr/bin/env node

const exec = require('execa')

async function go() {
  let dirname = await exec(`$(dirname $(realpath $0))`)
  exec(`chokidar src -c "NO_CHECK=true ${dirname}/esdx.js"`)
}

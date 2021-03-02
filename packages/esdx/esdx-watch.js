#!/usr/bin/env node

const exec = execa('@yarnpkg/shell')

async function go() {
  let dirname = await exec(`$(dirname $(realpath $0))`)
  exec(`chokidar src -c "NO_CHECK=true ${dirname}/esdx.sh"`)
}

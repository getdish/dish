const package = require('../package.json')

const hoists = {
  react: true,
  'react-dom': true,
}

const noHoists = Object.keys(package.dependencies)
  .filter((x) => !hoists[x])
  .map((k) => [k, `${k}/**`])
  .flat()

package.workspaces.nohoist = noHoists

const fs = require('fs')
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2), 'utf8')

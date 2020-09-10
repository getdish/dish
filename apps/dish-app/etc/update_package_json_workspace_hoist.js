const package = require('../package.json')

const hoists = {
  react: true,
  'react-dom': true,
  'react-native': true,
}

const noHoists = Object.keys(package.dependencies).filter((x) => !hoists[x])

package.workspaces.nohoist = noHoists

const fs = require('fs')
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2), 'utf8')

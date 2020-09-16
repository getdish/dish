const package = require('../package.json')

const hoists = {
  '@o/gqless-react': true,
  '@o/gqless-schema': true,
  '@o/gqless': true,
}

const noHoists = Object.keys(package.dependencies)
  .filter((x) => !hoists[x] && !x.startsWith('@dish/'))
  .map((k) => [k, `${k}/**`])
  .flat()

package.workspaces.nohoist = noHoists

const fs = require('fs')
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2), 'utf8')

console.log('updated hoists')

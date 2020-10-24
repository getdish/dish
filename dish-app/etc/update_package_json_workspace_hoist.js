const package = require('../package.json')

const hoists = {
  '@gqless/react': true,
  '@gqless/schema': true,
  '@gqless/utils': true,
  gqless: true,
  snackui: true,
}

const noHoists = [
  // dev deps that no hoist
  'babel-plugin-transform-inline-environment-variables',
  ...Object.keys(package.dependencies).filter(
    (x) => !hoists[x] && !x.startsWith('@dish/')
  ),
]
  .map((k) => [k, `${k}/**`])
  // @ts-ignore
  .flat()

package.workspaces.nohoist = noHoists

const fs = require('fs')
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2), 'utf8')

console.log('updated hoists')
